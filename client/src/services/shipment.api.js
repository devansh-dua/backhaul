import API from './api';

export const shipmentApi = {
  createShipment: (data) => API.post('/shipments', data),
  getShipperShipments: () => API.get('/shipments/my'),
  getPostedShipments: () => API.get('/shipments/posted')
};
