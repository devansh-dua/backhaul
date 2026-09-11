const express = require('express');
const router = express.Router();
const trackingService = require('../services/tracking.service');
const { protect } = require('../middleware/auth.middleware');

router.get('/:tripId', protect, async (req, res) => {
  try {
    const latest = await trackingService.getLatestTracking(req.params.tripId);
    res.json({ success: true, data: latest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
