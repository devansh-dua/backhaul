const capacityService = require('../services/capacity.service');

exports.publishCapacity = async (req, res) => {
  try {
    const capacity = await capacityService.publishCapacity(req.user.id, req.body);
    res.status(201).json({ success: true, data: capacity });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getOpenCapacities = async (req, res) => {
  try {
    const capacities = await capacityService.getOpenCapacities();
    res.json({ success: true, data: capacities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCarrierCapacities = async (req, res) => {
  try {
    const capacities = await capacityService.getCarrierCapacities(req.user.id);
    res.json({ success: true, data: capacities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCapacityById = async (req, res) => {
  try {
    const capacity = await capacityService.getCapacityById(req.params.id);
    if (!capacity) return res.status(404).json({ success: false, message: 'Capacity listing not found' });
    res.json({ success: true, data: capacity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCapacity = async (req, res) => {
  try {
    const capacity = await capacityService.updateCapacity(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: capacity });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCapacity = async (req, res) => {
  try {
    await capacityService.deleteCapacity(req.params.id, req.user.id);
    res.json({ success: true, message: 'Capacity deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
