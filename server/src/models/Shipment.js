const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  pickupCity: { type: String, required: true },
  dropCity: { type: String, required: true },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  dropLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  weightTons: { type: Number, required: true },
  volumeCbm: { type: Number, default: 5 },
  cargoType: { type: String, default: 'General Freight' },
  preferredVehicleType: { type: String, default: 'HEAVY_TRUCK' },
  deadline: { type: Date, required: true },
  offeredPriceINR: { type: Number, required: true },
  specialRequirements: [{ type: String }],
  status: { type: String, enum: ['POSTED', 'MATCHED', 'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'], default: 'POSTED' }
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
