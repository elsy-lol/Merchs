import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import { ordersAPI } from '../api/orders';
import { 
  UserIcon, 
  ShopIcon, 
  OfficialIcon, 
  StoreIcon, 
  BoxIcon,
  StarIcon,
  LogoutIcon 
} from '../components/Icons';
import './Profile.css';

const Profile = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes, listingsRes] = await Promise.all([
          authAPI.getProfile().catch(() => ({ data: null })),
          ordersAPI.getOrders().catch(() => ({ data: { results: [] } })),
          userAPI.getListings().catch(() => ({ data: { results: [] } }))
        ]);

        if (profileRes?.data) setProfile(profileRes.data);
        
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

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container"><div className="loader"><div className="loader-spinner"></div></div></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Hero Section */}
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
                  {profile?.role === 'seller' ? 'Seller' : profile?.role === 'both' ? 'Pro User' : 'Fan'}
                </span>
                <button onClick={logout} className="badge badge-danger cursor-pointer hover:scale-105 transition-transform">
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
              <div className="stat-label-mini">Объявлений</div>
            </div>
            <div className="stat-card-premium">
              <div className="stat-value-large">{profile?.seller_rating || '5.0'}</div>
              <div className="stat-label-mini">Рейтинг</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="profile-main-layout">
          {/* Orders Section */}
          <section className="dashboard-card animate-slide-up">
            <div className="card-header">
              <h2 className="card-title"><BoxIcon /> Последние заказы</h2>
              <Link to="/orders" className="btn-link text-accent">Все заказы →</Link>
            </div>
            
            <div className="premium-list">
              {orders.length === 0 ? (
                <div className="empty-state-mini">У вас пока нет заказов. Время что-нибудь купить!</div>
              ) : (
                orders.slice(0, 3).map(order => (
                  <div key={order.id} className="premium-list-item">
                    <div className="item-main-info">
                      <span className="item-title">Заказ #{order.id}</span>
                      <span className="item-sub">{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Seller Section (if applicable) */}
          {(profile?.role === 'seller' || profile?.role === 'both') && (
            <section className="dashboard-card animate-slide-up stagger-1">
              <div className="card-header">
                <h2 className="card-title"><StoreIcon /> Мои товары</h2>
                <Link to="/seller" className="btn-link text-accent">Управление →</Link>
              </div>
              
              <div className="premium-list">
                {listings.length === 0 ? (
                  <div className="empty-state-mini">У вас нет активных объявлений. Пора что-то выставить!</div>
                ) : (
                  listings.slice(0, 3).map(item => (
                    <div key={item.id} className="premium-list-item">
                      <div className="item-main-info">
                        <span className="item-title">{item.name}</span>
                        <span className="item-sub">{item.stock} в наличии</span>
                      </div>
                      <span className="item-price font-bold">{item.price.toLocaleString()} ₽</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Settings / Security (Bonus card for non-sellers) */}
          {profile?.role === 'buyer' && (
            <section className="dashboard-card animate-slide-up stagger-1">
              <div className="card-header">
                <h2 className="card-title"><OfficialIcon /> Безопасность</h2>
              </div>
              <div className="premium-list">
                <div className="premium-list-item">
                  <div className="item-main-info">
                    <span className="item-title">Сменить пароль</span>
                    <span className="item-sub">Защитите свой аккаунт</span>
                  </div>
                  <button className="btn-sm btn-outline">Обновить</button>
                </div>
                <div className="premium-list-item">
                  <div className="item-main-info">
                    <span className="item-title">Двухфакторная аутентификация</span>
                    <span className="item-sub">Дополнительный слой защиты</span>
                  </div>
                  <span className="badge badge-warning">Выключено</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;