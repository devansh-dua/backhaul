import API from './api';

export const capacityApi = {
  publishCapacity: (data) => API.post('/capacity', data),
  getOpenCapacities: (params) => API.post('/matches/capacity', params || {}),
  searchCapacities: (params) => API.post('/matches/capacity', params || {}),
  getCarrierCapacities: () => API.get('/capacity/my')
};
