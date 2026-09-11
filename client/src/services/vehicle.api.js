import API from './api';

export const vehicleApi = {
  createVehicle: (data) => API.post('/vehicles', data),
  getCarrierVehicles: () => API.get('/vehicles/my'),
  getAvailableVehicles: () => API.get('/vehicles/available')
};
