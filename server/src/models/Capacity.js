const mongoose = require('mongoose');

const capacitySchema = new mongoose.Schema({
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  availableDate: { type: Date, required: true },
  availableCapacityTons: { type: Number, required: true },
  totalCapacityTons: { type: Number, required: true },
  departureTime: { type: String, default: '08:00 AM' },
  driverHoursAvailable: { type: Number, default: 8 },
  cargoRestrictions: [{ type: String }],
  status: { type: String, enum: ['OPEN', 'PARTIALLY_BOOKED', 'FULLY_BOOKED', 'EXPIRED'], default: 'OPEN' }
}, { timestamps: true });

module.exports = mongoose.model('Capacity', capacitySchema);
