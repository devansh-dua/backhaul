const mongoose = require('mongoose');
const trackingService = require('../services/tracking.service');
const Trip = require('../models/Trip');

exports.getTripTracking = async (req, res) => {
  try {
    const { tripId } = req.params;
    let trip = null;
    if (tripId && mongoose.Types.ObjectId.isValid(tripId)) {
      trip = await Trip.findById(tripId).populate('vehicle carrier shipper shipments');
    }
    
    if (!trip) {
      trip = await Trip.findOne().sort({ createdAt: -1 }).populate('vehicle carrier shipper shipments');
    }

    const waypoints = trackingService.getCorridorWaypoints(trip?.origin, trip?.destination);
    const latestTracking = trip ? await trackingService.getLatestTracking(trip._id) : null;

    res.json({
      success: true,
      data: {
        trip,
        waypoints,
        latestTracking
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
