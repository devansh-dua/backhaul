import API from './api';

export const matchApi = {
  findCapacityMatches: (params) => API.post('/matches/capacity', params),
  getRecommendation: (vehicleId) => API.get(`/matches/recommendation/${vehicleId}`),
  acceptMatch: (matchData) => API.post('/matches/accept', matchData)
};
