// src/services/api.ts

import axios from 'axios';
import { storage } from './utils/storage';


import Constants from 'expo-constants';

// Для веба/эмуляторов используем localhost. 
// Для реальных устройств замените на свой локальный IP (например, 'http://192.168.1.10:8000/api')
const API_BASE_URL = 'http://localhost:8000/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Интерцептор для добавления токена
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Интерцептор для обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await storage.getItem('refresh_token');

        const response = await axios.post(`${API_BASE_URL}/users/refresh/`, {
          refresh: refreshToken,
        });
        
        await storage.setItem('access_token', response.data.access);

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        await storage.deleteItem('access_token');
        await storage.deleteItem('refresh_token');

        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;