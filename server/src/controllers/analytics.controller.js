const analyticsService = require('../services/analytics.service');

exports.getCarrierStats = async (req, res) => {
  try {
    const stats = await analyticsService.getCarrierDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getShipperStats = async (req, res) => {
  try {
    const stats = await analyticsService.getShipperDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
