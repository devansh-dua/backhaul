import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('backhaulx_token');
  if (token && token !== 'undefined' && token !== 'null' && token !== '[object Object]') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ 401 Unauthorized response from API, resetting token in storage.');
      localStorage.removeItem('backhaulx_token');
    }
    return Promise.reject(error);
  }
);

export default API;
