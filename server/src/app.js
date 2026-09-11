const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const capacityRoutes = require('./routes/capacity.routes');
const matchRoutes = require('./routes/match.routes');
const tripRoutes = require('./routes/trip.routes');
const trackingRoutes = require('./routes/tracking.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const podRoutes = require('./routes/pod.routes');
const ratingRoutes = require('./routes/rating.routes');
const aiRoutes = require('./routes/ai.routes');

const driverRoutes = require('./routes/driver.routes');

const notificationRoutes = require('./routes/notification.routes');

const trustRoutes = require('./routes/trust.routes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BACKTRACKING API is running smoothly',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/capacity', capacityRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pod', podRoutes);
app.use('/api/delivery', podRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
