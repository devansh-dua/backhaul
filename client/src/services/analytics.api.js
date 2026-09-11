import API from './api';

export const analyticsApi = {
  getCarrierStats: () => API.get('/analytics/carrier'),
  getShipperStats: () => API.get('/analytics/shipper')
};
