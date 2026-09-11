const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Send REAL feasible candidates to Gemini for AI ranking and explanations.
   */
  async rankAndExplainCapacities(shipmentQuery, candidates) {
    if (!candidates || candidates.length === 0) {
      return { candidates: [], aiSummary: 'No feasible candidates available.' };
    }

    if (!this.apiKey) {
      console.log('⚡ Gemini API key not set, using Deterministic Ranking Engine');
      return this.deterministicCapacityRanking(candidates);
    }

    const candidateSummary = candidates.map((c, idx) => ({
      index: idx,
      vehicleNumber: c.vehicleNumber,
      carrierName: c.carrierName,
      plannedRoute: c.plannedRoute,
      availableCapacity: c.availableCapacity,
      totalDetourKm: c.totalDetourKm,
      estimatedPrice: c.estimatedPrice,
      driverAvailability: c.driverAvailability,
      deterministicScore: c.matchScore
    }));

    const promptText = `
You are the AI Logistics Matcher for BACKTRACKING.
A Shipper is searching for truck capacity:
- Pickup: ${shipmentQuery.pickupLocation}
- Drop: ${shipmentQuery.dropLocation}
- Weight: ${shipmentQuery.weightTons} Tons
- Shipment Type: ${shipmentQuery.shipmentType}
- Date: ${shipmentQuery.pickupDate}

Here are the ${candidates.length} REAL, pre-filtered MongoDB vehicle capacity candidates:
${JSON.stringify(candidateSummary, null, 2)}

INSTRUCTIONS:
1. Rank these candidates from best to worst based on route alignment, detour, capacity utilization, and estimated price.
2. Provide a 1-sentence AI explanation and bullet-point reasons for each candidate.
3. Identify the single best option ("isBestOption": true for the top rank).
4. Highlight trade-offs between price, detour, capacity, and timing.
5. Provide an overall confidence score (0-100) and AI summary.

IMPORTANT RULES:
- Do NOT invent any vehicles, registration numbers, capacities, prices, or routes not present in the candidates list.
- Only return rankings for the provided candidates list.

Respond ONLY with valid JSON in this exact structure:
{
  "confidenceScore": 92,
  "aiSummary": "Ranked 4 real capacity options along Delhi -> Jaipur corridor.",
  "rankedIndices": [0, 1, 2, 3],
  "candidateExplanations": [
    {
      "index": 0,
      "aiScore": 96,
      "isBestOption": true,
      "explanation": "Best balance of low detour and exact capacity fit.",
      "reasons": ["Optimal capacity fit", "Only 4 km detour", "Verified carrier"],
      "tradeoffs": ["Slightly higher rate per ton"]
    }
  ]
}
`;

    const modelNames = ['gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
    for (const modelName of modelNames) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await Promise.race([
          model.generateContent(promptText),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API timeout')), 4000))
        ]);

        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return this.mergeGeminiResults(candidates, parsed);
        }
      } catch (err) {
        // Try next model or fallback
      }
    }

    console.log('⚡ Using Deterministic AI Ranking Engine for capacity matching');
    return this.deterministicCapacityRanking(candidates);
  }

  mergeGeminiResults(candidates, parsed) {
    if (!parsed || !Array.isArray(parsed.candidateExplanations)) {
      return this.deterministicCapacityRanking(candidates);
    }

    const explanationMap = new Map();
    parsed.candidateExplanations.forEach(exp => {
      explanationMap.set(exp.index, exp);
    });

    const rankedCandidates = candidates.map((cand, idx) => {
      const exp = explanationMap.get(idx);
      if (exp) {
        return {
          ...cand,
          matchScore: exp.aiScore || cand.matchScore,
          isBestOption: !!exp.isBestOption,
          aiExplanation: exp.explanation || cand.matchReasons[0],
          matchReasons: exp.reasons && exp.reasons.length > 0 ? exp.reasons : cand.matchReasons,
          tradeoffs: exp.tradeoffs || []
        };
      }
      return cand;
    });

    // Sort by matchScore descending
    rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return {
      candidates: rankedCandidates,
      confidenceScore: parsed.confidenceScore || 90,
      aiSummary: parsed.aiSummary || `Ranked ${candidates.length} feasible capacity options.`
    };
  }

  deterministicCapacityRanking(candidates) {
    const rankedCandidates = candidates.map((cand, idx) => ({
      ...cand,
      isBestOption: idx === 0,
      aiExplanation: cand.matchReasons[0] || 'Strong candidate matching route and capacity criteria',
      tradeoffs: cand.totalDetourKm > 20 ? [`Requires ${cand.totalDetourKm} km detour`] : []
    }));

    return {
      candidates: rankedCandidates,
      confidenceScore: 88,
      aiSummary: `Deterministic AI Engine ranked ${candidates.length} compatible MongoDB capacity options.`
    };
  }
}

module.exports = new GeminiService();
