/**
 * Centralized Environmental Impact & CO2 Emissions Calculation Service
 * 
 * CORE LOGIC:
 * - WITHOUT BACKTRACKING: Delivery truck completes primary leg and returns empty (Empty Return Distance ~ Route Distance KM).
 * - WITH BACKTRACKING: Truck takes an en-route return shipment, eliminating dedicated empty return travel.
 * - Empty KM Avoided = Math.max(0, routeDistanceKm - detourKm)
 * - Fuel Efficiency (km/L):
 *     HEAVY_TRUCK / CONTAINER: ~3.2 km/L
 *     MEDIUM_TRUCK / TRUCK: ~4.5 km/L
 *     LIGHT_TRUCK / MINI_TRUCK: ~7.0 km/L
 * - Diesel Emission Factor: 2.68 kg CO2 / Liter (~0.85 kg CO2 per avoided empty km)
 */

const VEHICLE_EFFICIENCY_KM_PER_LITER = {
  HEAVY_TRUCK: 3.2,
  CONTAINER_32FT: 3.0,
  CONTAINER: 3.2,
  MEDIUM_TRUCK: 4.5,
  TRUCK: 4.5,
  LIGHT_TRUCK: 7.0,
  MINI_TRUCK: 7.5,
  DEFAULT: 4.0
};

const DIESEL_CO2_KG_PER_LITER = 2.68;

function calculateTripEmissions({ routeDistanceKm = 260, detourKm = 8, vehicleType = 'HEAVY_TRUCK', weightTons = 5 }) {
  const distance = Math.max(20, Number(routeDistanceKm) || 260);
  const detour = Math.max(0, Number(detourKm) || 0);

  // Avoided empty return kilometres
  const emptyKmAvoided = Math.max(10, Math.round(distance - detour));

  // Determine vehicle fuel efficiency
  const typeKey = (vehicleType || '').toUpperCase();
  const efficiency = VEHICLE_EFFICIENCY_KM_PER_LITER[typeKey] || VEHICLE_EFFICIENCY_KM_PER_LITER.DEFAULT;

  // Calculate fuel saved in Liters
  const estimatedFuelSavedLiters = parseFloat((emptyKmAvoided / efficiency).toFixed(1));

  // Calculate CO2 emissions saved in KG
  const estimatedCO2SavedKg = Math.round(estimatedFuelSavedLiters * DIESEL_CO2_KG_PER_LITER);

  const explanation = `Because this shipment utilized existing return truck capacity, ${emptyKmAvoided} km of uncompensated empty truck travel was eliminated, saving ${estimatedFuelSavedLiters} L of fuel and avoiding ${estimatedCO2SavedKg} kg of CO2 emissions.`;

  return {
    emptyKmAvoided,
    estimatedFuelSavedLiters,
    estimatedCO2SavedKg,
    vehicleType: typeKey || 'HEAVY_TRUCK',
    efficiencyKmPerLiter: efficiency,
    explanation
  };
}

module.exports = {
  calculateTripEmissions,
  VEHICLE_EFFICIENCY_KM_PER_LITER,
  DIESEL_CO2_KG_PER_LITER
};
