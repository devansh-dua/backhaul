import API from './api';

export const matchApi = {
  getRecommendation: (vehicleId) => API.get(`/matches/recommendation/${vehicleId}`),
  acceptMatch: (matchData) => API.post('/matches/accept', matchData)
};
