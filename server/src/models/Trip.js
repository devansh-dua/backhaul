const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  shipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' }],
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'], default: 'BOOKED' },
  currentPosition: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
    city: { type: String, default: 'Delhi' }
  },
  currentSpeedKm: { type: Number, default: 58 },
  eta: { type: String, default: '3 hrs 45 mins' },
  grossRevenueINR: { type: Number, required: true },
  netContributionINR: { type: Number, required: true },
  detourKm: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  proofOfDelivery: { type: mongoose.Schema.Types.ObjectId, ref: 'ProofOfDelivery' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
