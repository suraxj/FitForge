import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || '/api';

// Normalize URL: remove trailing slash
if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}

// Auto-append /api if missing in environment variable
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('fitforge_token');
        localStorage.removeItem('fitforge_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
