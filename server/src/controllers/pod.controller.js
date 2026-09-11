const podService = require('../services/pod.service');

exports.confirmDelivery = async (req, res) => {
  try {
    const { tripId, shipmentId, receiverName, notes } = req.body;
    const pod = await podService.confirmDelivery(tripId, shipmentId, receiverName || 'Warehouse Ops', notes || 'Delivered intact');
    res.status(201).json({ success: true, data: pod });
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
