import { useEffect, useState } from 'react';
import { userAPI } from '../api/user';
import { shopAPI } from '../api/shop';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getListings().then(res => { setListings(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await fetch(`http://localhost:8000/api/shop/products/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } });
      setListings(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert('Ошибка удаления'); }
  };

  if (loading) return <div className="loader"><div className="loader-spinner"></div></div>;

  return (
    <div className="seller-dashboard">
      <h1 className="seller-dashboard-title">Панель продавца</h1>
      <div className="seller-stats">
        <div className="seller-stat-card"><div className="seller-stat-value">{listings.length}</div><div className="seller-stat-label">Товаров</div></div>
        <div className="seller-stat-card"><div className="seller-stat-value">{listings.filter(p => p.status === 'published').length}</div><div className="seller-stat-label">Опубликовано</div></div>
        <div className="seller-stat-card"><div className="seller-stat-value">{listings.filter(p => p.status === 'pending').length}</div><div className="seller-stat-label">На модерации</div></div>
        <div className="seller-stat-card"><div className="seller-stat-value">{listings.filter(p => p.status === 'sold').length}</div><div className="seller-stat-label">Продано</div></div>
      </div>
      <div className="seller-actions">
        <button className="seller-add-product-btn" onClick={() => alert('Форма добавления товара')}>+ Добавить товар</button>
      </div>
      <div className="seller-listings">
        <div className="seller-listings-header"><h3 className="seller-listings-title">Мои товары</h3></div>
        {listings.length === 0 ? <p className="profile-empty">Пока нет товаров</p> : (
          <table className="seller-listings-table">
            <thead><tr><th>Товар</th><th>Цена</th><th>Статус</th><th>Действия</th></tr></thead>
            <tbody>
              {listings.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} ₽</td>
                  <td><span className={`seller-status seller-status-${item.status}`}>{item.status === 'published' ? 'Опубликован' : item.status === 'pending' ? 'На модерации' : 'Продан'}</span></td>
                  <td className="seller-actions-cell">
                    <button className="seller-edit-btn" onClick={() => alert('Редактирование')}>✏️</button>
                    <button className="seller-delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;