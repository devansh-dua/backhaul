const express = require('express');
const router = express.Router();
const matchingService = require('../services/matching.service');
const { protect } = require('../middleware/auth.middleware');

router.get('/recommendation/:vehicleId', protect, async (req, res) => {
  try {
    const recommendation = await matchingService.getTopRecommendationForVehicle(req.params.vehicleId);
    res.json({ success: true, data: recommendation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/accept', protect, async (req, res) => {
  try {
    const trip = await matchingService.acceptMatch(req.user.id, req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
