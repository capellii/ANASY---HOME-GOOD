import axios from 'axios';

// Use localhost for Expo Web, or your local IP for mobile device testing
// For device testing, replace 'localhost' with '192.168.3.5' (your local IP)
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Change to http://192.168.3.5:3000/api for device testing
  timeout: 10000,
});

export default api;
