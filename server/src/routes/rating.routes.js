const express = require('express');
const router = express.Router();
const ratingService = require('../services/rating.service');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, async (req, res) => {
  try {
    const rating = await ratingService.submitRating({
      ...req.body,
      fromUser: req.user.id
    });
    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/user/:userId', protect, async (req, res) => {
  try {
    const ratings = await ratingService.getUserRatings(req.params.userId);
    res.json({ success: true, data: ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
