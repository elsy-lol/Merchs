import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    const decoded = jwtDecode(response.data.access);
    setUser(decoded);
    return response.data;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    const decoded = jwtDecode(response.data.access);
    setUser(decoded);
    return response.data;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try { await authAPI.logout(refreshToken); } catch (e) { console.error('Logout error:', e); }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};