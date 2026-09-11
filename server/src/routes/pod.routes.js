const express = require('express');
const router = express.Router();
const podService = require('../services/pod.service');
const { protect } = require('../middleware/auth.middleware');

router.post('/confirm', protect, async (req, res) => {
  try {
    const { tripId, shipmentId, receiverName, notes } = req.body;
    const pod = await podService.confirmDelivery(tripId, shipmentId, receiverName, notes);
    res.status(201).json({ success: true, data: pod });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/:tripId', protect, async (req, res) => {
  try {
    const pod = await podService.getPodByTrip(req.params.tripId);
    res.json({ success: true, data: pod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
