const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  role: { type: String, enum: ['CARRIER', 'SHIPPER'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, default: '' },
  onTimeDelivery: { type: Boolean, default: true }
}, { timestamps: true });

// Prevent duplicate ratings for the same completed shipment by the same user
ratingSchema.index({ fromUser: 1, shipment: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
