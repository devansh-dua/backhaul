class DriverHoursService {
  validateDriverHours(vehicle, detourKm, baseDistanceKm) {
    const totalEstHours = (baseDistanceKm + detourKm) / 50; // Assume 50km/h avg highway speed
    const hoursAvailable = vehicle.driverHoursAvailable || 10;
    const maxDrivingHours = vehicle.maxDrivingHours || 11;
    
    const isSafe = totalEstHours <= hoursAvailable && hoursAvailable > 2;
    
    return {
      isSafe,
      estimatedHours: parseFloat(totalEstHours.toFixed(1)),
      hoursAvailable,
      maxDrivingHours,
      restStatus: vehicle.restStatus || 'WELL_RESTED',
      reason: isSafe 
        ? `Driver has ${hoursAvailable}h available (Trip requires ~${totalEstHours.toFixed(1)}h)`
        : `Insufficient driver hours: ${hoursAvailable}h available vs ${totalEstHours.toFixed(1)}h required`
    };
  }
}

module.exports = new DriverHoursService();
