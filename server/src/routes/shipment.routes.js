const express = require('express');
const router = express.Router();
const shipmentService = require('../services/shipment.service');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('SHIPPER'), async (req, res) => {
  try {
    const shipment = await shipmentService.createShipment(req.user.id, req.body);
    res.status(201).json({ success: true, data: shipment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/my', protect, authorize('SHIPPER'), async (req, res) => {
  try {
    const shipments = await shipmentService.getShipperShipments(req.user.id);
    res.json({ success: true, data: shipments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/posted', protect, async (req, res) => {
  try {
    const shipments = await shipmentService.getPostedShipments();
    res.json({ success: true, data: shipments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
