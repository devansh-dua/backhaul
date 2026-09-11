const matchingService = require('../services/matching.service');
const Match = require('../models/Match');

exports.acceptMatch = async (req, res) => {
  try {
    const trip = await matchingService.acceptMatch(req.user.id, req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
