// src/pages/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  password_confirm: '',
  first_name: '',
  last_name: '',
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setError('');
    setShowPassword(false);
  };

  const validateForm = () => {
    // ✅ Валидация username
    if (!formData.username.trim()) {
      return '❌ Имя пользователя обязательно';
    }
    if (formData.username.length < 3) {
      return '❌ Имя пользователя должно быть не менее 3 символов';
    }
    if (!/^[a-zA-Z0-9@./+\-_]+$/.test(formData.username)) {
      return '❌ Имя пользователя может содержать только буквы, цифры и @/./+/-/_';
    }

    // ✅ Валидация email
    if (!formData.email.trim()) {
      return '❌ Email обязателен';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return '❌ Неверный формат email';
    }

    // ✅ Валидация пароля
    if (!formData.password) {
      return '❌ Пароль обязателен';
    }
    if (formData.password.length < 6) {
      return '❌ Пароль должен быть не менее 6 символов';
    }
    if (/^\d+$/.test(formData.password)) {
      return '❌ Пароль не должен состоять только из цифр';
    }
    if (formData.password === formData.username) {
      return '❌ Пароль не должен совпадать с именем пользователя';
    }

    // ✅ Подтверждение пароля
    if (formData.password !== formData.password_confirm) {
      return '❌ Пароли не совпадают';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        alert('✅ Регистрация успешна! Теперь войдите.');
        handleClear();
        navigate('/login');
      } else {
        // ✅ Показываем понятную ошибку от сервера
        const serverError = result.error;
        if (serverError && typeof serverError === 'string') {
          // Парсим JSON ошибку если есть
          try {
            const parsed = JSON.parse(serverError);
            if (parsed.username) {
              setError('❌ ' + parsed.username[0]);
            } else if (parsed.password) {
              setError('❌ ' + parsed.password[0]);
            } else if (parsed.detail) {
              setError('❌ ' + parsed.detail);
            } else {
              setError('❌ Ошибка регистрации');
            }
          } catch {
            setError('❌ ' + serverError);
          }
        } else {
          setError('❌ Ошибка регистрации');
        }
      }
    } catch (err) {
      console.error('❌ Ошибка:', err);
      setError('❌ Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">РЕГИСТРАЦИЯ</h1>
          <p className="auth-subtitle">
            Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
          </p>
        </div>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
            <button type="button" onClick={() => setError('')} className="error-close">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="auth-label" htmlFor="username">Имя пользователя *</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="username (только латиница)"
                className="auth-input"
                disabled={loading}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                pattern="[a-zA-Z0-9@./+\-_]+"
                title="Только буквы, цифры и @/./+/-/_"
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Только латиница, цифры и @/./+/-/_
              </small>
            </div>

            <div className="form-group">
              <label className="auth-label" htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="auth-input"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="auth-label" htmlFor="first_name">Имя</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Иван"
                className="auth-input"
                disabled={loading}
                autoComplete="given-name"
              />
            </div>

            <div className="form-group">
              <label className="auth-label" htmlFor="last_name">Фамилия</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Иванов"
                className="auth-input"
                disabled={loading}
                autoComplete="family-name"
              />
            </div>
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
                required
                placeholder="•••••••• (мин. 6 символов)"
                className="auth-input"
                style={{ paddingRight: '40px' }}
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
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
                }}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Мин. 6 символов, не только цифры
            </small>
          </div>

          <div className="form-group">
            <label className="auth-label" htmlFor="password_confirm">Подтверждение пароля *</label>
            <input
              id="password_confirm"
              type={showPassword ? 'text' : 'password'}
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="auth-input"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={loading} className="auth-btn" style={{ flex: 1 }}>
              {loading ? '⏳ Регистрация...' : '📝 Зарегистрироваться'}
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
            >
              🗑️
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Нажимая кнопку, вы соглашаетесь с условиями использования</p>
        </div>
      </div>
    </div>
  );
};

export default Register;