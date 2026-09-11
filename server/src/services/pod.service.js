const ProofOfDelivery = require('../models/ProofOfDelivery');
const Trip = require('../models/Trip');
const Shipment = require('../models/Shipment');

class PodService {
  async confirmDelivery(tripId, shipmentId, receiverName, notes) {
    const pod = await ProofOfDelivery.create({
      trip: tripId,
      shipment: shipmentId,
      receiverName,
      notes,
      timestamp: new Date(),
      signatureMetadata: 'VERIFIED_DIGITAL_OTP_AND_STAMP',
      photoMetadata: 'GEO_TAGGED_CARGO_DELIVERY_PROOF.WEBP'
    });

    await Trip.findByIdAndUpdate(tripId, {
      status: 'DELIVERED',
      proofOfDelivery: pod._id
    });

    await Shipment.findByIdAndUpdate(shipmentId, { status: 'DELIVERED' });

    return pod;
  }

  async getPodByTrip(tripId) {
    return await ProofOfDelivery.findOne({ trip: tripId }).populate('trip shipment');
  }
}

module.exports = new PodService();
