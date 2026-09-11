const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { protect } = require('../middleware/auth.middleware');

// Shipper Find Capacity Matching API
router.get('/capacity', matchController.findCapacityMatches);
router.post('/capacity', matchController.findCapacityMatches);

router.post('/accept', protect, matchController.acceptMatch);
router.post('/book', protect, matchController.acceptMatch);
router.post('/:shipmentId/accept', protect, matchController.acceptMatch);
router.get('/recommendation/:vehicleId', protect, matchController.getTopRecommendation);
router.get('/my', protect, matchController.getCarrierMatches);

module.exports = router;
