import api from './axios';

export const userAPI = {
  getListings: () => api.get('users/my_listings/'),
  getMyOrders: () => api.get('users/my_orders/'),
};