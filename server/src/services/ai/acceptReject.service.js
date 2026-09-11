class AcceptRejectService {
  evaluateLoad(vehicle, shipment, detourKm, driverHoursCheck) {
    const reasons = [];
    let decision = 'ACCEPT';
    let confidence = 94;

    if (shipment.weightTons > vehicle.availableCapacityTons) {
      decision = 'REJECT';
      reasons.push(`Weight exceeds available capacity (${shipment.weightTons}T required vs ${vehicle.availableCapacityTons}T available)`);
    }

    if (detourKm > 70) {
      decision = 'REJECT';
      reasons.push(`Excessive detour of +${detourKm} km off primary route corridor`);
    }

    if (!driverHoursCheck.isSafe) {
      decision = 'REJECT';
      reasons.push(`Driver hours risk: ${driverHoursCheck.reason}`);
    }

    if (shipment.offeredPriceINR / (detourKm + 10) < 100) {
      decision = 'REJECT';
      reasons.push('Low revenue per detour kilometer ratio (< ₹100/km)');
    }

    if (decision === 'ACCEPT') {
      reasons.push('Optimal route alignment along Delhi-Jaipur corridor');
      reasons.push(`Capacity compatible (${shipment.weightTons}T fits inside ${vehicle.availableCapacityTons}T)`);
      reasons.push(`Low detour (+${detourKm} km)`);
      reasons.push('Safe driver driving hours validated');
    }

    return {
      decision,
      confidence,
      reasons
    };
  }
}

module.exports = new AcceptRejectService();
