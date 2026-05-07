// src/pages/Login.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LoginIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeOffIcon,
  LogoIcon,
  OfficialIcon
} from '../components/Icons';
import './Auth.css';

const initialFormData = {
  username: '',
  password: '',
};

const Login = () => {
  const { login, verifyLogin2FA, resend2FACode } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  // 2FA State
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorInfo, setTwoFactorInfo] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setError('');
    setSuccessMsg('');
    setShowPassword(false);
    setShow2FA(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        if (result.twoFactorRequired) {
          setShow2FA(true);
          setTwoFactorInfo(result);
          setTimer(60); // 1 minute cooldown
        } else {
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Критическая ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await verifyLogin2FA(twoFactorInfo.username, twoFactorCode);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка верификации');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      const result = await resend2FACode(twoFactorInfo.username);
      if (result.success) {
        setSuccessMsg('✅ Код отправлен повторно');
        setTimer(60);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка отправки');
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
          <h1 className="auth-title-p gradient-text">
            {show2FA ? 'Защита 2FA' : 'Авторизация'}
          </h1>
        </div>

        {error && (
          <div className="error-banner-p animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm mb-4 animate-fade-in text-center">
            {successMsg}
          </div>
        )}

        {!show2FA ? (
          <form onSubmit={handleSubmit} className="auth-form-p">
            <div className="input-group-p">
              <label className="label-p">Логин / Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Твой никнейм"
                className="auth-input-p"
                required
              />
            </div>

            <div className="input-group-p">
              <label className="label-p">Пароль</label>
              <div className="input-wrapper-p">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input-p"
                  required
                />
                <button type="button" className="eye-btn-p" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="auth-actions-p">
              <button type="submit" className="submit-btn-p" disabled={loading}>
                {loading ? 'Проверка...' : <><LoginIcon /> Войти</>}
              </button>
              <button type="button" className="reset-btn-p" onClick={handleClear} disabled={loading}>
                <TrashIcon />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="auth-form-p">
            <p className="text-center mb-6 opacity-70 text-sm">
              Код отправлен на вашу почту. Если письма нет, проверьте спам или запросите код повторно.
            </p>
            <div className="input-group-p">
              <label className="label-p">Код из письма</label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="auth-input-p text-center text-2xl tracking-widest"
                maxLength="6"
                required
                autoFocus
              />
            </div>

            <div className="auth-actions-p">
              <button type="submit" className="submit-btn-p" disabled={loading || twoFactorCode.length < 6}>
                {loading ? 'Входим...' : <><OfficialIcon /> Подтвердить</>}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button 
                type="button" 
                onClick={handleResend}
                disabled={timer > 0 || loading}
                className={`text-sm transition-all ${timer > 0 ? 'opacity-40 cursor-not-allowed' : 'text-accent hover:underline'}`}
              >
                {timer > 0 ? `Повторная отправка через ${timer}с` : 'Отправить код еще раз'}
              </button>
            </div>
            
            <button type="button" onClick={() => setShow2FA(false)} className="mt-4 w-full opacity-50 text-xs hover:opacity-100 transition-opacity">
              Вернуться назад
            </button>
          </form>
        )}

        <div className="auth-footer-p">
          <p className="text-xs opacity-40">Merch Market &copy; 2026. Secure Access.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;