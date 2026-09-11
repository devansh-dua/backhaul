const shipmentService = require('../services/shipment.service');
const notificationService = require('../services/notification.service');

exports.createShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.createShipment(req.user.id, req.body);
    
    // Identify eligible carriers based on real database capacity and route data
    const eligibleCarrierIds = await shipmentService.findEligibleCarriers(shipment);

    const io = req.app.get('io');

    for (const carrierId of eligibleCarrierIds) {
      // Create persistent notification record in MongoDB
      const notification = await notificationService.createNotification({
        recipient: carrierId,
        type: 'NEW_SHIPMENT',
        title: 'New Backhaul Opportunity',
        message: `${shipment.pickupCity} → ${shipment.dropCity} (${shipment.weightTons}T)`,
        shipment: shipment._id,
        metadata: {
          shipmentId: shipment._id,
          pickupCity: shipment.pickupCity,
          dropCity: shipment.dropCity,
          cargoType: shipment.cargoType,
          weightTons: shipment.weightTons,
          offeredPriceINR: shipment.offeredPriceINR,
          deadline: shipment.deadline,
          matchScore: 94
        }
      });

      // Emit real-time Socket.IO event to carrier's room
      if (io) {
        const payload = {
          notificationId: notification._id,
          shipmentId: shipment._id,
          pickupLocation: { city: shipment.pickupCity, address: shipment.pickupLocation?.address || shipment.pickupCity },
          dropLocation: { city: shipment.dropCity, address: shipment.dropLocation?.address || shipment.dropCity },
          pickupCity: shipment.pickupCity,
          dropCity: shipment.dropCity,
          cargoType: shipment.cargoType,
          weight: shipment.weightTons,
          weightTons: shipment.weightTons,
          pickupDate: shipment.createdAt,
          deadline: shipment.deadline,
          deliveryDeadline: shipment.deadline,
          offeredPriceINR: shipment.offeredPriceINR,
          price: shipment.offeredPriceINR,
          estimatedRevenue: shipment.offeredPriceINR,
          matchScore: 94,
          shipper: {
            id: req.user.id,
            name: req.user.name || 'Shipper'
          }
        };

        io.to(`carrier:${carrierId}`).emit('shipment:new', payload);
        io.to(`user_${carrierId}`).emit('shipment:new', payload);
        io.to(`carrier:${carrierId}`).emit('carrier_booking_request', payload);
        io.to(`user_${carrierId}`).emit('carrier_booking_request', payload);
      }
    }

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
