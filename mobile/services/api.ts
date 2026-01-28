import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Altere para a URL do backend em produção
  timeout: 10000,
});

export default api;
