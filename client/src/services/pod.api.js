import API from './api';

export const podApi = {
  confirmDelivery: (tripId, shipmentId, receiverName, notes) => API.post('/pod/confirm', { tripId, shipmentId, receiverName, notes }),
  getPod: (tripId) => API.get(`/pod/${tripId}`)
};
