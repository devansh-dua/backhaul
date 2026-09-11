import API from './api';

export const tripApi = {
  getMyTrips: () => API.get('/trips/my'),
  getTripById: (id) => API.get(`/trips/${id}`)
};
