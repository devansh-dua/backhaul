const Capacity = require('../models/Capacity');

class CapacityService {
  async publishCapacity(carrierId, data) {
    return await Capacity.create({
      ...data,
      carrier: carrierId,
      status: 'OPEN'
    });
  }

  async getOpenCapacities() {
    return await Capacity.find({ status: 'OPEN' })
      .populate('carrier', 'name email company rating')
      .populate('vehicle')
      .sort({ createdAt: -1 });
  }

  async getCarrierCapacities(carrierId) {
    return await Capacity.find({ carrier: carrierId })
      .populate('vehicle')
      .sort({ createdAt: -1 });
  }

  async getCapacityById(id) {
    return await Capacity.findById(id).populate('carrier vehicle');
  }

  async updateCapacity(id, carrierId, updateData) {
    const capacity = await Capacity.findOne({ _id: id, carrier: carrierId });
    if (!capacity) throw new Error('Capacity listing not found or unauthorized');
    Object.assign(capacity, updateData);
    return await capacity.save();
  }

  async deleteCapacity(id, carrierId) {
    const res = await Capacity.deleteOne({ _id: id, carrier: carrierId });
    if (res.deletedCount === 0) throw new Error('Capacity listing not found or unauthorized');
    return { success: true };
  }
}

module.exports = new CapacityService();
