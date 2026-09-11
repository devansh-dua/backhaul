const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('SHIPPER'), shipmentController.createShipment);
router.get('/', protect, shipmentController.getPostedShipments);
router.get('/my', protect, authorize('SHIPPER'), shipmentController.getShipperShipments);
router.get('/posted', protect, shipmentController.getPostedShipments);
router.get('/:id', protect, shipmentController.getShipmentById);
router.put('/:id', protect, authorize('SHIPPER'), shipmentController.updateShipment);
router.delete('/:id', protect, authorize('SHIPPER'), shipmentController.deleteShipment);

module.exports = router;
