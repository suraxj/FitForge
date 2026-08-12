import api from './api';

export const paymentService = {
  getPayments: async (params) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data;
  }
};
