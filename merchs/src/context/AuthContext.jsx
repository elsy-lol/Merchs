// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Ошибка входа');
      
      if (data.two_factor_required) {
        return { success: true, twoFactorRequired: true, method: data.method, username: data.username };
      }

      saveAuthData(data);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyLogin2FA = async (username, code) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/verify-login-2fa/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Неверный код');

      saveAuthData(data);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ✅ ПОВТОРНАЯ ОТПРАВКА КОДА
  const resend2FACode = async (username) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/resend-2fa/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Ошибка отправки');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Ошибка регистрации');

      if (data.access) saveAuthData(data);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const saveAuthData = (data) => {
    localStorage.setItem('access_token', data.access);
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
    if (data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    verifyLogin2FA,
    resend2FACode,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};