const matchRanker = require('./matchRanker');

class ReoptimizationService {
  async triggerReoptimization(vehicleId) {
    console.log(`🔄 Triggering continuous re-optimization for vehicle: ${vehicleId}`);
    return await matchRanker.getOrGenerateMatchForVehicle(vehicleId);
  }
}

module.exports = new ReoptimizationService();
