const express = require('express');
const router = express.Router();
const vehicleService = require('../services/vehicle.service');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('CARRIER'), async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.user.id, req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/my', protect, authorize('CARRIER'), async (req, res) => {
  try {
    const vehicles = await vehicleService.getCarrierVehicles(req.user.id);
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/available', protect, async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllAvailableVehicles();
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
