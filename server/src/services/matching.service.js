const matchRanker = require('./ai/matchRanker');
const Match = require('../models/Match');
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Shipment = require('../models/Shipment');

class MatchingService {
  async getTopRecommendationForVehicle(vehicleId) {
    return await matchRanker.getOrGenerateMatchForVehicle(vehicleId);
  }

  async acceptMatch(carrierId, matchData) {
    const vehicle = await Vehicle.findById(matchData.vehicle._id || matchData.vehicle);
    
    // Create new active trip
    const trip = await Trip.create({
      carrier: carrierId,
      vehicle: vehicle._id,
      shipments: matchData.shipments || [],
      origin: vehicle.currentCity || 'Delhi',
      destination: vehicle.destinationCity || 'Jaipur',
      status: 'IN_TRANSIT',
      grossRevenueINR: matchData.grossRevenueINR || 21700,
      netContributionINR: matchData.netContributionINR || 18900,
      detourKm: matchData.detourKm || 24,
      co2SavedKg: matchData.co2SavedKg || 220,
      currentPosition: {
        lat: 28.6139,
        lng: 77.2090,
        city: 'Delhi'
      },
      currentSpeedKm: 62,
      eta: '3 hrs 45 mins'
    });

    // Update vehicle available capacity
    if (matchData.totalWeight) {
      vehicle.availableCapacityTons = Math.max(0, vehicle.availableCapacityTons - matchData.totalWeight);
      vehicle.usedCapacityTons = vehicle.totalCapacityTons - vehicle.availableCapacityTons;
      await vehicle.save();
    }

    // Update shipments status to MATCHED/IN_TRANSIT
    if (matchData.shipments && matchData.shipments.length > 0) {
      await Shipment.updateMany(
        { _id: { $in: matchData.shipments } },
        { status: 'IN_TRANSIT' }
      );
    }

    return trip;
  }
}

module.exports = new MatchingService();
