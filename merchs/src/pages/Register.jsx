import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password_confirm: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.password_confirm) { setError('Пароли не совпадают'); return; }
    setLoading(true);
    try {
      await register(formData);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🚀</div>
          <h2 className="auth-title gradient-text">Регистрация</h2>
          <p className="auth-subtitle">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
        {error && <div className="auth-error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-grid">
            <div className="auth-form-group">
              <label className="auth-label">Имя</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="auth-input" placeholder="Иван" />
            </div>
            <div className="auth-form-group">
              <label className="auth-label">Фамилия</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="auth-input" placeholder="Иванов" />
            </div>
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Имя пользователя</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="auth-input" placeholder="username" />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="auth-input" placeholder="your@email.com" />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Пароль</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="auth-input" placeholder="••••••••" />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Подтверждение пароля</label>
            <input type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required minLength={8} className="auth-input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="auth-submit btn btn-primary">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;