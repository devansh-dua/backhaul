const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  availabilityStatus: { type: String, enum: ['AVAILABLE', 'ON_TRIP', 'ON_REST', 'UNAVAILABLE'], default: 'AVAILABLE' },
  hoursDrivenToday: { type: Number, default: 0 },
  remainingDrivingHours: { type: Number, default: 11 },
  lastRestTime: { type: Date, default: Date.now },
  currentVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
