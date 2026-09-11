const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const whatIfService = require('../services/ai/whatIf.service');
const acceptRejectService = require('../services/ai/acceptReject.service');
const loadOptimizer = require('../services/ai/loadOptimizer');
const reoptimizationService = require('../services/ai/reoptimization.service');
const Vehicle = require('../models/Vehicle');
const Shipment = require('../models/Shipment');
const aiController = require('../controllers/ai.controller');

// BACKTRACKING Multilingual Voice AI Copilot Endpoints
router.post('/copilot', protect, aiController.handleCopilotRequest);
router.post('/copilot/translate', protect, aiController.translateMessage);
router.get('/copilot/analytics', protect, aiController.getCopilotAnalytics);

// AI Match Endpoint (Shipper matching real candidate capacity)
router.post('/match', protect, aiController.matchShipment);

// What-If Simulation Endpoint
router.post('/what-if', protect, async (req, res) => {
  try {
    const { baseMetrics, params } = req.body;
    const result = whatIfService.simulateScenario(baseMetrics || {}, params || {});
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Multi-Load Optimizer Endpoint
router.post('/optimize-multiload', protect, async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    const candidateGenerator = require('../services/ai/candidateGenerator');
    const { candidates } = await candidateGenerator.getFeasibleCandidatesForVehicle(vehicleId);
    const result = loadOptimizer.findOptimalLoadCombinations(vehicle, candidates);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Accept/Reject Intelligence Evaluation
router.post('/evaluate-load', protect, async (req, res) => {
  try {
    const { vehicleId, shipmentId, detourKm } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    const shipment = await Shipment.findById(shipmentId);
    const driverHoursService = require('../services/driverHours.service');
    const dhCheck = driverHoursService.validateDriverHours(vehicle, detourKm || 20, 260);

    const result = acceptRejectService.evaluateLoad(vehicle, shipment, detourKm || 20, dhCheck);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Backhaul Radar Demand Heatmap
router.get('/radar', protect, async (req, res) => {
  try {
    const postedShipments = await Shipment.find({ status: 'POSTED' });
    const corridorDemands = [
      { city: 'Gurgaon', lat: 28.4595, lng: 77.0266, activeLoads: 3, totalWeightTons: 6.8, avgRatePerTonKm: '₹4.5' },
      { city: 'Neemrana', lat: 27.9890, lng: 76.3813, activeLoads: 2, totalWeightTons: 4.2, avgRatePerTonKm: '₹4.2' },
      { city: 'Kotputli', lat: 27.7028, lng: 76.2008, activeLoads: 4, totalWeightTons: 9.5, avgRatePerTonKm: '₹4.8' },
      { city: 'Shahpura', lat: 27.3871, lng: 75.9615, activeLoads: 2, totalWeightTons: 5.1, avgRatePerTonKm: '₹4.1' }
    ];
    res.json({ success: true, data: corridorDemands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Market Intelligence Endpoint
router.get('/market-intelligence', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        corridor: 'Delhi → Jaipur (NH 48)',
        supplyDemandIndex: 'High Demand / Moderate Capacity',
        avgBackhaulRatePerKm: '₹42.50',
        availableCapacityTons: 42.5,
        totalActiveShipments: 18,
        averageDetourKm: 18.4,
        co2SavedThisMonthKg: 14850,
        recentCorridorTrends: [
          { date: 'Mon', avgPrice: 18200, loads: 12 },
          { date: 'Tue', avgPrice: 19400, loads: 15 },
          { date: 'Wed', avgPrice: 21700, loads: 18 },
          { date: 'Thu', avgPrice: 20500, loads: 14 },
          { date: 'Fri', avgPrice: 22800, loads: 21 },
          { date: 'Sat', avgPrice: 24100, loads: 25 },
          { date: 'Sun', avgPrice: 21900, loads: 19 }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Continuous Reoptimization Trigger
router.post('/reoptimize', protect, async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const result = await reoptimizationService.triggerReoptimization(vehicleId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Gemini AI Shortest Path Route Optimizer
router.post('/optimize-route', protect, async (req, res) => {
  try {
    const { origin, destination, waypoints } = req.body;
    const geminiRouteOptimizer = require('../services/ai/geminiRouteOptimizer');
    const result = await geminiRouteOptimizer.generateShortestPath(
      origin || 'Delhi',
      destination || 'Jaipur',
      waypoints || []
    );
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
