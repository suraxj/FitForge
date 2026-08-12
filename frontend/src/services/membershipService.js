import api from './api';

export const membershipService = {
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  createPlan: async (data) => {
    const response = await api.post('/plans', data);
    return response.data;
  },

  updatePlan: async (id, data) => {
    const response = await api.put(`/plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },

  getMemberships: async (params) => {
    const response = await api.get('/memberships', { params });
    return response.data;
  },

  assignMembership: async (data) => {
    const response = await api.post('/memberships', data);
    return response.data;
  },

  updateMembership: async (id, data) => {
    const response = await api.put(`/memberships/${id}`, data);
    return response.data;
  },

  deleteMembership: async (id) => {
    const response = await api.delete(`/memberships/${id}`);
    return response.data;
  },

  getMyMembership: async () => {
    const response = await api.get('/memberships/my');
    return response.data;
  }
};
