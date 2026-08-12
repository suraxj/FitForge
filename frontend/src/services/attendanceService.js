import api from './api';

export const attendanceService = {
  getAttendance: async (params) => {
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  markAttendance: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/attendance/my');
    return response.data;
  }
};
