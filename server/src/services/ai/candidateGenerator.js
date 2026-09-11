const Shipment = require('../../models/Shipment');
const Vehicle = require('../../models/Vehicle');
const routeService = require('../route.service');
const driverHoursService = require('../driverHours.service');

class CandidateGenerator {
  async getFeasibleCandidatesForVehicle(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');

    // Retrieve active posted shipments from MongoDB
    const shipments = await Shipment.find({ status: 'POSTED' });

    const candidates = [];

    for (const s of shipments) {
      // 1. Capacity Hard Constraint
      if (s.weightTons > vehicle.availableCapacityTons) continue;

      // 2. Route Compatibility & Detour Hard Constraint
      const detourKm = routeService.calculateDetour(
        vehicle.currentCity,
        vehicle.destinationCity,
        s.pickupCity,
        s.dropCity
      );
      if (detourKm > 90) continue; // Max allowable detour threshold

      // 3. Driver Hours Hard Constraint
      const baseDist = routeService.calculateDistance(
        routeService.getCoords(vehicle.currentCity).lat,
        routeService.getCoords(vehicle.currentCity).lng,
        routeService.getCoords(vehicle.destinationCity).lat,
        routeService.getCoords(vehicle.destinationCity).lng
      );
      const dhValidation = driverHoursService.validateDriverHours(vehicle, detourKm, baseDist);
      if (!dhValidation.isSafe) continue;

      // 4. Cargo Restrictions
      if (vehicle.cargoRestrictions && vehicle.cargoRestrictions.length > 0) {
        if (vehicle.cargoRestrictions.includes(s.cargoType)) continue;
      }

      candidates.push({
        shipment: s,
        detourKm,
        driverHoursCheck: dhValidation
      });
    }

    return { vehicle, candidates };
  }
}

module.exports = new CandidateGenerator();
