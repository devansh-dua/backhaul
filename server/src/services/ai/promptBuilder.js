class PromptBuilder {
  buildMatchPrompt(vehicle, candidateMatches) {
    return `
You are the AI Decision Engine for BACKHAULX, a logistics backhaul optimizer.
Analyze the following REAL vehicle and candidate shipments retrieved from the database.

VEHICLE:
- Registration: ${vehicle.registrationNumber}
- Route: ${vehicle.currentCity} -> ${vehicle.destinationCity}
- Available Capacity: ${vehicle.availableCapacityTons} Tons
- Driver Hours Available: ${vehicle.driverHoursAvailable} hours (${vehicle.restStatus})

FEASIBLE CANDIDATE SHIPMENTS:
${JSON.stringify(candidateMatches.map(c => ({
  id: c.shipment._id,
  title: c.shipment.title,
  pickup: c.shipment.pickupCity,
  drop: c.shipment.dropCity,
  weightTons: c.shipment.weightTons,
  offeredPriceINR: c.shipment.offeredPriceINR,
  detourKm: c.detourKm
})), null, 2)}

INSTRUCTIONS:
1. Rank the candidates from best to worst based on net profitability, minimum detour, and schedule safety.
2. Select the optimal multi-load combination that fits within ${vehicle.availableCapacityTons} Tons total.
3. Provide an explicit recommendation: "ACCEPT" or "REJECT" for the top combination.
4. Give a confidence score (0-100%).
5. Return JSON ONLY in the following exact format:
{
  "recommendation": "ACCEPT",
  "confidenceScore": 94,
  "topShipmentIds": ["<id1>", "<id2>"],
  "reasons": [
    "High net margin per km",
    "Low detour along core corridor",
    "Driver hours within safe thresholds"
  ],
  "tradeoffs": [
    "Slightly longer unloading time at midpoint"
  ],
  "aiSummary": "Accepting this 3-shipment backhaul combination turns empty return miles into ₹18,900 net profit with minimal 24km detour."
}
`;
  }
}

module.exports = new PromptBuilder();
