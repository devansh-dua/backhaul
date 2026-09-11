const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('CARRIER'), vehicleController.createVehicle);
router.get('/', protect, authorize('CARRIER'), vehicleController.getCarrierVehicles);
router.get('/my', protect, authorize('CARRIER'), vehicleController.getCarrierVehicles);
router.get('/:id', protect, vehicleController.getVehicleById);
router.put('/:id', protect, authorize('CARRIER'), vehicleController.updateVehicle);
router.delete('/:id', protect, authorize('CARRIER'), vehicleController.deleteVehicle);

module.exports = router;
