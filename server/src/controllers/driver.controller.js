const driverService = require('../services/driver.service');

exports.createDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.user.id, req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getCarrierDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getCarrierDrivers(req.user.id);
    res.json({ success: true, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.id, req.user.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, data: driver });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: driver });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await driverService.deleteDriver(req.params.id, req.user.id);
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
