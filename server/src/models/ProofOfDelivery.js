const mongoose = require('mongoose');

const proofOfDeliverySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true, index: true },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationMethod: { type: String, default: 'OTP' },
  verificationStatus: { type: String, default: 'VERIFIED' },
  receiverName: { type: String, default: 'Authorized Receiver' },
  timestamp: { type: Date, default: Date.now },
  deliveredAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  signatureMetadata: { type: String, default: 'SECURE_6_DIGIT_OTP_VERIFIED' },
  notes: { type: String, default: 'Shipment physically received and verified via OTP.' },
  emptyKmAvoided: { type: Number, default: 0 },
  fuelSavedLiters: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ProofOfDelivery', proofOfDeliverySchema);
