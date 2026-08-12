import api from './api';

export const workoutService = {
  getWorkoutPlans: async (params) => {
    const response = await api.get('/workouts', { params });
    return response.data;
  },

  getWorkoutPlanById: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  saveWorkoutPlan: async (data) => {
    const response = await api.post('/workouts', data);
    return response.data;
  },

  deleteWorkoutPlan: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },

  getMyWorkoutPlan: async () => {
    const response = await api.get('/workouts/my');
    return response.data;
  }
};
