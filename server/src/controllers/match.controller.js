const matchingService = require('../services/matching.service');
const matchRanker = require('../services/ai/matchRanker');
const Match = require('../models/Match');

exports.findCapacityMatches = async (req, res) => {
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

exports.acceptMatch = async (req, res) => {
  try {
    const io = req.app.get('io');
    const matchData = {
      ...req.body,
      shipmentId: req.params.shipmentId || req.body.shipmentId || req.body.id
    };
    const trip = await matchingService.acceptMatch(req.user.id, matchData, io);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    const statusCode = err.message.includes('no longer available') ? 409 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

exports.getTopRecommendation = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const match = await matchingService.getTopRecommendationForVehicle(vehicleId);
    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCarrierMatches = async (req, res) => {
  try {
    const matches = await Match.find({ carrier: req.user.id }).populate('vehicle shipments').sort({ createdAt: -1 });
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
