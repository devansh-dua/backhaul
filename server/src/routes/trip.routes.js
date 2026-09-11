const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, tripController.getMyTrips);
router.get('/my', protect, tripController.getMyTrips);
router.get('/:id', protect, tripController.getTripById);
router.put('/:id/status', protect, tripController.updateTripStatus);

module.exports = router;
