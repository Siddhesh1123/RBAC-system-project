import axios from 'axios';

const API_BASE_URL = 'https://rbac-system-project-main.onrender.com/api'; // Adjust as per your backend

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default api;
