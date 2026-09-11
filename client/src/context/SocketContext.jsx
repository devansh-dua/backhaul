import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import API from '../services/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connected' | 'reconnecting' | 'disconnected'
  const [incomingShipment, setIncomingShipment] = useState(null);
  const [shipperAccepted, setShipperAccepted] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [acceptingLoad, setAcceptingLoad] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  const { user } = useAuth();

  const [shipperDeliveryOtp, setShipperDeliveryOtp] = useState(null);
  const [deliveryCompleted, setDeliveryCompleted] = useState(null);

  const [ratingPrompt, setRatingPrompt] = useState(null);

  // Audio chime player for notifications
  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio autoplay policy guard
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('backhaulx_token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

    const newSocket = io(socketUrl, {
      auth: { token },
      query: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket.IO connected with ID:', newSocket.id);
      setConnectionStatus('connected');

      if (user) {
        newSocket.emit('join_user_room', { userId: user._id || user.id, role: user.role });
      }
    });

    newSocket.on('reconnecting', () => {
      setConnectionStatus('reconnecting');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', () => {
      setConnectionStatus('reconnecting');
    });

    // Handle new incoming shipment notification for Carrier
    newSocket.on('shipment:new', (data) => {
      console.log('🚛 Real-Time Incoming Shipment Socket Event Received:', data);
      playNotificationSound();
      setIncomingShipment(data);
      setUnreadCount(prev => prev + 1);
    });

    // Handle carrier booking request (fallback)
    newSocket.on('carrier_booking_request', (data) => {
      console.log('🚛 Uber-style Freight Booking Request Received:', data);
      playNotificationSound();
      setIncomingShipment(prev => prev || data);
      setUnreadCount(prev => prev + 1);
    });

    // Handle shipment accepted notification for Shipper
    newSocket.on('shipment:accepted', (data) => {
      console.log('✅ Real-Time Shipment Accepted Socket Event Received:', data);
      playNotificationSound();
      setShipperAccepted(data);
      setUnreadCount(prev => prev + 1);
    });

    // Handle delivery OTP requested event for Shipper
    newSocket.on('delivery:otp-requested', (data) => {
      console.log('🔑 Real-Time Delivery OTP Requested Event:', data);
      playNotificationSound();
      setShipperDeliveryOtp(data);
      setUnreadCount(prev => prev + 1);
    });

    // Handle delivery completed event for Shipper
    newSocket.on('delivery:completed', (data) => {
      console.log('🎉 Real-Time Delivery Completed Event:', data);
      playNotificationSound();
      setDeliveryCompleted(data);
      setUnreadCount(prev => prev + 1);
    });

    // Handle rating available event for both parties
    newSocket.on('rating:available', (data) => {
      console.log('⭐ Real-Time Rating Available Event Received:', data);
      playNotificationSound();
      setRatingPrompt(data);
    });

    // Handle booking confirmed (fallback)
    newSocket.on('booking_confirmed', (data) => {
      console.log('✅ Booking Confirmed Socket Event:', data);
      if (user && user.role === 'SHIPPER') {
        playNotificationSound();
        setShipperAccepted(data);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, playNotificationSound]);

  // Fetch initial unread count on mount or user change
  useEffect(() => {
    if (user) {
      API.get('/notifications')
        .then(res => {
          if (res.data?.success) {
            setUnreadCount(res.data.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Real backend ACCEPT shipment call
  const acceptShipment = async (shipmentId, additionalData = {}) => {
    setAcceptingLoad(true);
    setAcceptError(null);
    try {
      const res = await API.post(`/matches/${shipmentId}/accept`, {
        shipmentId,
        ...additionalData
      });

      if (res.data?.success) {
        const trip = res.data.data;
        setIncomingShipment(null);
        return { success: true, trip };
      } else {
        throw new Error(res.data?.message || 'Failed to accept shipment');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to accept shipment';
      setAcceptError(message);
      return { success: false, message };
    } finally {
      setAcceptingLoad(false);
    }
  };

  const dismissIncomingShipment = () => {
    setIncomingShipment(null);
    setAcceptError(null);
  };

  const dismissShipperAccepted = () => {
    setShipperAccepted(null);
  };

  const dismissShipperDeliveryOtp = () => {
    setShipperDeliveryOtp(null);
  };

  const dismissDeliveryCompleted = () => {
    setDeliveryCompleted(null);
  };

  const dismissRatingPrompt = () => {
    setRatingPrompt(null);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connectionStatus,
      incomingShipment,
      shipperAccepted,
      shipperDeliveryOtp,
      deliveryCompleted,
      ratingPrompt,
      unreadCount,
      setUnreadCount,
      acceptingLoad,
      acceptError,
      acceptShipment,
      dismissIncomingShipment,
      dismissShipperAccepted,
      dismissShipperDeliveryOtp,
      dismissDeliveryCompleted,
      dismissRatingPrompt
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
