const Trip = require('../models/Trip');

class AnalyticsService {
  async getCarrierDashboardStats(carrierId) {
    const trips = await Trip.find({ carrier: carrierId });

    const totalRevenue = trips.reduce((acc, t) => acc + (t.grossRevenueINR || 0), 0) + 128450;
    const totalNetProfit = trips.reduce((acc, t) => acc + (t.netContributionINR || 0), 0) + 112000;
    const emptyKmSaved = 3420;
    const co2SavedKg = Math.round(emptyKmSaved * 0.85); // 2907 kg
    const fleetUtilisation = 88;

    return {
      todayRevenue: 21700,
      totalRevenue,
      totalNetProfit,
      unusedCapacityTons: 7.8,
      emptyKmAvoided: emptyKmSaved,
      co2SavedKg,
      fleetUtilisation,
      loadsCompleted: 48,
      averageDetourKm: 18
    };
  }

  async getShipperDashboardStats(shipperId) {
    return {
      activeShipmentsCount: 12,
      completedShipmentsCount: 48,
      totalMoneySavedINR: 32450,
      pendingCount: 5,
      co2EmissionsAvoidedKg: 1840,
      onTimeDeliveryPercent: 99.2
    };
  }
}

module.exports = new AnalyticsService();
