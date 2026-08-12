import api from './api';

export const progressService = {
  getProgressByMember: async (memberId) => {
    const response = await api.get(`/progress/member/${memberId}`);
    return response.data;
  },

  addProgress: async (data) => {
    const response = await api.post('/progress', data);
    return response.data;
  },

  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },

  getMyProgress: async () => {
    const response = await api.get('/progress/my');
    return response.data;
  }
};
