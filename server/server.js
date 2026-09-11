require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const initTrackingSocket = require('./src/socket/trackingSocket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO Server Setup with smooth transport upgrade
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// Initialize Socket.IO tracking events
initTrackingSocket(io);

// Connect DB & Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 BACKHAULX Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
