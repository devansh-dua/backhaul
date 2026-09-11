const Trip = require('../models/Trip');
const Rating = require('../models/Rating');

class PairingService {
  /**
   * Get relationship history & repeat pairing metrics between Shipper and Carrier
   */
  async getPairingHistory(shipperId, carrierId) {
    if (!shipperId || !carrierId) {
      return {
        completedTripsTogether: 0,
        isTrustedPartner: false,
        averageRating: 0,
        lastShipmentDate: null,
        totalRevenue: 0
      };
    }

    // Find completed trips between shipper & carrier
    const trips = await Trip.find({
      shipper: shipperId,
      carrier: carrierId,
      status: { $in: ['COMPLETED', 'DELIVERED'] }
    }).sort({ updatedAt: -1 });

    const completedTripsTogether = trips.length;

    // Calculate total revenue generated together
    const totalRevenue = trips.reduce((acc, t) => acc + (t.grossRevenueINR || 0), 0);

    // Calculate average rating between them if ratings exist
    const ratings = await Rating.find({
      $or: [
        { fromUser: shipperId, toUser: carrierId },
        { fromUser: carrierId, toUser: shipperId }
      ]
    });

    const averageRating = ratings.length > 0
      ? parseFloat((ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(1))
      : null;

    // Trusted Partner threshold: at least 1 completed trip together with clean record
    const isTrustedPartner = completedTripsTogether >= 1 && (averageRating === null || averageRating >= 4.0);

    return {
      completedTripsTogether,
      isTrustedPartner,
      averageRating,
      lastShipmentDate: trips.length > 0 ? trips[0].updatedAt : null,
      totalRevenue
    };
  }
}

module.exports = new PairingService();
