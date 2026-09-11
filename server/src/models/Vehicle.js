const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  vehicleType: { type: String, enum: ['HEAVY_TRUCK', 'MEDIUM_TRUCK', 'LIGHT_TRUCK', 'CONTAINER', 'REFRIGERATED'], default: 'HEAVY_TRUCK' },
  totalCapacityTons: { type: Number, required: true },
  usedCapacityTons: { type: Number, default: 0 },
  availableCapacityTons: { type: Number, required: true },
  volumeCapacityCbm: { type: Number, default: 40 },
  currentCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  routeCoordinates: [{
    city: String,
    lat: Number,
    lng: Number
  }],
  driverHoursAvailable: { type: Number, default: 10 },
  maxDrivingHours: { type: Number, default: 11 },
  restStatus: { type: String, enum: ['WELL_RESTED', 'NEEDS_REST', 'IN_REST'], default: 'WELL_RESTED' },
  cargoRestrictions: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
