import axios from 'axios';

const api = axios.create({
  // Railway par ye REACT_APP_API_URL ka use karega, local mein localhost ka
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Automatically adds JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;