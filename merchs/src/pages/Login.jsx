// src/pages/Login.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// ✅ Начальное состояние формы
const initialFormData = {
  username: '',
  password: '',
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // ✅ Очищаем ошибку при вводе
    if (error) setError('');
  };

  // ✅ Очистка всей формы
  const handleClear = () => {
    setFormData(initialFormData);
    setError('');
    setShowPassword(false);
  };

  // ✅ Валидация формы
  const validateForm = () => {
    if (!formData.username.trim()) {
      return '❌ Имя пользователя или email обязателен';
    }
    if (!formData.password) {
      return '❌ Пароль обязателен';
    }
    return null;
  };

  // ✅ Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        console.log('✅ Вход успешен!');
        handleClear(); // ✅ Очищаем форму после успеха
        navigate('/');
      } else {
        setError(result.error || 'Неверный логин или пароль');
      }
    } catch (err) {
      console.error('❌ Ошибка входа:', err);
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Обработчик нажатия Enter в поле пароля
  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">ВХОД</h1>
          <p className="auth-subtitle">
            Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
          </p>
        </div>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
            <button type="button" onClick={() => setError('')} className="error-close">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="auth-label" htmlFor="username">Имя пользователя или email *</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="username или email@example.com"
              className="auth-input"
              disabled={loading}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div className="form-group">
            <label className="auth-label" htmlFor="password">Пароль *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handlePasswordKeyDown}
                required
                placeholder="••••••••"
                className="auth-input"
                style={{ paddingRight: '40px' }}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 5px',
                  lineHeight: '1',
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              disabled={loading || !formData.username.trim() || !formData.password} 
              className="auth-btn" 
              style={{ flex: 1 }}
            >
              {loading ? '⏳ Вход...' : '🔐 Войти'}
            </button>
            <button 
              type="button" 
              onClick={handleClear} 
              disabled={loading}
              className="auth-btn" 
              style={{ 
                flex: 0.4, 
                background: 'var(--bg-secondary)',
                border: '2px solid var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title="Очистить форму"
            >
              🗑️
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Забыли пароль? <Link to="/reset-password" style={{ color: 'var(--accent-primary)' }}>Восстановить</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;