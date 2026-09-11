const mongoose = require('mongoose');

const aiInteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['CARRIER', 'SHIPPER', 'DRIVER', 'ADMIN'], default: 'CARRIER' },
  language: { type: String, default: 'hi' },
  inputType: { type: String, enum: ['VOICE', 'TEXT', 'QUICK_ACTION'], default: 'TEXT' },
  rawInput: { type: String, required: true },
  intent: { type: String, required: true },
  confidence: { type: Number, default: 0.9 },
  actionExecuted: { type: String },
  requiresConfirmation: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING_CONFIRMATION', 'EXECUTED', 'CANCELLED', 'CLARIFICATION_REQUIRED', 'FAILED'], default: 'EXECUTED' },
  contextSnapshot: { type: Object },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AIInteraction', aiInteractionSchema);
