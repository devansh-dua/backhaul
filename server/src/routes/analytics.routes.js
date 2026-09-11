const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics.service');
const { protect } = require('../middleware/auth.middleware');

router.get('/carrier', protect, async (req, res) => {
  try {
    const stats = await analyticsService.getCarrierDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/shipper', protect, async (req, res) => {
  try {
    const stats = await analyticsService.getShipperDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
