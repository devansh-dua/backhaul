class PromptBuilder {
  buildMatchPrompt(vehicle, candidateMatches) {
    return `
You are the AI Decision Engine for BACKTRACKING, an intelligent logistics & route optimizer.
Analyze the following REAL vehicle and candidate shipments retrieved from the database.

VEHICLE:
- Registration: ${vehicle.registrationNumber}
- Route: ${vehicle.currentCity} -> ${vehicle.destinationCity}
- Available Capacity: ${vehicle.availableCapacityTons} Tons
- Driver Hours Available: ${vehicle.driverHoursAvailable || 8} hours (${vehicle.restStatus || 'Rested'})

FEASIBLE CANDIDATE SHIPMENTS:
${JSON.stringify(candidateMatches.map(c => ({
  id: c.shipment._id,
  title: c.shipment.title,
  pickup: c.shipment.pickupCity,
  drop: c.shipment.dropCity,
  weightTons: c.shipment.weightTons,
  offeredPriceINR: c.shipment.offeredPriceINR,
  detourKm: c.detourKm,
  trustScore: c.trustScore || c.carrierTrustScore || 4.8,
  completedTripsTogether: c.completedTripsTogether || 0,
  isTrustedPartner: c.isTrustedPartner || false
})), null, 2)}

INSTRUCTIONS:
1. Rank the candidates from best to worst based on net profitability, minimum detour, schedule safety, AND authentic trust/repeat relationship indicators.
2. Select the optimal multi-load combination that fits within ${vehicle.availableCapacityTons} Tons total.
3. If a candidate has a proven repeat partnership (isTrustedPartner = true), use that as an additional positive ranking signal while enforcing hard logistics constraints first.
4. Provide an explicit recommendation: "ACCEPT" or "REJECT" for the top combination.
5. Give a confidence score (0-100%).
6. Return JSON ONLY in the following exact format:
{
  "recommendation": "ACCEPT",
  "confidenceScore": 94,
  "topShipmentIds": ["<id1>", "<id2>"],
  "reasons": [
    "High net margin per km",
    "Low detour along core corridor",
    "Proven repeat partnership with trusted rating history"
  ],
  "tradeoffs": [
    "Slightly longer unloading time at midpoint"
  ],
  "aiSummary": "Accepting this backhaul combination turns empty return miles into net profit with minimal detour."
}
`;
  }
}

module.exports = new PromptBuilder();
