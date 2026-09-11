const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  shipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' }],
  matchScore: { type: Number, required: true },
  confidenceScore: { type: Number, default: 94 },
  recommendation: { type: String, enum: ['ACCEPT', 'REJECT'], default: 'ACCEPT' },
  grossRevenueINR: { type: Number, required: true },
  estimatedCostINR: { type: Number, required: true },
  netContributionINR: { type: Number, required: true },
  detourKm: { type: Number, required: true },
  utilisationPercent: { type: Number, required: true },
  co2SavedKg: { type: Number, required: true },
  reasons: [{ type: String }],
  tradeoffs: [{ type: String }],
  aiSummary: { type: String, default: '' },
  isMultiLoad: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
