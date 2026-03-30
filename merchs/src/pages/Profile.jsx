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
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    authAPI.getProfile().then(res => setProfile(res.data));
    ordersAPI.getOrders().then(res => setOrders(res.data));
    userAPI.getListings().then(res => setListings(res.data));
  }, []);

  if (!profile) return <div className="loader"><div className="loader-spinner"></div></div>;

  return (
    <div className="profile-page">
      <h1 className="profile-title">Профиль</h1>
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h2 className="profile-name">{profile.username}</h2>
            <p className="profile-email">{profile.email}</p>
            <span className="profile-role">{profile.role === 'seller' ? 'Продавец' : 'Покупатель'}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-stat"><div className="profile-stat-value">{orders.length}</div><div className="profile-stat-label">Заказов</div></div>
          <div className="profile-stat"><div className="profile-stat-value">{listings.length}</div><div className="profile-stat-label">Товаров</div></div>
          <div className="profile-stat"><div className="profile-stat-value">{profile.seller_rating || 0}</div><div className="profile-stat-label">Рейтинг</div></div>
        </div>
      </div>
      <div className="profile-sections">
        <div className="profile-section">
          <h3 className="profile-section-title">Мои заказы</h3>
          {orders.length === 0 ? <p className="profile-empty">Пока нет заказов</p> : (
            <ul className="profile-section-list">
              {orders.slice(0, 5).map(order => (
                <li key={order.id} className="profile-section-item">
                  <span className="profile-section-item-name">Заказ #{order.id}</span>
                  <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>{order.status}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/orders" className="profile-section-link">Все заказы →</Link>
        </div>
        {profile.role === 'seller' && (
          <div className="profile-section">
            <h3 className="profile-section-title">Мои объявления</h3>
            {listings.length === 0 ? <p className="profile-empty">Пока нет товаров</p> : (
              <ul className="profile-section-list">
                {listings.slice(0, 5).map(item => (
                  <li key={item.id} className="profile-section-item">
                    <span className="profile-section-item-name">{item.name}</span>
                    <span className="profile-section-item-price">{item.price} ₽</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/seller" className="profile-section-link">Управление →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;