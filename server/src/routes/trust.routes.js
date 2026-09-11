const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const podService = require('../services/pod.service');
const { protect } = require('../middleware/auth.middleware');

// GET /api/trust/:userId
router.get('/:userId', protect, ratingController.getTrustProfile);

// GET /api/trust/me
router.get('/', protect, ratingController.getTrustProfile);

module.exports = router;
