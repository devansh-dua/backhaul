const pricingService = require('../pricing.service');
const routeService = require('../route.service');

class LoadOptimizer {
  // Finds optimal multi-load combinations fitting within vehicle weight & volume capacity
  findOptimalLoadCombinations(vehicle, candidates) {
    const maxWeight = vehicle.availableCapacityTons;
    const maxVolume = vehicle.volumeCapacityCbm || 40;

    const items = candidates.map(c => ({
      candidate: c,
      shipment: c.shipment,
      weight: c.shipment.weightTons,
      volume: c.shipment.volumeCbm || 5,
      price: c.shipment.offeredPriceINR,
      detour: c.detourKm
    }));

    let bestCombo = [];
    let bestNetProfit = -1;
    let bestMetrics = null;

    // Generate subset combinations (up to 4 items for fast performance)
    const subsets = this.getPowerSet(items).filter(s => s.length > 0 && s.length <= 4);

    for (const combo of subsets) {
      const totalWeight = combo.reduce((sum, item) => sum + item.weight, 0);
      const totalVolume = combo.reduce((sum, item) => sum + item.volume, 0);

      if (totalWeight <= maxWeight && totalVolume <= maxVolume) {
        const grossRevenue = combo.reduce((sum, item) => sum + item.price, 0);
        const maxDetourInCombo = Math.max(...combo.map(i => i.detour));
        
        const baseDist = routeService.calculateDistance(
          routeService.getCoords(vehicle.currentCity).lat,
          routeService.getCoords(vehicle.currentCity).lng,
          routeService.getCoords(vehicle.destinationCity).lat,
          routeService.getCoords(vehicle.destinationCity).lng
        );

        const pricing = pricingService.calculatePricing({
          weightTons: totalWeight,
          vehicleCapacityTons: vehicle.totalCapacityTons,
          distanceKm: baseDist,
          detourKm: maxDetourInCombo,
          offeredPriceINR: grossRevenue
        });

        if (pricing.netContributionINR > bestNetProfit) {
          bestNetProfit = pricing.netContributionINR;
          bestCombo = combo;
          bestMetrics = {
            totalWeight,
            totalVolume,
            grossRevenue: pricing.grossRevenueINR,
            estimatedCost: pricing.estimatedCostINR,
            netContribution: pricing.netContributionINR,
            detourKm: maxDetourInCombo,
            utilisationPercent: Math.round((totalWeight / vehicle.totalCapacityTons) * 100),
            co2SavedKg: pricing.co2SavedKg
          };
        }
      }
    }

    return {
      selectedShipments: bestCombo.map(item => item.shipment),
      metrics: bestMetrics || {
        totalWeight: 0,
        totalVolume: 0,
        grossRevenue: 0,
        estimatedCost: 0,
        netContribution: 0,
        detourKm: 0,
        utilisationPercent: 0,
        co2SavedKg: 0
      }
    };
  }

  getPowerSet(array) {
    const result = [[]];
    for (const value of array) {
      const length = result.length;
      for (let i = 0; i < length; i++) {
        result.push([...result[i], value]);
      }
    }
    return result;
  }
}

module.exports = new LoadOptimizer();
