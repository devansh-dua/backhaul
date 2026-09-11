const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth.middleware');

router.get('/my', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'CARRIER' ? { carrier: req.user.id } : { shipper: req.user.id };
    const trips = await Trip.find(filter)
      .populate('vehicle shipments proofOfDelivery carrier')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle shipments proofOfDelivery carrier');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
