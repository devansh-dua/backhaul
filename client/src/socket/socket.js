import { io } from 'socket.io-client';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    const token = localStorage.getItem('backhaulx_token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

    socketInstance = io(socketUrl, {
      auth: { token },
      query: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      timeout: 20000
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
