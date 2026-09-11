const mongoose = require('mongoose');

const proofOfDeliverySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
  receiverName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  signatureMetadata: { type: String, default: 'DIGITALLY_VERIFIED_SIGNATURE' },
  photoMetadata: { type: String, default: 'GEO_TAGGED_CARGO_PHOTO.JPG' },
  notes: { type: String, default: 'Delivered in good condition' },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ProofOfDelivery', proofOfDeliverySchema);
