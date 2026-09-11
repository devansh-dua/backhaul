const trustService = require('../services/trust.service');
const ratingService = require('../services/rating.service');

exports.getTrustProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const profile = await trustService.getTrustProfile(userId);
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopPartners = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const partners = await trustService.getTopTrustedPartners(userId);
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitRating = async (req, res) => {
  try {
    const shipmentId = req.body.shipment || req.body.shipmentId;
    const tripId = req.body.trip || req.body.tripId;
    const rating = await ratingService.submitRating({
      ...req.body,
      shipment: shipmentId,
      trip: tripId,
      fromUser: req.user.id
    });
    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
