const candidateMatcher = require('./candidateMatcher');
const geminiService = require('./gemini.service');

class MatchRanker {
  /**
   * Search MongoDB capacity, apply hard constraint filters, and rank options for Shipper.
   * @param {Object} searchParams - { pickupLocation, dropLocation, weightTons, shipmentType, pickupDate, shipmentId }
   */
  async findAndRankCapacities(searchParams = {}) {
    // 1. Run hard constraint candidate matching on MongoDB records
    const matchResult = await candidateMatcher.findFeasibleCandidates(searchParams);

    const {
      pickupLocation,
      dropLocation,
      weightTons,
      shipmentType,
      pickupDate,
      feasibleCandidates,
      diagnostics,
      globalRejectionReasons
    } = matchResult;

    // 2. If ZERO feasible candidates exist, return diagnostic empty state
    if (!feasibleCandidates || feasibleCandidates.length === 0) {
      return {
        success: true,
        pickupLocation,
        dropLocation,
        weightTons,
        shipmentType,
        pickupDate,
        candidates: [],
        message: 'No compatible vehicle capacity found',
        diagnostics,
        rejectionReasons: globalRejectionReasons.length > 0 ? globalRejectionReasons : [
          'No published capacity on this route',
          `Available capacity is below ${weightTons}T`,
          'Vehicles are outside the pickup window',
          'Route deviation is too high',
          'Drivers are unavailable'
        ]
      };
    }

    // 3. Pass real feasible candidates to Gemini for AI ranking & explanations
    const rankedResult = await geminiService.rankAndExplainCapacities(
      { pickupLocation, dropLocation, weightTons, shipmentType, pickupDate },
      feasibleCandidates
    );

    return {
      success: true,
      pickupLocation,
      dropLocation,
      weightTons,
      shipmentType,
      pickupDate,
      candidates: rankedResult.candidates,
      confidenceScore: rankedResult.confidenceScore,
      aiSummary: rankedResult.aiSummary,
      diagnostics,
      totalChecked: diagnostics.totalChecked,
      compatibleFoundCount: rankedResult.candidates.length
    };
  }

  // Legacy helper method kept for backward compatibility with existing calls
  async generateRankedCapacitiesForShipment(shipmentId) {
    return await this.findAndRankCapacities({ shipmentId });
  }
}

module.exports = new MatchRanker();
