import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import { ordersAPI } from '../api/orders';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);  // ✅ По умолчанию массив
  const [listings, setListings] = useState([]);  // ✅ По умолчанию массив
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем профиль
        const profileRes = await authAPI.getProfile().catch(() => ({ data: null }));
        if (profileRes?.data) {
          setProfile(profileRes.data);
        }

        // Загружаем заказы с обработкой пагинации
        const ordersRes = await ordersAPI.getOrders().catch(() => ({ data: { results: [] } }));
        const ordersData = ordersRes?.data?.results || ordersRes?.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);  // ✅ Гарантия массива

        // Загружаем товары с обработкой пагинации
        const listingsRes = await userAPI.getListings().catch(() => ({ data: { results: [] } }));
        const listingsData = listingsRes?.data?.results || listingsRes?.data || [];
        setListings(Array.isArray(listingsData) ? listingsData : []);  // ✅ Гарантия массива

      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="alert alert-error">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h1 className="profile-name">{profile?.username || 'Пользователь'}</h1>
            <p className="profile-email">{profile?.email || ''}</p>
            <span className="profile-role">
              {profile?.role === 'seller' ? '📦 Продавец' : 
               profile?.role === 'both' ? '🎤 Продавец и Покупатель' : '🛒 Покупатель'}
            </span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">{orders?.length || 0}</div>
            <div className="profile-stat-label">Заказов</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">{listings?.length || 0}</div>
            <div className="profile-stat-label">Товаров</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">{profile?.seller_rating || '0.0'}</div>
            <div className="profile-stat-label">Рейтинг</div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3 className="profile-section-title">📦 Заказы</h3>
          {!orders || orders.length === 0 ? (
            <p className="profile-empty">Пока нет заказов</p>
          ) : (
            <ul className="profile-section-list">
              {orders.slice(0, 5).map(order => (  // ✅ Теперь slice работает!
                <li key={order.id} className="profile-section-item">
                  <span className="profile-section-item-name">Заказ #{order.id}</span>
                  <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/orders" className="profile-section-link">Все заказы →</Link>
        </div>

        {(profile?.role === 'seller' || profile?.role === 'both') ? (
          <div className="profile-section">
            <h3 className="profile-section-title">🛍️ Мои товары</h3>
            {!listings || listings.length === 0 ? (
              <p className="profile-empty">Пока нет товаров</p>
            ) : (
              <ul className="profile-section-list">
                {listings.slice(0, 5).map(item => (  // ✅ Теперь slice работает!
                  <li key={item.id} className="profile-section-item">
                    <span className="profile-section-item-name">{item.name}</span>
                    <span className="profile-section-item-price">{item.price} ₽</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/seller" className="profile-section-link">Управление →</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;