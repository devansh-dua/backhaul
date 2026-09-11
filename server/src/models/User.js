const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CARRIER', 'SHIPPER'], required: true },
  company: { type: String, default: '' },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  completedTrips: { type: Number, default: 12 },
  onTimePercentage: { type: Number, default: 98 },
  cancellations: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
