const Shipment = require('../models/Shipment');

class ShipmentService {
  async createShipment(shipperId, data) {
    return await Shipment.create({
      ...data,
      shipper: shipperId,
      status: 'POSTED'
    });
  }

  async getShipperShipments(shipperId) {
    return await Shipment.find({ shipper: shipperId }).sort({ createdAt: -1 });
  }

  async getPostedShipments() {
    return await Shipment.find({ status: 'POSTED' }).populate('shipper', 'name company rating').sort({ createdAt: -1 });
  }

  async updateShipmentStatus(id, status) {
    return await Shipment.findByIdAndUpdate(id, { status }, { new: true });
  }
}

module.exports = new ShipmentService();
