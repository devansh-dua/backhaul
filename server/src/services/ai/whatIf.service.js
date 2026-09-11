class WhatIfService {
  simulateScenario(baseMetrics, params) {
    const {
      addedShipmentWeight = 0,
      priceAdjustmentPercent = 0,
      fuelCostIncreasePercent = 0,
      detourIncreaseKm = 0,
      vehicleCapacityTons = 12
    } = params;

    const before = {
      grossRevenue: baseMetrics.grossRevenueINR || 21700,
      estimatedCost: baseMetrics.estimatedCostINR || 2800,
      netContribution: baseMetrics.netContributionINR || 18900,
      utilisationPercent: baseMetrics.utilisationPercent || 88,
      emptyKmAvoided: baseMetrics.emptyKmAvoided || 260,
      co2SavedKg: baseMetrics.co2SavedKg || 220
    };

    // Calculate AFTER values
    const grossAdjustment = 1 + (priceAdjustmentPercent / 100);
    const afterGross = Math.round((before.grossRevenue + (addedShipmentWeight * 3500)) * grossAdjustment);
    
    const costMultiplier = 1 + (fuelCostIncreasePercent / 100);
    const afterCost = Math.round((before.estimatedCost + (detourIncreaseKm * 26)) * costMultiplier);
    
    const afterNet = Math.max(0, afterGross - afterCost);
    const afterUtilisation = Math.min(100, before.utilisationPercent + Math.round((addedShipmentWeight / vehicleCapacityTons) * 100));
    const afterEmptyKm = before.emptyKmAvoided + Math.round(addedShipmentWeight * 15);
    const afterCo2 = Math.round(afterEmptyKm * 0.85);

    return {
      before,
      after: {
        grossRevenue: afterGross,
        estimatedCost: afterCost,
        netContribution: afterNet,
        utilisationPercent: afterUtilisation,
        emptyKmAvoided: afterEmptyKm,
        co2SavedKg: afterCo2
      },
      delta: {
        netContribution: afterNet - before.netContribution,
        grossRevenue: afterGross - before.grossRevenue,
        estimatedCost: afterCost - before.estimatedCost,
        utilisationPercent: afterUtilisation - before.utilisationPercent,
        co2SavedKg: afterCo2 - before.co2SavedKg
      }
    };
  }
}

module.exports = new WhatIfService();
