class PricingService {
  calculatePricing({ weightTons = 2.5, vehicleCapacityTons = 10, distanceKm = 260, detourKm = 12, offeredPriceINR = null, vehicleType = 'HEAVY_TRUCK' }) {
    const baseRatePerTonKm = 4.2; // ₹4.2 per ton-km
    const fuelCostPerKm = 24; // ₹24 fuel expense per km

    // Vehicle type multiplier
    const typeMultipliers = {
      CONTAINER: 1.25,
      REFRIGERATED: 1.45,
      HEAVY_TRUCK: 1.0,
      MEDIUM_TRUCK: 0.85,
      LIGHT_TRUCK: 0.70
    };
    const multiplier = typeMultipliers[vehicleType] || 1.0;

    const effectiveDistance = Math.max(50, distanceKm);
    const detourCost = Math.round(detourKm * fuelCostPerKm);
    const baseFreightCost = Math.round(weightTons * effectiveDistance * baseRatePerTonKm * multiplier);
    
    // Traditional full truckload market rate (without backhaul discount)
    const traditionalMarketRate = Math.round(baseFreightCost * 1.35 + detourCost);
    
    // BackhaulX discounted revenue (Save ~28% for shipper, high yield for carrier)
    const grossRevenueINR = offeredPriceINR && offeredPriceINR > 0 
      ? Number(offeredPriceINR) 
      : Math.round(baseFreightCost * 1.02);

    const estimatedCostINR = detourCost + Math.round(effectiveDistance * 2.5);
    const netContributionINR = Math.max(0, grossRevenueINR - estimatedCostINR);
    
    // Environmental & efficiency metrics
    const emptyKmAvoided = Math.round(effectiveDistance + detourKm);
    const co2SavedKg = Math.round(emptyKmAvoided * 0.85); // 0.85 kg CO2 saved per avoided empty km
    const capacitySharePercent = Math.min(100, Math.round((weightTons / (vehicleCapacityTons || 10)) * 100));

    return {
      grossRevenueINR,
      estimatedCostINR,
      netContributionINR,
      traditionalMarketRate,
      savingsINR: Math.max(0, traditionalMarketRate - grossRevenueINR),
      savingsPercent: Math.round(((traditionalMarketRate - grossRevenueINR) / traditionalMarketRate) * 100),
      detourKm,
      co2SavedKg,
      emptyKmAvoided,
      capacitySharePercent
    };
  }
}

module.exports = new PricingService();
