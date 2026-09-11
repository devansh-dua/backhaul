import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket.IO connected seamlessly:', newSocket.id);
      if (user) {
        newSocket.emit('join_user_room', { userId: user._id || user.id, role: user.role });
      } else {
        newSocket.emit('join_user_room', { role: 'CARRIER' });
      }
    });

    newSocket.on('carrier_booking_request', (data) => {
      console.log('🔔 Uber-style Freight Booking Request Received:', data);
      setIncomingRequest(data);
    });

    newSocket.on('booking_confirmed', (data) => {
      console.log('✅ Ride/Trip Confirmed Real-time:', data);
      setConfirmedBooking(data);
      setBookingStatus('ACCEPTED');
      setIncomingRequest(null);
    });

    newSocket.on('booking_rejected', (data) => {
      console.warn('❌ Booking Declined by Carrier:', data);
      setBookingStatus('REJECTED');
      setIncomingRequest(null);
    });

    newSocket.on('booking_request_dispatched', () => {
      setBookingStatus('WAITING');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user]);

  const requestTruckBooking = (bookingPayload) => {
    if (!socket) return;
    setBookingStatus('WAITING');
    socket.emit('request_truck_booking', bookingPayload);
  };

  const respondBookingRequest = (requestId, status, additionalData = {}) => {
    if (!socket) return;
    socket.emit('carrier_booking_response', {
      requestId,
      status,
      ...incomingRequest,
      ...additionalData
    });
    if (status === 'REJECTED') {
      setIncomingRequest(null);
    }
  };

  const clearBookingState = () => {
    setIncomingRequest(null);
    setBookingStatus(null);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      incomingRequest,
      confirmedBooking,
      bookingStatus,
      requestTruckBooking,
      respondBookingRequest,
      clearBookingState,
      setConfirmedBooking
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
