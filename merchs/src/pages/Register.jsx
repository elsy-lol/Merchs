// src/pages/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  RegisterIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeOffIcon,
  LogoIcon 
} from '../components/Icons';
import './Auth.css';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  password_confirm: '',
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
    if (!formData.username || !formData.email || !formData.password) return '❌ Заполните все обязательные поля';
    if (formData.password !== formData.password_confirm) return '❌ Пароли не совпадают';
    if (formData.password.length < 6) return '❌ Пароль слишком короткий (мин. 6 символов)';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        // ✅ ТЕПЕРЬ СРАЗУ НА ГЛАВНУЮ (так как AuthContext сохранил сессию)
        navigate('/');
      } else {
        setError(result.error || 'Ошибка при регистрации');
      }
    } catch (err) {
      setError('Соединение с сервером разорвано');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container-premium">
        <div className="auth-header-p">
          <div className="flex justify-center mb-6 text-accent">
            <LogoIcon />
          </div>
          <h1 className="auth-title-p gradient-text">Создать Аккаунт</h1>
          <p className="auth-subtitle-p">
            Уже есть аккаунт? <Link to="/login" className="auth-link-p">Войти</Link>
          </p>
        </div>

        {error && (
          <div className="error-banner-p">
            <span>{error}</span>
            <button onClick={() => setError('')} className="bg-none border-none text-inherit cursor-pointer">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-p">
          <div className="input-group-p">
            <label className="label-p">Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Уникальный никнейм"
              className="auth-input-p"
              disabled={loading}
            />
          </div>

          <div className="input-group-p">
            <label className="label-p">Электронная Почта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="auth-input-p"
              disabled={loading}
            />
          </div>

          <div className="input-group-p">
            <label className="label-p">Секретный Ключ (Пароль)</label>
            <div className="input-wrapper-p">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Придумайте сложный пароль"
                className="auth-input-p"
                disabled={loading}
              />
              <button type="button" className="eye-btn-p" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="input-group-p">
            <label className="label-p">Подтверждение Ключа</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Повторите ваш пароль"
              className="auth-input-p"
              disabled={loading}
            />
          </div>

          <div className="auth-actions-p">
            <button 
              type="submit" 
              className="submit-btn-p"
              disabled={loading}
            >
              {loading ? 'Создание...' : <><RegisterIcon /> Зарегистрироваться</>}
            </button>
            <button 
              type="button" 
              className="reset-btn-p"
              onClick={handleClear}
              disabled={loading}
            >
              <TrashIcon />
            </button>
          </div>
        </form>

        <div className="auth-footer-p">
          <p className="text-xs opacity-50">Присоединяясь, вы соглашаетесь с условиями дропов.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;