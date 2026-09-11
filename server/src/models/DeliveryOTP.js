const mongoose = require('mongoose');

const deliveryOtpSchema = new mongoose.Schema({
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true, index: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  resendCooldownUntil: { type: Date },
  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'EXPIRED', 'FAILED'],
    default: 'PENDING',
    index: true
  },
  requestedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryOTP', deliveryOtpSchema);
