import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { 
  HeartIcon, 
  TrashIcon, 
  ShopIcon,
  BoxIcon 
} from '../components/Icons';
import './Wishlist.css';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/shop/wishlist/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      
      setWishlist(items);
      setError(null);
    } catch (error) {
      console.error('❌ Ошибка загрузки избранного:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/shop/wishlist/${wishlistId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok || response.status === 204) {
        setWishlist(prev => prev.filter(item => item.id !== wishlistId));
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty-premium animate-fade-in">
            <div className="empty-heart-icon"><HeartIcon size={80} /></div>
            <h1 className="empty-title-p">Доступ ограничен</h1>
            <p className="empty-text-p">Войдите в аккаунт, чтобы сохранять любимые товары в свой персональный вишлист.</p>
            <Link to="/login" className="btn btn-primary btn-lg">Войти в аккаунт</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container"><div className="loader"><div className="loader-spinner"></div></div></div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Header */}
        <div className="wishlist-header-premium">
          <h1 className="wishlist-title-premium">
            <span className="gradient-text">Wishlist</span>
            <HeartIcon size={48} className="text-accent" />
          </h1>
          <p className="wishlist-subtitle">{wishlist.length} Items saved</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty-premium animate-fade-in">
            <div className="empty-heart-icon"><BoxIcon size={80} /></div>
            <h2 className="empty-title-p">Список пуст</h2>
            <p className="empty-text-p">Вы еще не добавили ни одного товара. Начните исследовать наш каталог прямо сейчас!</p>
            <Link to="/shop" className="btn btn-primary">В каталог</Link>
          </div>
        ) : (
          <div className="wishlist-grid-premium">
            {wishlist.map((item) => {
              if (!item.product) return null;
              
              return (
                <div key={item.id} className="wishlist-item-wrapper">
                  <ProductCard product={item.product} />
                  
                  {/* Overlay Remove Button */}
                  <button 
                    className="wishlist-remove-premium"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Удалить"
                  >
                    <TrashIcon size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;