// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ✅ Создаём контекст
const AuthContext = createContext(null);

// ✅ Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ✅ Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Мемоизируем checkAuth чтобы не вызывался бесконечно
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);  // ✅ Пустой массив зависимостей

  // ✅ Вызываем checkAuth только при монтировании
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Логин
  const login = async (username, password) => {
    try {
      console.log('🔐 Login request:', { username });
      
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📊 Login response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Login response ', data);

      if (!response.ok) {
        const errorMsg = data.detail || data.non_field_errors || 'Неверный логин или пароль';
        throw new Error(errorMsg);
      }
      
      // ✅ Сохраняем токены
      localStorage.setItem('access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      // ✅ Обновляем состояние сразу, не вызывая checkAuth
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }

      console.log('✅ Login successful');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Регистрация
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || JSON.stringify(error));
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Register error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Выход
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ✅ Обновление токена
  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    
    if (!refresh) {
      return false;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('❌ Refresh error:', error);
      logout();
      return false;
    }
  }, [logout]);

  // ✅ Универсальный fetch с авторизацией
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No access token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        const newToken = localStorage.getItem('access_token');
        return await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return response;
  }, [refreshToken]);

  // ✅ Значение контекста
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    refreshToken,
    fetchWithAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};