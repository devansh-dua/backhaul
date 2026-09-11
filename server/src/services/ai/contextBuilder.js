const User = require('../../models/User');
const Trip = require('../../models/Trip');
const Vehicle = require('../../models/Vehicle');
const Driver = require('../../models/Driver');
const Capacity = require('../../models/Capacity');
const Shipment = require('../../models/Shipment');
const candidateMatcher = require('./candidateMatcher');
const trustService = require('../trust.service');

class ContextBuilder {
  /**
   * Build real database context for Gemini Copilot interpretation.
   */
  async buildContext(userId, role, clientContext = {}) {
    const user = await User.findById(userId).select('-password');
    const userRole = role || user?.role || 'CARRIER';
    
    let trustProfile = null;
    let topPartners = [];
    if (user?._id) {
      try {
        trustProfile = await trustService.getTrustProfile(user._id);
        topPartners = await trustService.getTopTrustedPartners(user._id);
      } catch (e) {
        console.error('ContextBuilder trust fetching error:', e.message);
      }
    }

    let contextData = {
      user: {
        id: user?._id,
        name: user?.name,
        role: userRole,
        companyName: user?.companyName || user?.company,
        trustScore: trustProfile?.trustScore || null,
        displayScore: trustProfile?.displayScore || 'New Partner',
        statusLabel: trustProfile?.statusLabel || 'New Partner',
        trustProfile: trustProfile ? {
          completedShipments: trustProfile.completedShipments,
          onTimeRate: trustProfile.onTimeRate,
          cancellationRate: trustProfile.cancellationRate,
          repeatPartnersCount: trustProfile.repeatPartnersCount,
          ratingsCount: trustProfile.ratingsCount,
          averageRating: trustProfile.averageRating,
          recentRatings: trustProfile.recentRatings
        } : null,
        topPartners: topPartners.slice(0, 5)
      },
      page: clientContext.page || 'dashboard',
      clientContext
    };

    if (userRole === 'CARRIER' || userRole === 'DRIVER') {
      // 1. Carrier Vehicles
      const vehicles = await Vehicle.find({ carrier: userId, isActive: true });
      // 2. Carrier Driver Status
      const driver = await Driver.findOne({ carrier: userId });
      // 3. Current Active Trip
      const activeTrip = await Trip.findOne({
        carrier: userId,
        status: { $in: ['BOOKED', 'EN_ROUTE_PICKUP', 'AT_PICKUP', 'IN_TRANSIT', 'AT_DELIVERY'] }
      }).populate('shipments vehicle driver');

      // 4. Published Capacities
      const openCapacities = await Capacity.find({ carrier: userId, status: 'OPEN' });

      // 5. Currently Available Load Demand along carrier's corridor
      const defaultOrigin = openCapacities[0]?.origin || vehicles[0]?.currentCity || 'Delhi';
      const defaultDest = openCapacities[0]?.destination || vehicles[0]?.destinationCity || 'Jaipur';
      const defaultWeight = openCapacities[0]?.availableCapacityTons || vehicles[0]?.availableCapacityTons || 2.5;

      const loadMatchResult = await candidateMatcher.findFeasibleCandidates({
        pickupLocation: defaultOrigin,
        dropLocation: defaultDest,
        weightTons: defaultWeight,
        pickupDate: 'Today'
      });

      // 6. Currently Viewed Load/Shipment details if user is on a specific page
      let targetEntity = null;
      if (clientContext.shipmentId) {
        targetEntity = await Shipment.findById(clientContext.shipmentId);
      } else if (clientContext.capacityId) {
        targetEntity = await Capacity.findById(clientContext.capacityId).populate('vehicle carrier');
      }

      contextData.carrierContext = {
        vehiclesCount: vehicles.length,
        primaryVehicle: vehicles[0] ? {
          id: vehicles[0]._id,
          registrationNumber: vehicles[0].registrationNumber,
          availableCapacityTons: vehicles[0].availableCapacityTons,
          totalCapacityTons: vehicles[0].totalCapacityTons,
          currentCity: vehicles[0].currentCity,
          destinationCity: vehicles[0].destinationCity
        } : null,
        driver: driver ? {
          name: driver.name,
          availabilityStatus: driver.availabilityStatus,
          restStatus: driver.restStatus,
          remainingHours: driver.remainingDrivingHours
        } : null,
        activeTrip: activeTrip ? {
          tripId: activeTrip._id,
          status: activeTrip.status,
          route: `${activeTrip.origin} → ${activeTrip.destination}`,
          grossRevenueINR: activeTrip.grossRevenueINR,
          deliveryOTP: activeTrip.deliveryOTP ? '****' : null
        } : null,
        openCapacitiesCount: openCapacities.length,
        openCapacities: openCapacities.map(c => ({
          id: c._id,
          origin: c.origin,
          destination: c.destination,
          availableCapacityTons: c.availableCapacityTons
        })),
        availableLoadsCount: loadMatchResult.feasibleCandidates.length,
        availableLoads: loadMatchResult.feasibleCandidates.slice(0, 3).map(l => ({
          capacityId: l.capacityId,
          vehicleId: l.vehicleId,
          vehicleNumber: l.vehicleNumber,
          route: l.plannedRoute,
          weight: l.shipmentWeight,
          availableCapacity: l.availableCapacity,
          priceINR: l.estimatedPrice,
          detourKm: l.totalDetourKm,
          matchScore: l.matchScore
        })),
        targetEntity
      };

    } else if (userRole === 'SHIPPER') {
      // 1. Active Posted Shipments
      const activeShipments = await Shipment.find({
        shipper: userId,
        status: { $ne: 'DELIVERED' }
      }).sort({ createdAt: -1 });

      // 2. Completed Shipments Count
      const completedCount = await Shipment.countDocuments({ shipper: userId, status: 'DELIVERED' });

      // 3. Currently viewed Shipment/Capacity
      let targetEntity = null;
      if (clientContext.shipmentId) {
        targetEntity = await Shipment.findById(clientContext.shipmentId);
      }

      contextData.shipperContext = {
        activeShipmentsCount: activeShipments.length,
        completedCount,
        recentShipments: activeShipments.slice(0, 3).map(s => ({
          id: s._id,
          pickupCity: s.pickupCity,
          dropCity: s.dropCity,
          weightTons: s.weightTons,
          cargoType: s.cargoType,
          status: s.status,
          offeredPriceINR: s.offeredPriceINR
        })),
        targetEntity
      };
    }

    return contextData;
  }
}

module.exports = new ContextBuilder();
