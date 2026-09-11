const Capacity = require('../../models/Capacity');
const Vehicle = require('../../models/Vehicle');
const Driver = require('../../models/Driver');
const Shipment = require('../../models/Shipment');
const routeService = require('../route.service');
const pricingService = require('../pricing.service');
const matchingConfig = require('../../config/matchingConfig');

class CandidateMatcher {
  /**
   * Find and evaluate all published MongoDB capacity records against hard constraints.
   * @param {Object} queryParams - { pickupLocation, dropLocation, weightTons, shipmentType, pickupDate, shipmentId }
   */
  async findFeasibleCandidates(queryParams = {}) {
    let {
      pickupLocation = 'Delhi',
      dropLocation = 'Jaipur',
      weightTons = 2.5,
      shipmentType = 'General Freight',
      pickupDate = 'Today',
      shipmentId
    } = queryParams;

    if (shipmentId) {
      const shipment = await Shipment.findById(shipmentId);
      if (shipment) {
        pickupLocation = shipment.pickupCity || pickupLocation;
        dropLocation = shipment.dropCity || dropLocation;
        weightTons = shipment.weightTons || weightTons;
        shipmentType = shipment.cargoType || shipmentType;
      }
    }

    weightTons = Number(weightTons) || 2.5;

    // Fetch all open/available capacity records from MongoDB
    const openCapacities = await Capacity.find({
      status: { $in: ['OPEN', 'AVAILABLE', 'PUBLISHED', 'ACTIVE'] }
    }).populate('carrier vehicle');

    const feasibleCandidates = [];
    const diagnostics = {
      totalChecked: openCapacities.length,
      failedStatusCount: 0,
      failedCapacityCount: 0,
      failedRouteCount: 0,
      failedTimeCount: 0,
      failedDriverCount: 0
    };
    const globalRejectionReasons = [];

    // Coordinates for requested route
    const cPickup = routeService.getCoords(pickupLocation);
    const cDrop = routeService.getCoords(dropLocation);
    const shipmentDistanceKm = routeService.calculateDistance(
      cPickup.lat, cPickup.lng, cDrop.lat, cDrop.lng
    ) || 260;

    for (const cap of openCapacities) {
      const vehicle = cap.vehicle;
      const carrier = cap.carrier;

      const vehicleReg = vehicle?.registrationNumber || 'Vehicle';
      const carrierName = carrier?.companyName || carrier?.name || 'Verified Carrier';
      const vehicleType = vehicle?.vehicleType || 'HEAVY_TRUCK';

      const candidateRejectionReasons = [];

      // A. VEHICLE STATUS CHECK
      const validStatuses = ['OPEN', 'AVAILABLE', 'PUBLISHED', 'ACTIVE'];
      if (!validStatuses.includes(cap.status)) {
        diagnostics.failedStatusCount++;
        candidateRejectionReasons.push(`Status '${cap.status}' is not active/available`);
        continue;
      }

      // B. CAPACITY HARD CONSTRAINT
      if (cap.availableCapacityTons < weightTons) {
        diagnostics.failedCapacityCount++;
        candidateRejectionReasons.push(`Available capacity ${cap.availableCapacityTons}T is less than shipment weight ${weightTons}T`);
        if (!globalRejectionReasons.includes(`Available capacity is below ${weightTons}T`)) {
          globalRejectionReasons.push(`Available capacity is below ${weightTons}T`);
        }
        continue;
      }

      // C. ROUTE COMPATIBILITY & DETOUR CALCULATION
      const cOrigin = routeService.getCoords(cap.origin);
      const cDest = routeService.getCoords(cap.destination);
      const originalRouteKm = routeService.calculateDistance(
        cOrigin.lat, cOrigin.lng, cDest.lat, cDest.lng
      ) || 270;

      // Pickup detour: distance from vehicle origin to shipment pickup point along corridor
      let pickupDetourKm = 0;
      if (cap.origin.toLowerCase().trim() !== pickupLocation.toLowerCase().trim()) {
        const rawPickupDetour = routeService.calculateDistance(cOrigin.lat, cOrigin.lng, cPickup.lat, cPickup.lng) +
                               routeService.calculateDistance(cPickup.lat, cPickup.lng, cDest.lat, cDest.lng) -
                               originalRouteKm;
        pickupDetourKm = Math.max(0, Math.round(rawPickupDetour * 0.45));
      }

      // Drop detour: distance from shipment drop point to vehicle final destination
      let dropDetourKm = 0;
      if (cap.destination.toLowerCase().trim() !== dropLocation.toLowerCase().trim()) {
        const rawDropDetour = routeService.calculateDistance(cPickup.lat, cPickup.lng, cDrop.lat, cDrop.lng) +
                             routeService.calculateDistance(cDrop.lat, cDrop.lng, cDest.lat, cDest.lng) -
                             routeService.calculateDistance(cPickup.lat, cPickup.lng, cDest.lat, cDest.lng);
        dropDetourKm = Math.max(0, Math.round(rawDropDetour * 0.45));
      }

      const totalDetourKm = Math.round(pickupDetourKm + dropDetourKm);
      const detourPercentage = Math.round((totalDetourKm / Math.max(1, originalRouteKm)) * 100);

      if (pickupDetourKm > matchingConfig.MAX_PICKUP_DETOUR_KM) {
        diagnostics.failedRouteCount++;
        candidateRejectionReasons.push(`Pickup detour (+${pickupDetourKm} km) exceeds maximum limit (${matchingConfig.MAX_PICKUP_DETOUR_KM} km)`);
        if (!globalRejectionReasons.includes('Pickup detour exceeds acceptable range')) {
          globalRejectionReasons.push('Pickup detour exceeds acceptable range');
        }
        continue;
      }

      if (dropDetourKm > matchingConfig.MAX_DROP_DETOUR_KM) {
        diagnostics.failedRouteCount++;
        candidateRejectionReasons.push(`Drop detour (+${dropDetourKm} km) exceeds maximum limit (${matchingConfig.MAX_DROP_DETOUR_KM} km)`);
        if (!globalRejectionReasons.includes('Drop detour exceeds acceptable range')) {
          globalRejectionReasons.push('Drop detour exceeds acceptable range');
        }
        continue;
      }

      if (totalDetourKm > matchingConfig.MAX_TOTAL_DETOUR_KM) {
        diagnostics.failedRouteCount++;
        candidateRejectionReasons.push(`Total detour (+${totalDetourKm} km) exceeds maximum limit (${matchingConfig.MAX_TOTAL_DETOUR_KM} km)`);
        if (!globalRejectionReasons.includes('Total route deviation is too high')) {
          globalRejectionReasons.push('Total route deviation is too high');
        }
        continue;
      }

      if (detourPercentage > matchingConfig.MAX_DETOUR_PERCENT) {
        diagnostics.failedRouteCount++;
        candidateRejectionReasons.push(`Detour percentage (${detourPercentage}%) exceeds limit (${matchingConfig.MAX_DETOUR_PERCENT}%)`);
        if (!globalRejectionReasons.includes('Route deviation percentage is too high')) {
          globalRejectionReasons.push('Route deviation percentage is too high');
        }
        continue;
      }

      // D. DATE / TIME COMPATIBILITY
      let timeMatch = true;
      if (pickupDate && pickupDate !== 'Today' && pickupDate !== 'today') {
        const requestedDate = new Date(pickupDate);
        const capDate = new Date(cap.availableDate);
        if (!isNaN(requestedDate.getTime()) && !isNaN(capDate.getTime())) {
          const reqStr = requestedDate.toISOString().split('T')[0];
          const capStr = capDate.toISOString().split('T')[0];
          if (reqStr !== capStr) {
            timeMatch = false;
          }
        }
      }

      if (!timeMatch) {
        diagnostics.failedTimeCount++;
        candidateRejectionReasons.push(`Vehicle available date (${new Date(cap.availableDate).toLocaleDateString()}) does not match requested pickup date (${pickupDate})`);
        if (!globalRejectionReasons.includes('Vehicles are outside the pickup window')) {
          globalRejectionReasons.push('Vehicles are outside the pickup window');
        }
        continue;
      }

      // E. DRIVER AVAILABILITY & HOURS CHECK
      let driver = null;
      if (carrier) {
        driver = await Driver.findOne({ carrier: carrier._id || carrier, availabilityStatus: { $ne: 'UNAVAILABLE' } });
      }

      if (driver && (driver.availabilityStatus === 'UNAVAILABLE' || driver.restStatus === 'NEEDS_REST')) {
        diagnostics.failedDriverCount++;
        candidateRejectionReasons.push('Assigned driver is unavailable or needs rest');
        if (!globalRejectionReasons.includes('Drivers are unavailable or exceed driving hours')) {
          globalRejectionReasons.push('Drivers are unavailable or exceed driving hours');
        }
        continue;
      }

      // F. PRICING & SAVINGS CALCULATION
      const pricing = pricingService.calculatePricing({
        weightTons,
        vehicleCapacityTons: cap.totalCapacityTons || 10,
        distanceKm: shipmentDistanceKm,
        detourKm: totalDetourKm,
        offeredPriceINR: 0
      });

      const estimatedPrice = pricing.grossRevenueINR || Math.round(weightTons * shipmentDistanceKm * 4.2);
      const estimatedSavings = pricing.savingsINR || Math.round(estimatedPrice * 0.18);

      // G. DETERMINISTIC SCORE CALCULATION (Out of 100 points)
      // 1. Capacity fit (20 pts)
      const capacityScore = Math.round(20 * Math.min(1, weightTons / Math.max(0.1, cap.availableCapacityTons)));
      // 2. Route compatibility (30 pts)
      const routeScore = Math.max(10, Math.round(30 - totalDetourKm * 0.3));
      // 3. Low detour (20 pts)
      const detourScore = Math.max(0, Math.round(20 * (1 - totalDetourKm / matchingConfig.MAX_TOTAL_DETOUR_KM)));
      // 4. Pickup / time fit (15 pts)
      const timeScore = 15;
      // 5. Driver availability (10 pts)
      const driverScore = (driver && driver.restStatus === 'WELL_RESTED') ? 10 : 9;
      // 6. Vehicle / carrier trust (5 pts)
      const trustScore = 5;

      const matchScore = Math.min(100, Math.max(55, Math.round(
        capacityScore + routeScore + detourScore + timeScore + driverScore + trustScore
      )));

      // H. MATCH REASONS GENERATION
      const matchReasons = [];
      matchReasons.push(`Enough available capacity (${cap.availableCapacityTons}T available)`);
      if (totalDetourKm <= 10) {
        matchReasons.push('Route strongly aligned along corridor');
      } else {
        matchReasons.push(`Acceptable route detour (+${totalDetourKm} km)`);
      }
      if (totalDetourKm <= 20) {
        matchReasons.push('Low detour distance');
      }
      matchReasons.push('Pickup window compatible');
      matchReasons.push('Driver available');

      const candidateObj = {
        capacityId: cap._id,
        vehicleId: vehicle?._id || cap._id,
        vehicleNumber: vehicleReg,
        carrierId: carrier?._id,
        carrierName,
        vehicleType,
        vehicleCapacity: cap.totalCapacityTons,
        availableCapacity: cap.availableCapacityTons,
        plannedRoute: `${cap.origin} → ${cap.destination}`,
        shipmentWeight: weightTons,
        pickupLocation,
        dropLocation,
        routeCompatibility: totalDetourKm <= 15 ? 'STRONG' : 'COMPATIBLE',
        pickupDetourKm,
        dropDetourKm,
        totalDetourKm,
        detourPercentage,
        driverAvailability: driver ? driver.availabilityStatus : 'AVAILABLE',
        estimatedTravelTime: `${Math.floor(shipmentDistanceKm / 50)}h ${(shipmentDistanceKm % 50) * 1.2 | 0}m`,
        estimatedETA: cap.departureTime || '4:30 PM',
        estimatedPrice,
        estimatedSavings,
        matchScore,
        matchReasons,
        rejectionReasons: candidateRejectionReasons
      };

      feasibleCandidates.push(candidateObj);
    }

    // Sort feasible candidates deterministically by matchScore descending
    feasibleCandidates.sort((a, b) => b.matchScore - a.matchScore);

    // Logging search details
    console.log(`
==================================================
MATCH SEARCH
--------------------------------------------------
Shipment: ${pickupLocation} → ${dropLocation}
Weight: ${weightTons}T
Date: ${pickupDate}

Capacity records checked: ${diagnostics.totalChecked}
Failed Status: ${diagnostics.failedStatusCount}
Failed Capacity: ${diagnostics.failedCapacityCount}
Failed Route/Detour: ${diagnostics.failedRouteCount}
Failed Time: ${diagnostics.failedTimeCount}
Failed Driver: ${diagnostics.failedDriverCount}
Final Feasible Candidates: ${feasibleCandidates.length}
==================================================
    `);

    return {
      pickupLocation,
      dropLocation,
      weightTons,
      shipmentType,
      pickupDate,
      feasibleCandidates,
      diagnostics,
      globalRejectionReasons
    };
  }
}

module.exports = new CandidateMatcher();
