const Capacity = require('../models/Capacity');

class CapacityService {
  async publishCapacity(carrierId, data) {
    return await Capacity.create({
      ...data,
      carrier: carrierId
    });
  }

  async getOpenCapacities() {
    return await Capacity.find({ status: 'OPEN' }).populate('carrier vehicle');
  }

  async getCarrierCapacities(carrierId) {
    return await Capacity.find({ carrier: carrierId }).populate('vehicle');
  }
}

module.exports = new CapacityService();
