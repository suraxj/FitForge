import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data && response.data.data.token) {
      localStorage.setItem('fitforge_token', response.data.data.token);
      localStorage.setItem('fitforge_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data && response.data.data.token) {
      localStorage.setItem('fitforge_token', response.data.data.token);
      localStorage.setItem('fitforge_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('fitforge_token');
    localStorage.removeItem('fitforge_user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};
