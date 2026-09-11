const Vehicle = require('../models/Vehicle');

class VehicleService {
  async createVehicle(carrierId, data) {
    const available = data.totalCapacityTons - (data.usedCapacityTons || 0);
    return await Vehicle.create({
      ...data,
      carrier: carrierId,
      availableCapacityTons: Math.max(0, available)
    });
  }

  async getVehicleById(id) {
    return await Vehicle.findById(id).populate('carrier', 'name email company rating');
  }

  async getCarrierVehicles(carrierId) {
    return await Vehicle.find({ carrier: carrierId });
  }

  async getAllAvailableVehicles() {
    return await Vehicle.find({ availableCapacityTons: { $gt: 0 } }).populate('carrier', 'name email company rating');
  }
}

module.exports = new VehicleService();
