import API from './api';

export const trustApi = {
  getTrustProfile: (userId) => API.get(userId ? `/trust/${userId}` : '/trust'),
  getTopPartners: (userId) => API.get(userId ? `/trust/partners?userId=${userId || ''}` : '/trust/partners'),
  submitRating: (data) => API.post('/trust/rate', data)
};
