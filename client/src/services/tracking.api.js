import API from './api';

export const trackingApi = {
  getLatestTracking: (tripId) => API.get(`/tracking/${tripId}`)
};
