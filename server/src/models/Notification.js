const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['NEW_SHIPMENT', 'SHIPMENT_MATCHED', 'BOOKING_CONFIRMED', 'SHIPMENT_ACCEPTED', 'SHIPMENT_REJECTED'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  metadata: { type: Object, default: {} },
  isRead: { type: Boolean, default: false, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
