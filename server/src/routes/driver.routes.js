const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('CARRIER'), driverController.createDriver);
router.get('/', protect, authorize('CARRIER'), driverController.getCarrierDrivers);
router.get('/:id', protect, authorize('CARRIER'), driverController.getDriverById);
router.put('/:id', protect, authorize('CARRIER'), driverController.updateDriver);
router.delete('/:id', protect, authorize('CARRIER'), driverController.deleteDriver);

module.exports = router;
