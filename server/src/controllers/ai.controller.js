const matchRanker = require('../services/ai/matchRanker');
const loadOptimizer = require('../services/ai/loadOptimizer');
const whatIfService = require('../services/ai/whatIf.service');

exports.matchShipment = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    if (!shipmentId) {
      return res.status(400).json({ success: false, message: 'shipmentId is required' });
    }
    const result = await matchRanker.generateRankedCapacitiesForShipment(shipmentId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMatchForVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const result = await matchRanker.getOrGenerateMatchForVehicle(vehicleId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.optimizeMultiLoad = async (req, res) => {
  try {
    const result = await loadOptimizer.optimize(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.simulateWhatIf = async (req, res) => {
  try {
    const result = whatIfService.simulateScenario({}, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMarketIntelligence = async (req, res) => {
  try {
    const corridor = req.query.corridor || 'Delhi-Jaipur';
    res.json({
      success: true,
      data: {
        corridor,
        demandDensity: 'HIGH',
        averageRatePerTonKm: 4.5,
        availableCapacityTons: 42.5,
        co2SavedTotalKg: 1480
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

