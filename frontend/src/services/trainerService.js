import api from './api';

export const trainerService = {
  getTrainers: async (params) => {
    const response = await api.get('/trainers', { params });
    return response.data;
  },

  getTrainerById: async (id) => {
    const response = await api.get(`/trainers/${id}`);
    return response.data;
  },

  createTrainer: async (data) => {
    const response = await api.post('/trainers', data);
    return response.data;
  },

  updateTrainer: async (id, data) => {
    const response = await api.put(`/trainers/${id}`, data);
    return response.data;
  },

  deleteTrainer: async (id) => {
    const response = await api.delete(`/trainers/${id}`);
    return response.data;
  },

  getMyAssignedMembers: async () => {
    const response = await api.get('/trainers/members/assigned');
    return response.data;
  }
};
