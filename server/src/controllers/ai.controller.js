const matchRanker = require('../services/ai/matchRanker');
const loadOptimizer = require('../services/ai/loadOptimizer');
const whatIfService = require('../services/ai/whatIf.service');
const copilotService = require('../services/ai/copilot.service');
const languageService = require('../services/ai/language.service');
const AIInteraction = require('../models/AIInteraction');

exports.handleCopilotRequest = async (req, res) => {
  try {
    const io = req.app.get('io');
    const userId = req.user?.id || req.user?._id;
    const response = await copilotService.processCopilotRequest(req.body, userId, io);
    res.json(response);
  } catch (err) {
    console.error('🔥 Copilot Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Copilot processing error',
      response: '⚠️ Kripya dobara try karein. AI process karne mein samasya aayi hai.'
    });
  }
};

exports.translateMessage = async (req, res) => {
  try {
    const { text, targetRole, targetLanguage } = req.body;
    const result = await languageService.translateInterPartyMessage(text, targetRole || 'SHIPPER', targetLanguage || 'en');
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCopilotAnalytics = async (req, res) => {
  try {
    const totalInteractions = await AIInteraction.countDocuments();
    const voiceCount = await AIInteraction.countDocuments({ inputType: 'VOICE' });
    const executedCount = await AIInteraction.countDocuments({ status: 'EXECUTED' });
    const languages = await AIInteraction.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalInteractions,
        voiceInteractions: voiceCount,
        textInteractions: totalInteractions - voiceCount,
        successfulActionsExecuted: executedCount,
        languageBreakdown: languages
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.matchShipment = async (req, res) => {
  try {
    const searchParams = req.method === 'GET' ? req.query : req.body;
    const result = await matchRanker.findAndRankCapacities(searchParams);
    res.json({
      success: true,
      data: result.candidates,
      candidates: result.candidates,
      diagnostics: result.diagnostics,
      rejectionReasons: result.rejectionReasons,
      aiSummary: result.aiSummary,
      confidenceScore: result.confidenceScore
    });
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
