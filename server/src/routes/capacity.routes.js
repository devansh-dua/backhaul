const express = require('express');
const router = express.Router();
const capacityController = require('../controllers/capacity.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('CARRIER'), capacityController.publishCapacity);
router.get('/', capacityController.getOpenCapacities);
router.get('/open', capacityController.getOpenCapacities);
router.get('/my', protect, authorize('CARRIER'), capacityController.getCarrierCapacities);
router.get('/:id', capacityController.getCapacityById);
router.put('/:id', protect, authorize('CARRIER'), capacityController.updateCapacity);
router.delete('/:id', protect, authorize('CARRIER'), capacityController.deleteCapacity);

module.exports = router;
