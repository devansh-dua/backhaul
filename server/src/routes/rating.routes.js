const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, ratingController.submitRating);
router.get('/user/:userId', protect, ratingController.getUserRatings);
router.get('/my', protect, ratingController.getUserRatings);
router.get('/trust', protect, ratingController.getTrustProfile);
router.get('/trust/:userId', protect, ratingController.getTrustProfile);

module.exports = router;
