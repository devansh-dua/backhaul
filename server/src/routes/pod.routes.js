const express = require('express');
const router = express.Router();
const podController = require('../controllers/pod.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/confirm', protect, podController.confirmDelivery);
router.get('/:tripId', protect, podController.getPodByTrip);

module.exports = router;
