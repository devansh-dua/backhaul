const express = require('express');
const router = express.Router();
const capacityService = require('../services/capacity.service');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('CARRIER'), async (req, res) => {
  try {
    const capacity = await capacityService.publishCapacity(req.user.id, req.body);
    res.status(201).json({ success: true, data: capacity });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/open', protect, async (req, res) => {
  try {
    const capacities = await capacityService.getOpenCapacities();
    res.json({ success: true, data: capacities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my', protect, authorize('CARRIER'), async (req, res) => {
  try {
    const capacities = await capacityService.getCarrierCapacities(req.user.id);
    res.json({ success: true, data: capacities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
