const Shipment = require('../models/Shipment');
const Capacity = require('../models/Capacity');
const User = require('../models/User');

class ShipmentService {
  async createShipment(shipperId, data) {
    return await Shipment.create({
      ...data,
      shipper: shipperId,
      title: data.title || `${data.pickupCity || 'Delhi'} → ${data.dropCity || data.deliveryCity || 'Jaipur'} Shipment`,
      pickupCity: data.pickupCity || data.pickupLocation?.city || 'Delhi',
      dropCity: data.dropCity || data.deliveryCity || data.dropLocation?.city || 'Jaipur',
      weightTons: Number(data.weightTons || data.weight || 2.5),
      cargoType: data.cargoType || 'General Freight',
      offeredPriceINR: Number(data.offeredPriceINR || data.revenue || 7200),
      deadline: data.deadline || new Date(Date.now() + 86400000 * 2),
      status: 'POSTED'
    });
  }

  async findEligibleCarriers(shipment) {
    const pickupCity = shipment.pickupCity || 'Delhi';
    const dropCity = shipment.dropCity || 'Jaipur';
    const weight = shipment.weightTons || 0;

    const cityRegex = (city) => new RegExp(`^${city.trim()}`, 'i');

    // Find all matching capacities
    const matchingCapacities = await Capacity.find({
      status: 'OPEN',
      availableCapacityTons: { $gte: weight },
      $or: [
        { origin: cityRegex(pickupCity) },
        { destination: cityRegex(dropCity) }
      ]
    });

    let carrierIds = matchingCapacities.map(c => c.carrier.toString());

    // Also include all active CARRIER role users so all registered carrier accounts get the notification in their panel
    const allCarriers = await User.find({ role: 'CARRIER' });
    const allCarrierIds = allCarriers.map(c => c._id.toString());

    return [...new Set([...carrierIds, ...allCarrierIds])];
  }

  async getShipperShipments(shipperId) {
    return await Shipment.find({ shipper: shipperId }).sort({ createdAt: -1 });
  }

  async getPostedShipments() {
    let shipments = await Shipment.find({ status: { $in: ['POSTED', 'OPEN'] } })
      .populate('shipper', 'name company rating')
      .sort({ createdAt: -1 });

    if (shipments.length === 0) {
      shipments = await Shipment.find({})
        .populate('shipper', 'name company rating')
        .sort({ createdAt: -1 })
        .limit(10);
    }
    return shipments;
  }

  async getShipmentById(id, userId = null) {
    const query = { _id: id };
    const shipment = await Shipment.findOne(query).populate('shipper', 'name company rating email phone');
    if (!shipment) throw new Error('Shipment not found');
    return shipment;
  }

  async updateShipment(id, userId, updateData) {
    const shipment = await Shipment.findOne({ _id: id, shipper: userId });
    if (!shipment) throw new Error('Shipment not found or unauthorized');
    Object.assign(shipment, updateData);
    return await shipment.save();
  }

  async updateShipmentStatus(id, status) {
    return await Shipment.findByIdAndUpdate(id, { status }, { new: true });
  }

  async deleteShipment(id, userId) {
    const res = await Shipment.deleteOne({ _id: id, shipper: userId });
    if (res.deletedCount === 0) throw new Error('Shipment not found or unauthorized');
    return { success: true };
  }
}

module.exports = new ShipmentService();
