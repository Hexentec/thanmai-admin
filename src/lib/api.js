// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://server.thanmaihomefoods.com/api',
});

// Automatically attach JWT from localStorage on each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
