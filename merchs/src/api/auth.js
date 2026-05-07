import api from './axios';

export const authAPI = {
  login: (username, password) => api.post('users/login/', { username, password }),
  register: (data) => api.post('users/register/', data),
  logout: (refreshToken) => api.post('users/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('users/profile/'),
  updateProfile: (data) => api.patch('users/profile/', data),
  changePassword: (data) => api.post('users/change-password/', data),
  toggle2FA: (data) => api.post('users/toggle-2fa/', data),
  verify2FA: (data) => api.post('users/verify-2fa/', data),
  verifyLogin2FA: (username, code) => api.post('users/verify-login-2fa/', { username, code }),
};