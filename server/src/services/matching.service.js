const mongoose = require('mongoose');
const matchRanker = require('./ai/matchRanker');
const Match = require('../models/Match');
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Capacity = require('../models/Capacity');
const Shipment = require('../models/Shipment');
const User = require('../models/User');
const notificationService = require('./notification.service');

const isValidObjectId = (id) => id && mongoose.Types.ObjectId.isValid(id);

class MatchingService {
  async getTopRecommendationForVehicle(vehicleId) {
    return await matchRanker.getOrGenerateMatchForVehicle(vehicleId);
  }

  async createMatch(data) {
    return await Match.create(data);
  }

  async acceptMatch(userId, matchData, io = null) {
    const shipmentId = matchData.shipmentId || matchData.shipment || matchData.id;

    let targetShipment = null;

    // Atomic update if target shipment ID is provided to prevent RACE CONDITIONS
    if (shipmentId && isValidObjectId(shipmentId)) {
      targetShipment = await Shipment.findOneAndUpdate(
        { _id: shipmentId, status: 'POSTED' },
        { status: 'BOOKED' },
        { new: true }
      );

      if (!targetShipment) {
        const existing = await Shipment.findById(shipmentId);
        if (existing && existing.status !== 'POSTED') {
          throw new Error('Shipment is no longer available.');
        } else if (!existing) {
          throw new Error('Shipment not found.');
        }
      }
    }

    // Load or create vehicle
    let vehicle = null;
    if (matchData.vehicle) {
      if (typeof matchData.vehicle === 'string') {
        if (isValidObjectId(matchData.vehicle)) {
          vehicle = await Vehicle.findById(matchData.vehicle);
        } else {
          vehicle = await Vehicle.findOne({ registrationNumber: matchData.vehicle });
        }
      } else if (matchData.vehicle._id && isValidObjectId(matchData.vehicle._id)) {
        vehicle = await Vehicle.findById(matchData.vehicle._id);
      } else if (matchData.vehicle.registrationNumber) {
        vehicle = await Vehicle.findOne({ registrationNumber: matchData.vehicle.registrationNumber });
      }
    }

    if (!vehicle) {
      vehicle = await Vehicle.findOne({ carrier: userId }) || await Vehicle.create({
        carrier: userId,
        registrationNumber: `REG-${Date.now().toString().slice(-6)}`,
        vehicleType: 'HEAVY_TRUCK',
        totalCapacityTons: 10,
        availableCapacityTons: 7.5,
        currentCity: matchData.pickupCity || matchData.origin || 'Delhi',
        destinationCity: matchData.dropCity || matchData.destination || 'Jaipur'
      });
    }

    const capacityId = isValidObjectId(matchData.capacityId) ? matchData.capacityId : null;
    const resolvedShipmentId = targetShipment ? targetShipment._id : (isValidObjectId(shipmentId) ? shipmentId : null);
    const shipperId = targetShipment ? targetShipment.shipper : (isValidObjectId(matchData.shipperId) ? matchData.shipperId : userId);

    const price = Number(targetShipment?.offeredPriceINR || matchData.grossRevenueINR || matchData.agreedPrice || matchData.offeredPriceINR || 7200);
    const detour = Number(matchData.detourKm || 8);

    // Create Match Record
    const matchRecord = await Match.create({
      vehicle: vehicle._id,
      capacity: capacityId,
      shipments: resolvedShipmentId ? [resolvedShipmentId] : [],
      carrier: userId,
      shipper: shipperId,
      matchScore: matchData.matchScore || 94,
      confidenceScore: 95,
      recommendation: 'ACCEPT',
      grossRevenueINR: price,
      estimatedCostINR: Math.round(price * 0.15),
      netContributionINR: Math.round(price * 0.85),
      agreedPrice: price,
      detourKm: detour,
      utilisationPercent: 88,
      co2SavedKg: Math.round(detour * 0.85),
      reasons: matchData.reasons || ['Route 100% aligned along scheduled corridor', 'Verified carrier'],
      status: 'BOOKED'
    });

    const origin = targetShipment?.pickupCity || vehicle.currentCity || matchData.origin || 'Delhi';
    const destination = targetShipment?.dropCity || vehicle.destinationCity || matchData.destination || 'Jaipur';

    // Create Trip Record
    const trip = await Trip.create({
      carrier: userId,
      shipper: shipperId,
      vehicle: vehicle._id,
      shipments: resolvedShipmentId ? [resolvedShipmentId] : [],
      origin,
      destination,
      status: 'IN_TRANSIT',
      grossRevenueINR: matchRecord.grossRevenueINR,
      netContributionINR: matchRecord.netContributionINR,
      detourKm: matchRecord.detourKm,
      co2SavedKg: matchRecord.co2SavedKg,
      currentPosition: {
        lat: 28.6139,
        lng: 77.2090,
        city: origin
      },
      currentSpeedKm: 62,
      eta: '3 hrs 45 mins'
    });

    // Update Vehicle available capacity
    const weightToDeduct = Number(targetShipment?.weightTons || matchData.totalWeight || matchData.weightTons || 2.5);
    vehicle.availableCapacityTons = Math.max(0, vehicle.availableCapacityTons - weightToDeduct);
    vehicle.usedCapacityTons = vehicle.totalCapacityTons - vehicle.availableCapacityTons;
    await vehicle.save();

    if (capacityId) {
      await Capacity.findByIdAndUpdate(capacityId, { status: 'PARTIALLY_BOOKED' });
    }

    if (resolvedShipmentId && !targetShipment) {
      await Shipment.findByIdAndUpdate(resolvedShipmentId, { status: 'BOOKED' });
    }

    // Fetch carrier details to notify Shipper
    const carrierUser = await User.findById(userId);
    const carrierName = carrierUser?.name || carrierUser?.company || 'Carrier Logistics';

    // 1. Create persistent MongoDB Notification for Shipper
    const notification = await notificationService.createNotification({
      recipient: shipperId,
      type: 'SHIPMENT_ACCEPTED',
      title: 'Shipment Accepted!',
      message: `Your shipment ${origin} → ${destination} was accepted by ${carrierName}.`,
      shipment: resolvedShipmentId,
      trip: trip._id,
      match: matchRecord._id,
      metadata: {
        tripId: trip._id,
        carrierName,
        company: carrierUser?.company || '',
        vehicleReg: vehicle.registrationNumber,
        pickupCity: origin,
        dropCity: destination,
        offeredPriceINR: price
      }
    });

    // 2. Emit real-time Socket.IO event to Shipper
    if (io) {
      const shipperPayload = {
        notificationId: notification._id,
        shipmentId: resolvedShipmentId,
        tripId: trip._id,
        status: 'ACCEPTED',
        pickupCity: origin,
        dropCity: destination,
        price,
        offeredPriceINR: price,
        carrier: {
          id: userId,
          name: carrierName,
          company: carrierUser?.company || '',
          rating: carrierUser?.rating || 4.8
        },
        vehicle: {
          id: vehicle._id,
          registrationNumber: vehicle.registrationNumber,
          vehicleType: vehicle.vehicleType
        }
      };

      io.to(`shipper:${shipperId}`).emit('shipment:accepted', shipperPayload);
      io.to(`user_${shipperId}`).emit('shipment:accepted', shipperPayload);
      io.to(`shipper:${shipperId}`).emit('booking_confirmed', shipperPayload);
      io.to(`user_${shipperId}`).emit('booking_confirmed', shipperPayload);
    }

    return trip;
  }
}

module.exports = new MatchingService();
