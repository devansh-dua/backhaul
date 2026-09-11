const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    city: { type: String, default: '' }
  },
  speed: { type: Number, default: 60 },
  heading: { type: Number, default: 210 },
  eta: { type: String, default: 'In Progress' },
  progressPercent: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Tracking', trackingSchema);
