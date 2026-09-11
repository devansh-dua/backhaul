const Trip = require('../../models/Trip');
const Vehicle = require('../../models/Vehicle');
const Capacity = require('../../models/Capacity');
const Shipment = require('../../models/Shipment');
const matchingService = require('../matching.service');
const shipmentService = require('../shipment.service');
const capacityService = require('../capacity.service');
const podService = require('../pod.service');
const candidateMatcher = require('./candidateMatcher');

class ActionEngine {
  /**
   * Controlled execution of backend logistics actions.
   * @param {Object} intentData - { intent, entities, language }
   * @param {String} userId - Authenticated user ID
   * @param {Object} context - Real DB Context
   * @param {Object} io - Socket.IO instance
   */
  async executeAction(intentData, userId, context = {}, io = null) {
    const { intent, entities = {} } = intentData;

    try {
      switch (intent) {
        case 'ACCEPT_SHIPMENT': {
          let capacityId = entities.capacityId;
          let weightTons = entities.weightTons || 2.5;

          if (!capacityId) {
            const availableLoads = context.carrierContext?.availableLoads || [];
            if (availableLoads.length > 0) {
              capacityId = availableLoads[0].capacityId;
            } else {
              const openCaps = await Capacity.find({ status: 'OPEN' }).limit(1);
              if (openCaps.length > 0) capacityId = openCaps[0]._id;
            }
          }

          if (!capacityId) {
            throw new Error('No open capacity slot available to match this shipment');
          }

          const matchData = {
            capacityId,
            shipmentId: entities.shipmentId,
            origin: entities.origin || 'Delhi',
            destination: entities.destination || 'Jaipur',
            totalWeight: weightTons,
            grossRevenueINR: entities.priceINR || 7800
          };

          const trip = await matchingService.acceptMatch(userId, matchData, io);

          return {
            actionExecuted: 'ACCEPT_SHIPMENT',
            success: true,
            tripId: trip._id,
            details: {
              tripId: trip._id,
              route: `${trip.origin} → ${trip.destination}`,
              grossRevenueINR: trip.grossRevenueINR,
              status: trip.status
            }
          };
        }

        case 'CREATE_SHIPMENT': {
          const shipmentPayload = {
            pickupCity: entities.origin || 'Delhi',
            dropCity: entities.destination || 'Jaipur',
            weightTons: Number(entities.weightTons) || 2.5,
            cargoType: entities.shipmentType || 'General Freight',
            pickupDate: entities.pickupDate || new Date().toISOString(),
            targetPriceINR: Math.round((entities.weightTons || 2.5) * 2800)
          };

          const shipment = await shipmentService.createShipment(userId, shipmentPayload);

          if (io) {
            io.emit('NEW_SHIPMENT_POSTED', {
              shipmentId: shipment._id,
              route: `${shipment.pickupCity} → ${shipment.dropCity}`,
              weightTons: shipment.weightTons
            });
          }

          return {
            actionExecuted: 'CREATE_SHIPMENT',
            success: true,
            shipmentId: shipment._id,
            details: {
              shipmentId: shipment._id,
              route: `${shipment.pickupCity} → ${shipment.dropCity}`,
              weightTons: shipment.weightTons,
              cargoType: shipment.cargoType
            }
          };
        }

        case 'UPDATE_AVAILABLE_CAPACITY':
        case 'CREATE_CAPACITY': {
          const newCapacity = Number(entities.availableCapacity || entities.weightTons || 3);
          const origin = entities.origin || 'Delhi';
          const destination = entities.destination || 'Jaipur';

          const primaryVehicle = context.carrierContext?.primaryVehicle;
          let vehicleId = primaryVehicle?.id;

          if (!vehicleId) {
            const v = await Vehicle.findOne({ carrier: userId });
            if (v) vehicleId = v._id;
          }

          if (vehicleId) {
            await Vehicle.findByIdAndUpdate(vehicleId, { availableCapacityTons: newCapacity });
          }

          const capacityRecord = await capacityService.publishCapacity(userId, {
            origin,
            destination,
            availableCapacityTons: newCapacity,
            totalCapacityTons: Math.max(10, newCapacity + 2),
            vehicleId,
            availableDate: new Date()
          });

          if (io) {
            io.emit('CAPACITY_UPDATED', {
              carrierId: userId,
              availableCapacityTons: newCapacity,
              origin,
              destination
            });
          }

          return {
            actionExecuted: intent,
            success: true,
            capacityId: capacityRecord._id,
            details: {
              availableCapacityTons: newCapacity,
              origin,
              destination
            }
          };
        }

        case 'VERIFY_DELIVERY_OTP': {
          const otpCode = entities.otpCode;
          if (!otpCode) throw new Error('OTP delivery code is missing');

          let activeTrip = context.carrierContext?.activeTrip;
          let tripId = activeTrip?.tripId;

          if (!tripId) {
            const trip = await Trip.findOne({
              $or: [{ carrier: userId }, { driver: userId }],
              status: { $in: ['IN_TRANSIT', 'AT_DELIVERY', 'BOOKED'] }
            }).sort({ updatedAt: -1 });

            if (trip) tripId = trip._id;
          }

          if (!tripId) {
            const anyTripWithOtp = await Trip.findOne({ status: { $ne: 'DELIVERED' } }).sort({ updatedAt: -1 });
            if (anyTripWithOtp) tripId = anyTripWithOtp._id;
          }

          if (!tripId) throw new Error('No active trip found requiring delivery OTP verification');

          const verifyResult = await podService.verifyDeliveryOTP(tripId, otpCode, io);

          return {
            actionExecuted: 'VERIFY_DELIVERY_OTP',
            success: verifyResult.verified,
            tripId,
            details: verifyResult
          };
        }

        case 'REQUEST_DELIVERY_OTP': {
          let activeTrip = context.carrierContext?.activeTrip;
          let tripId = activeTrip?.tripId;

          if (!tripId) {
            const trip = await Trip.findOne({
              $or: [{ carrier: userId }, { driver: userId }],
              status: { $in: ['IN_TRANSIT', 'BOOKED', 'EN_ROUTE_PICKUP'] }
            }).sort({ updatedAt: -1 });
            if (trip) tripId = trip._id;
          }

          if (!tripId) throw new Error('No active in-transit trip found');

          await Trip.findByIdAndUpdate(tripId, { status: 'AT_DELIVERY' });

          const otpRecord = await podService.generateDeliveryOTP(tripId, userId, io);

          return {
            actionExecuted: 'REQUEST_DELIVERY_OTP',
            success: true,
            tripId,
            details: {
              status: 'AT_DELIVERY',
              message: 'Delivery OTP dispatched to customer notification stream.'
            }
          };
        }

        case 'REJECT_SHIPMENT': {
          return {
            actionExecuted: 'REJECT_SHIPMENT',
            success: true,
            details: {
              reason: entities.reason || 'Detour too high',
              message: 'Shipment offer rejected. Scanning next compatible load.'
            }
          };
        }

        case 'START_TRIP': {
          let activeTrip = context.carrierContext?.activeTrip;
          let tripId = activeTrip?.tripId;
          if (!tripId) {
            const trip = await Trip.findOne({ carrier: userId, status: 'BOOKED' });
            if (trip) tripId = trip._id;
          }

          if (!tripId) throw new Error('No booked trip available to start');

          await Trip.findByIdAndUpdate(tripId, { status: 'IN_TRANSIT' });

          if (io) {
            io.emit('TRIP_STATUS_UPDATED', { tripId, status: 'IN_TRANSIT' });
          }

          return {
            actionExecuted: 'START_TRIP',
            success: true,
            tripId,
            details: { status: 'IN_TRANSIT' }
          };
        }

        default:
          return {
            actionExecuted: 'READ_ONLY_QUERY',
            success: true,
            details: { intent }
          };
      }
    } catch (err) {
      console.error(`🔥 ActionEngine Execution Error [${intent}]:`, err.message);
      return {
        actionExecuted: intent,
        success: false,
        error: err.message
      };
    }
  }
}

module.exports = new ActionEngine();
