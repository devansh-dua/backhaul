const Rating = require('../models/Rating');
const User = require('../models/User');

class RatingService {
  async submitRating(data) {
    const rating = await Rating.create(data);

    // Update recipient user average rating
    const ratings = await Rating.find({ toUser: data.toUser });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await User.findByIdAndUpdate(data.toUser, {
      rating: parseFloat(avg.toFixed(1))
    });

    return rating;
  }

  async getUserRatings(userId) {
    return await Rating.find({ toUser: userId }).populate('fromUser', 'name company role');
  }
}

module.exports = new RatingService();
