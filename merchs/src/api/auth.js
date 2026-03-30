import api from './axios';

export const authAPI = {
  login: (email, password) => api.post('accounts/login/', { email, password }),
  register: (data) => api.post('accounts/register/', data),
  logout: (refreshToken) => api.post('users/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('users/profile/'),
  updateProfile: (data) => api.patch('users/profile/', data),
};