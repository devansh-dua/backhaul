import API from './api';

export const podApi = {
  requestOtp: (shipmentId, tripId) => API.post('/delivery/request-otp', { shipmentId, tripId }),
  verifyOtp: (shipmentId, otp, tripId) => API.post('/delivery/verify-otp', { shipmentId, otp, tripId }),
  resendOtp: (shipmentId, tripId) => API.post('/delivery/resend-otp', { shipmentId, tripId }),
  getShipperOtp: (shipmentId) => API.get(`/delivery/shipper-otp/${shipmentId}`),
  confirmDelivery: (tripId, shipmentId, receiverName, notes) => API.post('/delivery/confirm', { tripId, shipmentId, receiverName, notes }),
  getPod: (tripId) => API.get(`/delivery/${tripId}`)
};
