const express = require('express');
const router = express.Router();
const trustController = require('../controllers/trust.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/trust/me or GET /api/trust
router.get('/', protect, trustController.getTrustProfile);

// GET /api/trust/partners
router.get('/partners', protect, trustController.getTopPartners);

// POST /api/trust/rate
router.post('/rate', protect, trustController.submitRating);

// GET /api/trust/:userId
router.get('/:userId', protect, trustController.getTrustProfile);

module.exports = router;
