import API from './api';

export const capacityApi = {
  publishCapacity: (data) => API.post('/capacity', data),
  getOpenCapacities: () => API.get('/capacity/open'),
  getCarrierCapacities: () => API.get('/capacity/my')
};
