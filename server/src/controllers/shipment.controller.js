const shipmentService = require('../services/shipment.service');

exports.createShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.createShipment(req.user.id, req.body);
    res.status(201).json({ success: true, data: shipment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getShipperShipments = async (req, res) => {
  try {
    const shipments = await shipmentService.getShipperShipments(req.user.id);
    res.json({ success: true, data: shipments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPostedShipments = async (req, res) => {
  try {
    const shipments = await shipmentService.getPostedShipments();
    res.json({ success: true, data: shipments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id);
    res.json({ success: true, data: shipment });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.updateShipment(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: shipment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteShipment = async (req, res) => {
  try {
    await shipmentService.deleteShipment(req.params.id, req.user.id);
    res.json({ success: true, message: 'Shipment deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
