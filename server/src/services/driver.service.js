const Driver = require('../models/Driver');

class DriverService {
  async createDriver(carrierId, data) {
    return await Driver.create({
      ...data,
      carrier: carrierId,
      licenseNumber: data.licenseNumber || `DL-${Date.now().toString().slice(-8)}`
    });
  }

  async getCarrierDrivers(carrierId) {
    return await Driver.find({ carrier: carrierId }).populate('currentVehicle').sort({ createdAt: -1 });
  }

  async getDriverById(id, carrierId = null) {
    const query = { _id: id };
    if (carrierId) query.carrier = carrierId;
    return await Driver.findOne(query).populate('currentVehicle');
  }

  async updateDriver(id, carrierId, updateData) {
    const driver = await Driver.findOne({ _id: id, carrier: carrierId });
    if (!driver) throw new Error('Driver not found or unauthorized');
    Object.assign(driver, updateData);
    return await driver.save();
  }

  async deleteDriver(id, carrierId) {
    const res = await Driver.deleteOne({ _id: id, carrier: carrierId });
    if (res.deletedCount === 0) throw new Error('Driver not found or unauthorized');
    return { success: true };
  }
}

module.exports = new DriverService();
