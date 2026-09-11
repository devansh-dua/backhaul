const podService = require('../services/pod.service');

exports.requestOtp = async (req, res) => {
  try {
    const io = req.app.get('io');
    const shipmentId = req.params.shipmentId || req.body.shipmentId;
    const tripId = req.body.tripId;
    const result = await podService.requestDeliveryOtp(req.user.id, shipmentId, tripId, io);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const io = req.app.get('io');
    const shipmentId = req.params.shipmentId || req.body.shipmentId;
    const { otp, notes } = req.body;
    const result = await podService.verifyDeliveryOtp(req.user.id, shipmentId, otp, notes, io);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const io = req.app.get('io');
    const shipmentId = req.params.shipmentId || req.body.shipmentId;
    const result = await podService.resendDeliveryOtp(req.user.id, shipmentId, io);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getShipperActiveOtp = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const result = await podService.getShipperActiveOtp(req.user.id, shipmentId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.confirmDelivery = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { shipmentId, otp, notes } = req.body;
    const result = await podService.verifyDeliveryOtp(req.user.id, shipmentId, otp, notes, io);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getPodByTrip = async (req, res) => {
  try {
    const pod = await podService.getPodByTrip(req.params.tripId);
    res.json({ success: true, data: pod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
