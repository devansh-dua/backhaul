const ratingService = require('../services/rating.service');

exports.submitRating = async (req, res) => {
  try {
    const rating = await ratingService.submitRating({
      ...req.body,
      fromUser: req.user.id
    });
    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await ratingService.getUserRatings(req.params.userId || req.user.id);
    res.json({ success: true, data: ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
