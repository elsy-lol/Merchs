import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.error || 'Неверные данные для входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-logo">👤</span>
          <h2 className="auth-title">Вход</h2>
          <p className="auth-subtitle">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
        {error && <div className="auth-error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="auth-input" 
              placeholder="your@email.com" 
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Пароль</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="auth-input" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;