const trackingService = require('../services/tracking.service');
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Shipment = require('../models/Shipment');

const activeBookingRequests = new Map();

function initTrackingSocket(io) {
  const activeSimulations = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    socket.on('join_user_room', ({ userId, role }) => {
      if (userId) socket.join(`user_${userId}`);
      if (role) socket.join(`role_${role}`);
      socket.join('global_users');
      console.log(`📡 Socket ${socket.id} joined user_${userId} & role_${role}`);
    });

    socket.on('join_trip_tracking', async ({ tripId }) => {
      socket.join(`trip_${tripId}`);
      console.log(`📡 Socket ${socket.id} joined tracking for trip: ${tripId}`);

      if (!activeSimulations.has(tripId)) {
        let originCity = 'Delhi';
        let destCity = 'Jaipur';
        try {
          const tripDoc = await Trip.findById(tripId);
          if (tripDoc) {
            originCity = tripDoc.origin || 'Delhi';
            destCity = tripDoc.destination || 'Jaipur';
          }
        } catch (e) {
          // ignore fallback
        }
        startGpsSimulator(io, tripId, activeSimulations, originCity, destCity);
      }
    });

    // Real-time Uber-style Truck Booking Request from Shipper
    socket.on('request_truck_booking', (bookingData) => {
      console.log('⚡ Received Uber-style Truck Booking Request:', bookingData);
      const requestId = bookingData.requestId || `req_${Date.now()}`;
      const payload = {
        ...bookingData,
        requestId,
        timestamp: new Date().toISOString()
      };

      activeBookingRequests.set(requestId, payload);

      // Notify target carrier, all carriers, and global listeners
      if (bookingData.carrierId) {
        io.to(`user_${bookingData.carrierId}`).emit('carrier_booking_request', payload);
      }
      io.to('role_CARRIER').emit('carrier_booking_request', payload);
      io.to('global_users').emit('carrier_booking_request', payload);

      socket.emit('booking_request_dispatched', { requestId, status: 'DISPATCHED' });
    });

    // Carrier Response (Accept / Reject)
    socket.on('carrier_booking_response', async (responseData) => {
      console.log('⚡ Carrier Booking Response:', responseData);
      const { requestId, status, shipperId, carrierId, vehicleId, pickupCity, dropCity, price } = responseData;
      const activeReq = activeBookingRequests.get(requestId) || responseData;

      if (status === 'ACCEPTED') {
        try {
          let vehicleObj = null;
          if (vehicleId || activeReq.vehicleId) {
            vehicleObj = await Vehicle.findById(vehicleId || activeReq.vehicleId).catch(() => null);
          }
          if (!vehicleObj) {
            vehicleObj = await Vehicle.findOne().catch(() => null);
          }

          let createdTripId;
          const origin = pickupCity || activeReq.pickupCity || 'Delhi';
          const destination = dropCity || activeReq.dropCity || 'Jaipur';
          const grossRevenue = price || activeReq.offeredPriceINR || 14500;

          if (vehicleObj) {
            const tripDoc = await Trip.create({
              carrier: carrierId || vehicleObj.carrier,
              shipper: shipperId || activeReq.shipperId,
              vehicle: vehicleObj._id,
              origin,
              destination,
              status: 'BOOKED',
              grossRevenueINR: grossRevenue,
              netContributionINR: Math.round(grossRevenue * 0.85),
              detourKm: activeReq.detourKm || 18,
              co2SavedKg: 180,
              currentPosition: {
                lat: 28.6139,
                lng: 77.2090,
                city: origin
              },
              currentSpeedKm: 60,
              eta: '3 hrs 30 mins'
            });
            createdTripId = String(tripDoc._id);
          } else {
            createdTripId = 'demo_trip_' + Date.now();
          }

          // Automatically launch dynamic GPS route simulation
          startGpsSimulator(io, createdTripId, activeSimulations, origin, destination);

          const confirmPayload = {
            requestId,
            status: 'ACCEPTED',
            tripId: createdTripId,
            pickupCity: origin,
            dropCity: destination,
            price: grossRevenue,
            vehicle: vehicleObj,
            shipperId: shipperId || activeReq.shipperId,
            carrierId: carrierId || activeReq.carrierId
          };

          // Emit to shipper, carrier, and global rooms
          if (shipperId || activeReq.shipperId) {
            io.to(`user_${shipperId || activeReq.shipperId}`).emit('booking_confirmed', confirmPayload);
          }
          if (carrierId || activeReq.carrierId) {
            io.to(`user_${carrierId || activeReq.carrierId}`).emit('booking_confirmed', confirmPayload);
          }
          io.to('global_users').emit('booking_confirmed', confirmPayload);

          activeBookingRequests.delete(requestId);
        } catch (err) {
          console.error('Error creating trip on accept:', err);
        }
      } else if (status === 'REJECTED') {
        const rejectPayload = {
          requestId,
          status: 'REJECTED',
          reason: responseData.reason || 'Carrier declined this trip proposal.'
        };
        if (shipperId || activeReq.shipperId) {
          io.to(`user_${shipperId || activeReq.shipperId}`).emit('booking_rejected', rejectPayload);
        }
        io.to('global_users').emit('booking_rejected', rejectPayload);
        activeBookingRequests.delete(requestId);
      }
    });

    socket.on('leave_trip_tracking', ({ tripId }) => {
      socket.leave(`trip_${tripId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from Socket.IO: ${socket.id}`);
    });
  });
}

function startGpsSimulator(io, tripId, activeSimulations, originCity = 'Delhi', destCity = 'Jaipur') {
  const waypoints = trackingService.getCorridorWaypoints(originCity, destCity);
  let stepIndex = 0;

  const intervalId = setInterval(async () => {
    const wp = waypoints[stepIndex];
    const currentSpeed = 58 + Math.floor(Math.random() * 12); // 58-70 km/h

    const updatePayload = {
      tripId,
      position: {
        lat: wp.lat,
        lng: wp.lng,
        city: wp.city
      },
      speed: currentSpeed,
      eta: wp.eta,
      progressPercent: wp.progress,
      remainingKm: Math.max(0, 260 - Math.round((wp.progress / 100) * 260)),
      timestamp: new Date()
    };

    const aiReoptimizationPayload = {
      tripId,
      checkpoint: wp.city,
      confidenceScore: 95 + (stepIndex % 4),
      remainingDriverHours: `${Math.max(0.5, (6.5 - (wp.progress / 100) * 4).toFixed(1))}h`,
      dynamicNetContribution: 18900,
      recommendation: wp.progress >= 90 ? 'DELIVERY_ARRIVED' : 'CONTINUE_CORRIDOR_OPTIMAL',
      nextActionReason: `Truck passing ${wp.city} at ${currentSpeed} km/h on ${originCity} to ${destCity} corridor.`
    };

    io.to(`trip_${tripId}`).emit('location_update', updatePayload);
    io.to(`trip_${tripId}`).emit('ai_reoptimization_update', aiReoptimizationPayload);

    try {
      await Trip.findByIdAndUpdate(tripId, {
        currentPosition: {
          lat: wp.lat,
          lng: wp.lng,
          city: wp.city
        },
        currentSpeedKm: currentSpeed,
        eta: wp.eta
      });
    } catch (e) {
      // ignore
    }

    stepIndex = (stepIndex + 1) % waypoints.length;
  }, 3000);

  activeSimulations.set(tripId, intervalId);
}

module.exports = initTrackingSocket;

