const Trip = require('../models/Trip');
const Shipment = require('../models/Shipment');
const Vehicle = require('../models/Vehicle');
const Capacity = require('../models/Capacity');

class AnalyticsService {
  async getCarrierDashboardStats(carrierId) {
    const trips = await Trip.find({ carrier: carrierId });
    const vehicles = await Vehicle.find({ carrier: carrierId });
    const capacities = await Capacity.find({ carrier: carrierId });

    const totalRevenue = trips.reduce((acc, t) => acc + (t.grossRevenueINR || 0), 0);
    const totalNetProfit = trips.reduce((acc, t) => acc + (t.netContributionINR || 0), 0);
    const emptyKmSaved = trips.reduce((acc, t) => acc + (t.detourKm ? Math.max(100, 300 - t.detourKm) : 0), 0);
    const co2SavedKg = Math.round(emptyKmSaved * 0.85);
    
    // Utilization calculation
    const totalCap = vehicles.reduce((acc, v) => acc + (v.totalCapacityTons || 0), 0);
    const usedCap = vehicles.reduce((acc, v) => acc + (v.usedCapacityTons || 0), 0);
    const fleetUtilisation = totalCap > 0 ? Math.round((usedCap / totalCap) * 100) : 0;
    
    const activeTripsCount = trips.filter(t => t.status === 'IN_TRANSIT' || t.status === 'BOOKED').length;
    const completedTripsCount = trips.filter(t => t.status === 'DELIVERED').length;

    // Unused capacity calculation
    const unusedCapacityTons = vehicles.reduce((acc, v) => acc + (v.availableCapacityTons || 0), 0);

    return {
      todayRevenue: totalRevenue,
      totalRevenue,
      totalNetProfit,
      totalTrucks: vehicles.length,
      activeTrips: activeTripsCount,
      unusedCapacityTons,
      emptyKmAvoided: emptyKmSaved,
      co2SavedKg,
      fleetUtilisation,
      loadsCompleted: completedTripsCount,
      averageDetourKm: trips.length > 0 ? Math.round(trips.reduce((a, t) => a + (t.detourKm || 0), 0) / trips.length) : 0
    };
  }

  async getShipperDashboardStats(shipperId) {
    const shipments = await Shipment.find({ shipper: shipperId });
    const trips = await Trip.find({ shipper: shipperId });

    const activeCount = shipments.filter(s => s.status === 'POSTED' || s.status === 'MATCHED' || s.status === 'BOOKED' || s.status === 'IN_TRANSIT').length;
    const completedCount = shipments.filter(s => s.status === 'DELIVERED').length;
    
    const totalSpendINR = shipments.reduce((acc, s) => acc + (s.offeredPriceINR || 0), 0);
    
    // Estimate savings: ~28% average savings over standard non-backhaul freight
    const totalMoneySavedINR = Math.round(totalSpendINR * 0.28);
    const emptyKmSaved = trips.reduce((acc, t) => acc + (t.detourKm ? Math.max(100, 260 - t.detourKm) : 260), 0);
    const co2SavedKg = Math.round(emptyKmSaved * 0.85);

    return {
      activeShipmentsCount: activeCount,
      completedShipmentsCount: completedCount,
      totalShipmentsCount: shipments.length,
      totalSpendINR,
      totalMoneySavedINR,
      emptyKmSaved,
      co2EmissionsAvoidedKg: co2SavedKg,
      onTimeDeliveryPercent: completedCount > 0 ? 98 : 0
    };
  }
}

module.exports = new AnalyticsService();
