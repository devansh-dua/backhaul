const mongoose = require('mongoose');
const Trip = require('../models/Trip');

exports.getMyTrips = async (req, res) => {
  try {
    const isCarrier = req.user.role === 'CARRIER';
    const query = isCarrier ? { carrier: req.user.id } : { shipper: req.user.id };
    const trips = await Trip.find(query)
      .populate('vehicle')
      .populate('driver')
      .populate('shipments')
      .populate('carrier', 'name email company rating')
      .populate('shipper', 'name email company rating')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const trip = await Trip.findById(id)
      .populate('vehicle')
      .populate('driver')
      .populate('shipments')
      .populate('carrier', 'name email company rating phone')
      .populate('shipper', 'name email company rating phone')
      .populate('proofOfDelivery');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const { status } = req.body;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.status = status;
    await trip.save();

    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

