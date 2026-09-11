const express = require('express');
const router = express.Router();
const podController = require('../controllers/pod.controller');
const { protect } = require('../middleware/auth.middleware');

// OTP Request Endpoints
router.post('/request-otp', protect, podController.requestOtp);
router.post('/:shipmentId/request-otp', protect, podController.requestOtp);

// OTP Verification Endpoints
router.post('/verify-otp', protect, podController.verifyOtp);
router.post('/:shipmentId/verify-otp', protect, podController.verifyOtp);

// OTP Resend Endpoints
router.post('/resend-otp', protect, podController.resendOtp);
router.post('/:shipmentId/resend-otp', protect, podController.resendOtp);

// Shipper OTP Lookup Endpoint
router.get('/shipper-otp/:shipmentId', protect, podController.getShipperActiveOtp);

// POD Records & Legacy
router.post('/confirm', protect, podController.confirmDelivery);
router.get('/:tripId', protect, podController.getPodByTrip);

module.exports = router;
