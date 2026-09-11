const vehicleService = require('../services/vehicle.service');

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.user.id, req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getCarrierVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getCarrierVehicles(req.user.id);
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(req.params.id, req.user.id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
