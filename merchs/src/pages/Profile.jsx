// src/pages/Profile.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import { ordersAPI } from '../api/orders';
import { 
  UserIcon, 
  OfficialIcon, 
  StoreIcon, 
  BoxIcon,
  LogoutIcon,
  CheckIcon,
  ShieldIcon 
} from '../components/Icons';
import './Profile.css';

const Profile = () => {
  const { logout, resend2FACode } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Password Change State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Phone Binding State
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState('form'); // form, success
  const [phoneValue, setPhoneValue] = useState('');
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  // 2FA State
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState('choose'); // choose, verify, need-phone, success
  const [selected2FAMethod, setSelected2FAMethod] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [twoFactorSuccess, setTwoFactorSuccess] = useState('');
  const [isProcessing2FA, setIsProcessing2FA] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const fetchProfileData = async () => {
    try {
      const [profileRes, ordersRes, listingsRes] = await Promise.all([
        authAPI.getProfile().catch(() => ({ data: null })),
        ordersAPI.getOrders().catch(() => ({ data: { results: [] } })),
        userAPI.getListings().catch(() => ({ data: { results: [] } }))
      ]);

      if (profileRes?.data) {
        setProfile(profileRes.data);
        setPhoneValue(formatPhone(profileRes.data.phone || ''));
      }
      
      const ordersData = ordersRes?.data?.results || ordersRes?.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      const listingsData = listingsRes?.data?.results || listingsRes?.data || [];
      setListings(Array.isArray(listingsData) ? listingsData : []);

    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError('Не удалось загрузить данные профиля');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value) => {
    if (!value) return '';
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 2) return `+7`;
    if (phoneNumberLength < 5) return `+7 (${phoneNumber.slice(1, 4)}`;
    if (phoneNumberLength < 8) return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}`;
    if (phoneNumberLength < 10) return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}`;
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    setPhoneValue(formatPhone(e.target.value));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authAPI.changePassword(passwordForm);
      setIsPasswordModalOpen(false);
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
      // Можно тоже сделать в стиле сайта, но пока ограничимся телефоном и 2FA как запрошено
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Ошибка при смене пароля');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingPhone(true);
    try {
      await authAPI.updateProfile({ phone: phoneValue });
      setPhoneStep('success');
      fetchProfileData();
    } catch (err) {
      alert('Ошибка при обновлении телефона');
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  // ✅ 2FA Активация
  const handleStart2FA = async (method) => {
    if (method === 'sms' && !profile?.phone) {
      setTwoFactorStep('need-phone');
      return;
    }
    setSelected2FAMethod(method);
    setTwoFactorStep('verify');
    setTwoFactorError('');
    setResendTimer(60);
    try {
      await authAPI.toggle2FA({ method });
    } catch (err) {
      setTwoFactorError('Ошибка отправки кода');
    }
  };

  const handleResendInProfile = async () => {
    if (resendTimer > 0) return;
    setIsProcessing2FA(true);
    try {
      const result = await resend2FACode();
      if (result.success) {
        setTwoFactorSuccess('Код отправлен повторно');
        setResendTimer(60);
        setTimeout(() => setTwoFactorSuccess(''), 3000);
      }
    } catch (err) {
      setTwoFactorError('Ошибка при переотправке');
    } finally {
      setIsProcessing2FA(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setIsProcessing2FA(true);
    setTwoFactorError('');
    try {
      await authAPI.verify2FA({ code: twoFactorCode, method: selected2FAMethod });
      setTwoFactorStep('success');
      fetchProfileData();
    } catch (err) {
      setTwoFactorError('Неверный код подтверждения');
    } finally {
      setIsProcessing2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Вы уверены, что хотите отключить защиту?')) return;
    try {
      await authAPI.toggle2FA({ method: 'none' });
      fetchProfileData();
    } catch (err) {
      alert('Ошибка при отключении');
    }
  };

  if (loading) {
    return <div className="profile-page"><div className="container"><div className="loader"></div></div></div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header-premium animate-fade-in">
          <div className="profile-user-info">
            <div className="profile-avatar-large">
              {profile?.username?.charAt(0).toUpperCase() || <UserIcon />}
            </div>
            <div className="profile-meta">
              <h1 className="gradient-text">{profile?.username || 'Пользователь'}</h1>
              <p>{profile?.email}</p>
              <div className="profile-badges-wrap">
                <span className="badge badge-primary">
                  {profile?.role === 'seller' ? 'Продавец' : profile?.role === 'both' ? 'Про-Юзер' : 'Покупатель'}
                </span>
                <button onClick={logout} className="badge badge-danger cursor-pointer">
                  <LogoutIcon /> Выйти
                </button>
              </div>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="stat-card-premium">
              <div className="stat-value-large">{orders.length}</div>
              <div className="stat-label-mini">Заказов</div>
            </div>
            <div className="stat-card-premium">
              <div className="stat-value-large">{listings.length}</div>
              <div className="stat-label-mini">Товаров</div>
            </div>
            <div className="stat-card-premium">
              <div className="stat-value-large">{profile?.seller_rating || '5.0'}</div>
              <div className="stat-label-mini">Рейтинг</div>
            </div>
          </div>
        </div>

        <div className="profile-main-layout">
          <section className="dashboard-card orders-card animate-slide-up">
            <div className="card-header">
              <h2 className="card-title"><BoxIcon /> Заказы</h2>
              <Link to="/orders" className="btn-link text-accent">Все →</Link>
            </div>
            <div className="premium-list">
              {orders.length === 0 ? (
                <div className="empty-state-mini">У вас еще нет заказов</div>
              ) : (
                orders.slice(0, 3).map(order => (
                  <div key={order.id} className="premium-list-item order-item">
                    <div className="item-main-info">
                      <span className="item-title">Заказ #{order.id}</span>
                      <span className="item-sub">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status === 'delivered' ? 'Доставлен' : 'В обработке'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Security & Settings */}
          <section className="dashboard-card security-card animate-slide-up stagger-1">
            <div className="card-header">
              <h2 className="card-title"><OfficialIcon /> Безопасность и аккаунт</h2>
            </div>
            <div className="premium-list">
              <div className="premium-list-item security-item">
                <div className="item-main-info">
                  <span className="item-title">Телефон</span>
                  <span className="item-sub">{profile?.phone || 'Номер не привязан'}</span>
                </div>
                <button onClick={() => { setIsPhoneModalOpen(true); setPhoneStep('form'); }} className="btn-sm btn-outline">
                  {profile?.phone ? 'Изменить' : 'Привязать'}
                </button>
              </div>
              <div className="premium-list-item security-item">
                <div className="item-main-info">
                  <span className="item-title">Пароль</span>
                  <span className="item-sub">Последнее обновление: недавно</span>
                </div>
                <button onClick={() => setIsPasswordModalOpen(true)} className="btn-sm btn-outline">Обновить</button>
              </div>
              <div className="premium-list-item security-item">
                <div className="item-main-info">
                  <span className="item-title">Двухфакторная защита (2FA)</span>
                  <span className="item-sub">
                    {profile?.is_2fa_enabled ? `Активна (${profile?.two_factor_method === 'email' ? 'Email' : 'SMS'})` : 'Дополнительная защита'}
                  </span>
                </div>
                {profile?.is_2fa_enabled ? (
                  <button onClick={handleDisable2FA} className="badge badge-danger cursor-pointer">Отключить</button>
                ) : (
                  <button onClick={() => { setIs2FAModalOpen(true); setTwoFactorStep('choose'); }} className="badge badge-warning cursor-pointer">Активировать</button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Phone Modal */}
      {isPhoneModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-premium animate-fade-in">
            {phoneStep === 'form' ? (
              <>
                <h2 className="modal-title">Привязка телефона</h2>
                <form onSubmit={handlePhoneSubmit} className="modal-form">
                  <div className="modal-input-group">
                    <label>Номер (РФ)</label>
                    <input type="tel" className="modal-input" required placeholder="+7 (___) ___-__-__"
                      value={phoneValue} onChange={handlePhoneChange} />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setIsPhoneModalOpen(false)} className="modal-btn btn-cancel">Отмена</button>
                    <button type="submit" className="modal-btn btn-confirm" disabled={isUpdatingPhone || phoneValue.length < 18}>Сохранить</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#10b981' }}>
                  <CheckIcon size={80} />
                </div>
                <h2 className="modal-title mb-2">Готово!</h2>
                <p className="opacity-70 mb-8">Номер телефона успешно привязан к вашему аккаунту.</p>
                <button onClick={() => setIsPhoneModalOpen(false)} className="modal-btn btn-confirm w-full">Отлично</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA Activation Modal */}
      {is2FAModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-premium animate-fade-in">
            {twoFactorStep === 'choose' && (
              <div className="modal-form">
                <h2 className="modal-title">Активация 2FA</h2>
                <p className="text-center opacity-70 mb-6 text-sm">Выберите способ получения кода:</p>
                <div className="flex flex-col gap-4">
                  <button onClick={() => handleStart2FA('email')} className="modal-btn btn-cancel hover:border-accent">📧 Электронная почта</button>
                  <button onClick={() => handleStart2FA('sms')} className="modal-btn btn-cancel hover:border-accent">📱 SMS на телефон</button>
                </div>
                <button onClick={() => setIs2FAModalOpen(false)} className="mt-6 opacity-40 text-xs">Отмена</button>
              </div>
            )}

            {twoFactorStep === 'verify' && (
              <form onSubmit={handleVerify2FA} className="modal-form">
                <h2 className="modal-title">Подтверждение</h2>
                <p className="text-center opacity-70 text-sm mb-6">Код отправлен на почту {profile?.email}</p>
                <div className="modal-input-group">
                  <input type="text" className="modal-input text-center text-3xl tracking-[10px]" maxLength="6"
                    required autoFocus value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                </div>
                {twoFactorError && <p className="modal-error text-center mt-2">❌ {twoFactorError}</p>}
                <div className="modal-actions mt-8">
                  <button type="submit" className="modal-btn btn-confirm w-full" disabled={isProcessing2FA || twoFactorCode.length < 6}>Подтвердить</button>
                </div>
                <button type="button" onClick={() => setTwoFactorStep('choose')} className="mt-4 opacity-40 text-xs w-full">Назад</button>
              </form>
            )}

            {twoFactorStep === 'success' && (
              <div className="text-center py-8">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-pink)' }}>
                  <ShieldIcon />
                </div>
                <h2 className="modal-title mb-2">Защита включена!</h2>
                <p className="opacity-70 mb-8">Теперь ваш аккаунт под надежной двухфакторной защитой.</p>
                <button onClick={() => setIs2FAModalOpen(false)} className="modal-btn btn-confirm w-full">Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-premium animate-fade-in">
            <h2 className="modal-title">Смена пароля</h2>
            <form onSubmit={handlePasswordSubmit} className="modal-form">
              <div className="modal-input-group">
                <label>Текущий пароль</label>
                <input type="password" name="old_password" className="modal-input" required 
                  value={passwordForm.old_password} onChange={(e) => setPasswordForm({...passwordForm, old_password: e.target.value})} />
              </div>
              <div className="modal-input-group">
                <label>Новый пароль</label>
                <input type="password" name="new_password" className="modal-input" required 
                  value={passwordForm.new_password} onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})} />
              </div>
              <div className="modal-input-group">
                <label>Повторите новый пароль</label>
                <input type="password" name="new_password_confirm" className="modal-input" required 
                  value={passwordForm.new_password_confirm} onChange={(e) => setPasswordForm({...passwordForm, new_password_confirm: e.target.value})} />
              </div>
              {passwordError && <p className="modal-error">❌ {passwordError}</p>}
              <div className="modal-actions">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="modal-btn btn-cancel">Отмена</button>
                <button type="submit" className="modal-btn btn-confirm" disabled={isChangingPassword}>Обновить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;