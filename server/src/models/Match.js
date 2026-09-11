const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  capacity: { type: mongoose.Schema.Types.ObjectId, ref: 'Capacity' },
  shipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' }],
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchScore: { type: Number, required: true },
  confidenceScore: { type: Number, default: 94 },
  recommendation: { type: String, enum: ['ACCEPT', 'REJECT'], default: 'ACCEPT' },
  grossRevenueINR: { type: Number, required: true },
  estimatedCostINR: { type: Number, required: true },
  netContributionINR: { type: Number, required: true },
  agreedPrice: { type: Number, default: 0 },
  detourKm: { type: Number, default: 0 },
  utilisationPercent: { type: Number, default: 80 },
  co2SavedKg: { type: Number, default: 0 },
  reasons: [{ type: String }],
  tradeoffs: [{ type: String }],
  aiSummary: { type: String, default: '' },
  isMultiLoad: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'BOOKED', 'CANCELLED', 'COMPLETED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
