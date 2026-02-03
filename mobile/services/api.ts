import axios from 'axios';
import { Platform } from 'react-native';

// Determine API base URL based on platform
// Use port 3001 for proxy server (accessible from web browser)
let baseURL = 'http://127.0.0.1:3001/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

// Add request logging
api.interceptors.request.use((config) => {
  console.log(`📡 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  console.error('❌ Request config error:', error);
  return Promise.reject(error);
});

// Add response logging
api.interceptors.response.use((response) => {
  console.log(`✅ Response:`, response.status);
  return response;
}, (error) => {
  console.error('❌ Response error:', error.message, error.code);
  if (error.response) {
    console.error('Response data:', error.response.data);
  } else if (error.request) {
    console.error('No response received:', error.request);
  }
  return Promise.reject(error);
});

export default api;
