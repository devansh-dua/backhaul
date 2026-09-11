class PricingService {
  calculatePricing({ weightTons, vehicleCapacityTons, distanceKm, detourKm, offeredPriceINR }) {
    const baseRatePerTonKm = 4.2; // ₹4.2 per ton-km standard rate
    const fuelCostPerKm = 24; // ₹24 per km fuel expense for heavy truck
    
    // Distance & detour cost
    const totalDist = distanceKm + detourKm;
    const estimatedCostINR = Math.round(detourKm * fuelCostPerKm + (distanceKm * 3.5));
    
    // Revenue calculations
    const grossRevenueINR = offeredPriceINR || Math.round(weightTons * totalDist * baseRatePerTonKm);
    const netContributionINR = Math.max(0, grossRevenueINR - estimatedCostINR);
    
    // CO2 savings estimate: ~0.85 kg CO2 per avoided empty truck-km
    const co2SavedKg = Math.round(distanceKm * 0.85);
    
    // Capacity utilization contribution
    const capacitySharePercent = Math.round((weightTons / vehicleCapacityTons) * 100);

    return {
      grossRevenueINR,
      estimatedCostINR,
      netContributionINR,
      detourKm,
      co2SavedKg,
      capacitySharePercent,
      fairMarketPriceINR: Math.round(grossRevenueINR * 1.05)
    };
  }
}

module.exports = new PricingService();
