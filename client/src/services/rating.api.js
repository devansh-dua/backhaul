import API from './api';

export const ratingApi = {
  submitRating: (data) => API.post('/ratings', data),
  getUserRatings: (userId) => API.get(userId ? `/ratings/user/${userId}` : '/ratings/my'),
  getTrustProfile: (userId) => API.get(userId ? `/trust/${userId}` : '/trust')
};
