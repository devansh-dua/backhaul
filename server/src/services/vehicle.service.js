const Vehicle = require('../models/Vehicle');

class VehicleService {
  async createVehicle(carrierId, data) {
    const totalCap = Number(data.totalCapacityTons || data.capacity || 10);
    const usedCap = Number(data.usedCapacityTons || 0);
    const available = totalCap - usedCap;

    return await Vehicle.create({
      ...data,
      carrier: carrierId,
      registrationNumber: data.registrationNumber || data.vehicleNumber || `REG-${Date.now().toString().slice(-6)}`,
      totalCapacityTons: totalCap,
      usedCapacityTons: usedCap,
      availableCapacityTons: Math.max(0, available),
      currentCity: data.currentCity || data.origin || data.currentLocation || 'Delhi',
      destinationCity: data.destinationCity || data.destination || 'Jaipur'
    });
  }

  async getVehicleById(id, carrierId = null) {
    const query = { _id: id };
    if (carrierId) query.carrier = carrierId;
    return await Vehicle.findOne(query).populate('carrier', 'name email company rating');
  }

  async getCarrierVehicles(carrierId) {
    return await Vehicle.find({ carrier: carrierId }).sort({ createdAt: -1 });
  }

  async getAllAvailableVehicles() {
    return await Vehicle.find({ availableCapacityTons: { $gt: 0 }, isActive: true }).populate('carrier', 'name email company rating');
  }

  async updateVehicle(id, carrierId, updateData) {
    const vehicle = await Vehicle.findOne({ _id: id, carrier: carrierId });
    if (!vehicle) {
      throw new Error('Vehicle not found or unauthorized');
    }

    if (updateData.totalCapacityTons !== undefined || updateData.usedCapacityTons !== undefined) {
      const total = updateData.totalCapacityTons !== undefined ? Number(updateData.totalCapacityTons) : vehicle.totalCapacityTons;
      const used = updateData.usedCapacityTons !== undefined ? Number(updateData.usedCapacityTons) : vehicle.usedCapacityTons;
      updateData.availableCapacityTons = Math.max(0, total - used);
    }

    Object.assign(vehicle, updateData);
    return await vehicle.save();
  }

  async deleteVehicle(id, carrierId) {
    const result = await Vehicle.deleteOne({ _id: id, carrier: carrierId });
    if (result.deletedCount === 0) {
      throw new Error('Vehicle not found or unauthorized');
    }
    return { success: true };
  }
}

module.exports = new VehicleService();
