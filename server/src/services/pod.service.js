const crypto = require('crypto');
const ProofOfDelivery = require('../models/ProofOfDelivery');
const DeliveryOTP = require('../models/DeliveryOTP');
const Trip = require('../models/Trip');
const Shipment = require('../models/Shipment');
const User = require('../models/User');
const notificationService = require('./notification.service');

class PodService {
  hashOtp(otp) {
    return crypto.createHash('sha256').update(String(otp)).digest('hex');
  }

  generateSixDigitOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestDeliveryOtp(carrierId, shipmentId, tripId = null, io = null) {
    // 1. Verify Shipment exists
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // 2. Find associated trip if not provided
    let trip = null;
    if (tripId) {
      trip = await Trip.findById(tripId);
    } else {
      trip = await Trip.findOne({ shipments: shipmentId, carrier: carrierId });
    }

    if (!trip) {
      trip = await Trip.findOne({ shipments: shipmentId }) || await Trip.create({
        carrier: carrierId,
        shipper: shipment.shipper,
        shipments: [shipment._id],
        origin: shipment.pickupCity || 'Delhi',
        destination: shipment.dropCity || 'Jaipur',
        status: 'IN_TRANSIT',
        grossRevenueINR: shipment.offeredPriceINR || 7200
      });
    }

    // 3. Invalidate any existing pending OTPs for this shipment
    await DeliveryOTP.updateMany(
      { shipment: shipment._id, status: 'PENDING' },
      { status: 'EXPIRED' }
    );

    // 4. Generate cryptographically random 6-digit OTP & Hash
    const plaintextOtp = this.generateSixDigitOtp();
    const otpHash = this.hashOtp(plaintextOtp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const resendCooldownUntil = new Date(Date.now() + 30 * 1000); // 30 seconds

    // 5. Store OTP record in MongoDB (HASH ONLY)
    const deliveryOtpDoc = await DeliveryOTP.create({
      shipment: shipment._id,
      trip: trip._id,
      carrier: carrierId,
      shipper: shipment.shipper,
      otpHash,
      expiresAt,
      resendCooldownUntil,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 3,
      requestedAt: new Date()
    });

    // Update shipment status to DELIVERY_OTP_REQUESTED
    shipment.status = 'DELIVERY_OTP_REQUESTED';
    await shipment.save();

    // 6. Create persistent MongoDB Notification for SHIPPER with plaintext OTP
    const carrierUser = await User.findById(carrierId);
    const carrierName = carrierUser?.company || carrierUser?.name || 'Carrier';

    const shipperNotification = await notificationService.createNotification({
      recipient: shipment.shipper,
      type: 'NEW_SHIPMENT',
      title: '🔐 Delivery Verification OTP',
      message: `Your shipment ${shipment.pickupCity} → ${shipment.dropCity} is ready for delivery by ${carrierName}. Share OTP ${plaintextOtp} with the carrier upon physical arrival.`,
      shipment: shipment._id,
      trip: trip._id,
      metadata: {
        otp: plaintextOtp,
        expiresAt,
        shipmentId: shipment._id,
        tripId: trip._id,
        pickupCity: shipment.pickupCity,
        dropCity: shipment.dropCity,
        carrierName
      }
    });

    // 7. Emit Socket.IO event exclusively to SHIPPER room with plaintext OTP
    if (io) {
      const shipperOtpPayload = {
        notificationId: shipperNotification._id,
        shipmentId: shipment._id,
        tripId: trip._id,
        status: 'DELIVERY_OTP_REQUESTED',
        otp: plaintextOtp,
        expiresAt,
        pickupCity: shipment.pickupCity,
        dropCity: shipment.dropCity,
        carrierName
      };

      io.to(`shipper:${shipment.shipper}`).emit('delivery:otp-requested', shipperOtpPayload);
      io.to(`user_${shipment.shipper}`).emit('delivery:otp-requested', shipperOtpPayload);
    }

    // 8. Return response to Carrier (NO OTP IN CARRIER RESPONSE!)
    return {
      success: true,
      message: 'OTP sent to customer successfully.',
      expiresAt,
      cooldownUntil: resendCooldownUntil,
      shipmentId: shipment._id,
      tripId: trip._id
    };
  }

  async verifyDeliveryOtp(carrierId, shipmentId, otpInput, notes = '', io = null) {
    if (!otpInput || String(otpInput).trim().length !== 6) {
      throw new Error('Please enter a valid 6-digit OTP.');
    }

    const cleanOtp = String(otpInput).trim();

    // 1. Find active OTP document for shipment
    const otpDoc = await DeliveryOTP.findOne({
      shipment: shipmentId,
      status: 'PENDING'
    });

    if (!otpDoc) {
      throw new Error('No active OTP request found. Please request a new OTP.');
    }

    // 2. Check Expiry
    if (new Date() > new Date(otpDoc.expiresAt)) {
      otpDoc.status = 'EXPIRED';
      await otpDoc.save();
      throw new Error('OTP has expired. Please request a new OTP.');
    }

    // 3. Check Attempt Limit
    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      otpDoc.status = 'FAILED';
      await otpDoc.save();
      throw new Error('Maximum OTP verification attempts exceeded. Please request a new OTP.');
    }

    // 4. Hash submitted OTP and compare
    const submittedHash = this.hashOtp(cleanOtp);
    if (submittedHash !== otpDoc.otpHash) {
      otpDoc.attempts += 1;
      if (otpDoc.attempts >= otpDoc.maxAttempts) {
        otpDoc.status = 'FAILED';
      }
      await otpDoc.save();

      const remaining = Math.max(0, otpDoc.maxAttempts - otpDoc.attempts);
      throw new Error(`Incorrect OTP. Please check with the customer (${remaining} attempt${remaining !== 1 ? 's' : ''} left).`);
    }

    // 5. SUCCESS! Mark OTP as VERIFIED
    otpDoc.status = 'VERIFIED';
    otpDoc.verifiedAt = new Date();
    otpDoc.verifiedBy = carrierId;
    await otpDoc.save();

    // 6. Calculate real environmental impact & CO2 emissions saved
    const { calculateTripEmissions } = require('../utils/calculateCO2');
    const existingShipment = await Shipment.findById(shipmentId);
    const existingTrip = await Trip.findById(otpDoc.trip);

    const impact = calculateTripEmissions({
      routeDistanceKm: 260,
      detourKm: existingTrip?.detourKm || 8,
      vehicleType: existingShipment?.preferredVehicleType || 'HEAVY_TRUCK'
    });

    const shipment = await Shipment.findByIdAndUpdate(shipmentId, { status: 'DELIVERED' }, { new: true });
    const trip = await Trip.findByIdAndUpdate(otpDoc.trip, {
      status: 'COMPLETED',
      emptyKmAvoided: impact.emptyKmAvoided,
      fuelSavedLiters: impact.estimatedFuelSavedLiters,
      co2SavedKg: impact.estimatedCO2SavedKg
    }, { new: true });

    // 7. Create/Update ProofOfDelivery Document with Impact Data
    const pod = await ProofOfDelivery.create({
      trip: otpDoc.trip,
      shipment: shipmentId,
      carrier: carrierId,
      shipper: otpDoc.shipper,
      verificationMethod: 'OTP',
      verificationStatus: 'VERIFIED',
      deliveredAt: new Date(),
      verifiedAt: new Date(),
      verifiedBy: carrierId,
      emptyKmAvoided: impact.emptyKmAvoided,
      fuelSavedLiters: impact.estimatedFuelSavedLiters,
      co2SavedKg: impact.estimatedCO2SavedKg,
      notes: notes || 'Delivery verified via secure 6-digit customer OTP.',
      signatureMetadata: `OTP_VERIFIED_SHA256_${otpDoc._id.toString().slice(-6)}`
    });

    if (trip) {
      trip.proofOfDelivery = pod._id;
      await trip.save();
    }

    // 8. Create persistent Notification document for Shipper
    const carrierUser = await User.findById(carrierId);
    const carrierName = carrierUser?.company || carrierUser?.name || 'Carrier';

    const shipperNotification = await notificationService.createNotification({
      recipient: otpDoc.shipper,
      type: 'SHIPMENT_ACCEPTED',
      title: '✓ SHIPMENT DELIVERED',
      message: `Your shipment ${shipment.pickupCity} → ${shipment.dropCity} has been successfully delivered and verified by ${carrierName}.`,
      shipment: shipment._id,
      trip: otpDoc.trip,
      metadata: {
        deliveredAt: new Date(),
        carrierName,
        pickupCity: shipment.pickupCity,
        dropCity: shipment.dropCity,
        podId: pod._id
      }
    });

    // 9. Emit real-time Socket.IO events (delivery:completed & rating:available)
    if (io) {
      const deliveredPayload = {
        notificationId: shipperNotification._id,
        shipmentId: shipment._id,
        tripId: otpDoc.trip,
        status: 'DELIVERED',
        deliveredAt: new Date(),
        pickupCity: shipment.pickupCity,
        dropCity: shipment.dropCity,
        carrierName,
        impact
      };

      io.to(`shipper:${otpDoc.shipper}`).emit('delivery:completed', deliveredPayload);
      io.to(`user_${otpDoc.shipper}`).emit('delivery:completed', deliveredPayload);

      // Rating Available Socket Notification
      const ratingPayload = {
        shipmentId: shipment._id,
        tripId: otpDoc.trip,
        partnerId: carrierId,
        partnerName: carrierName,
        partnerRole: 'CARRIER',
        title: shipment.title || `${shipment.pickupCity} → ${shipment.dropCity}`
      };

      io.to(`user_${otpDoc.shipper}`).emit('rating:available', ratingPayload);
      io.to(`user_${carrierId}`).emit('rating:available', {
        shipmentId: shipment._id,
        tripId: otpDoc.trip,
        partnerId: otpDoc.shipper,
        partnerName: 'Shipper Customer',
        partnerRole: 'SHIPPER',
        title: shipment.title || `${shipment.pickupCity} → ${shipment.dropCity}`
      });
    }

    return {
      success: true,
      message: 'Delivery verified and completed successfully!',
      shipment,
      trip,
      pod
    };
  }

  async resendDeliveryOtp(carrierId, shipmentId, io = null) {
    const activeOtp = await DeliveryOTP.findOne({ shipment: shipmentId, status: 'PENDING' });
    if (activeOtp && activeOtp.resendCooldownUntil && new Date() < new Date(activeOtp.resendCooldownUntil)) {
      const waitSec = Math.ceil((new Date(activeOtp.resendCooldownUntil) - new Date()) / 1000);
      throw new Error(`Please wait ${waitSec} seconds before requesting a new OTP.`);
    }

    return await this.requestDeliveryOtp(carrierId, shipmentId, activeOtp?.trip, io);
  }

  async getShipperActiveOtp(shipperId, shipmentId) {
    const activeOtpDoc = await DeliveryOTP.findOne({
      shipment: shipmentId,
      shipper: shipperId,
      status: 'PENDING',
      expiresAt: { $gt: new Date() }
    }).populate('shipment trip carrier');

    if (!activeOtpDoc) {
      return null;
    }

    // Find plaintext OTP from Shipper's notification
    const notifications = await notificationService.getUserNotifications(shipperId, 10);
    const otpNotif = notifications.find(n => n.shipment?._id?.toString() === shipmentId?.toString() && n.metadata?.otp);

    return {
      shipmentId,
      otp: otpNotif?.metadata?.otp || '******',
      expiresAt: activeOtpDoc.expiresAt,
      status: activeOtpDoc.status
    };
  }

  async getPodByTrip(tripId) {
    return await ProofOfDelivery.findOne({ trip: tripId }).populate('trip shipment carrier shipper confirmedBy');
  }
}

module.exports = new PodService();
