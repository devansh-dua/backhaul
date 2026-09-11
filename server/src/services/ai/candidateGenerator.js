const Shipment = require('../../models/Shipment');
const Vehicle = require('../../models/Vehicle');
const Capacity = require('../../models/Capacity');
const Driver = require('../../models/Driver');
const routeService = require('../route.service');
const driverHoursService = require('../driverHours.service');
const pricingService = require('../pricing.service');

class CandidateGenerator {
  // Find compatible capacity for a given Shipment (Shipper matching flow)
  async getFeasibleCapacitiesForShipment(shipmentId) {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) throw new Error('Shipment not found');

    const openCapacities = await Capacity.find({ status: 'OPEN' }).populate('carrier vehicle');
    const candidates = [];

    for (const cap of openCapacities) {
      if (!cap.vehicle || !cap.carrier) continue;

      // 1. Capacity Hard Constraint
      if (cap.availableCapacityTons < shipment.weightTons) continue;

      // 2. Driver Hours & Availability Check
      const carrierId = cap.carrier._id || cap.carrier;
      const driver = await Driver.findOne({ carrier: carrierId, availabilityStatus: { $ne: 'UNAVAILABLE' } });
      if (driver && driver.remainingDrivingHours < 3) continue;

      // 3. Route & Detour Constraint
      const detourKm = routeService.calculateDetour(
        cap.origin,
        cap.destination,
        shipment.pickupCity,
        shipment.dropCity
      );
      if (detourKm > 100) continue; // max allowable detour

      // 4. Cargo Restrictions
      if (cap.cargoRestrictions && cap.cargoRestrictions.length > 0) {
        if (cap.cargoRestrictions.includes(shipment.cargoType)) continue;
      }

      // 5. Pricing calculation
      const dist = routeService.calculateDistance(
        routeService.getCoords(cap.origin).lat,
        routeService.getCoords(cap.origin).lng,
        routeService.getCoords(cap.destination).lat,
        routeService.getCoords(cap.destination).lng
      );
      const economics = pricingService.calculatePricing({
        weightTons: shipment.weightTons,
        vehicleCapacityTons: cap.totalCapacityTons,
        distanceKm: dist,
        detourKm,
        offeredPriceINR: shipment.offeredPriceINR
      });

      candidates.push({
        capacity: cap,
        vehicle: cap.vehicle,
        carrier: cap.carrier,
        shipment,
        detourKm,
        economics,
        driverHoursCheck: { isSafe: true }
      });
    }

    return { shipment, candidates };
  }

  // Find compatible shipments for a given Vehicle (Carrier matching flow)
  async getFeasibleCandidatesForVehicle(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');

    const shipments = await Shipment.find({ status: 'POSTED' });
    const candidates = [];

    for (const s of shipments) {
      if (s.weightTons > vehicle.availableCapacityTons) continue;

      const detourKm = routeService.calculateDetour(
        vehicle.currentCity,
        vehicle.destinationCity,
        s.pickupCity,
        s.dropCity
      );
      if (detourKm > 90) continue;

      const baseDist = routeService.calculateDistance(
        routeService.getCoords(vehicle.currentCity).lat,
        routeService.getCoords(vehicle.currentCity).lng,
        routeService.getCoords(vehicle.destinationCity).lat,
        routeService.getCoords(vehicle.destinationCity).lng
      );
      const dhValidation = driverHoursService.validateDriverHours(vehicle, detourKm, baseDist);
      if (!dhValidation.isSafe) continue;

      if (vehicle.cargoRestrictions && vehicle.cargoRestrictions.length > 0) {
        if (vehicle.cargoRestrictions.includes(s.cargoType)) continue;
      }

      const economics = pricingService.calculatePricing({
        weightTons: s.weightTons,
        vehicleCapacityTons: vehicle.totalCapacityTons,
        distanceKm: baseDist,
        detourKm,
        offeredPriceINR: s.offeredPriceINR
      });

      candidates.push({
        shipment: s,
        detourKm,
        economics,
        driverHoursCheck: dhValidation
      });
    }

    return { vehicle, candidates };
  }
}

module.exports = new CandidateGenerator();
