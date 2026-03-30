import api from './axios';

export const ordersAPI = {
  getOrders: () => api.get('orders/'),
  getOrder: (id) => api.get(`orders/${id}/`),
  createOrder: (data) => api.post('orders/', data),
  confirmReceipt: (id) => api.post(`orders/${id}/confirm_receipt/`),
  cancelOrder: (id) => api.post(`orders/${id}/cancel/`),
  getMySales: () => api.get('orders/my_sales/'),
};