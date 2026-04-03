import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
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
      console.log('📋 Загрузка избранного...');
      
      const response = await fetch('http://localhost:8000/api/shop/wishlist/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Статус ответа:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Сырые данные от API:', data);
      console.log('📦 Тип данных:', typeof data);
      console.log('📦 Это массив?', Array.isArray(data));
      
      // ✅ ПРАВИЛЬНАЯ обработка ответа (с пагинацией или без)
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.results)) {
        items = data.results;  // ✅ Если пагинация
      } else if (data && Array.isArray(data.items)) {
        items = data.items;  // ✅ Если другой формат
      }
      
      console.log('✅ Обработанные данные:', items);
      console.log('📦 Количество товаров:', items.length);
      
      // ✅ Проверяем, есть ли product в каждом элементе
      items.forEach((item, index) => {
        console.log(`📦 Товар ${index}:`, item);
        console.log(`📦 product:`, item.product);
      });
      
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
        console.log('🗑️ Удалено из избранного:', wishlistId);
        setWishlist(prev => prev.filter(item => item.id !== wishlistId));
      } else {
        console.error('❌ Ошибка удаления:', response.status);
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">❤️</div>
          <h1 className="wishlist-empty-title">Войдите, чтобы видеть избранное</h1>
          <p className="wishlist-empty-text">Сохраняйте товары, которые вам понравились</p>
          <Link to="/login" className="btn btn-primary">Войти</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">❌</div>
          <h2 className="wishlist-empty-title">Ошибка загрузки</h2>
          <p className="wishlist-empty-text">{error}</p>
          <button onClick={fetchWishlist} className="btn btn-primary">Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="wishlist-title">❤️ Избранное</h1>
        <p className="wishlist-count">{wishlist.length} товаров</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">💔</div>
          <h2 className="wishlist-empty-title">Пока пусто</h2>
          <p className="wishlist-empty-text">Добавляйте товары в избранное, чтобы не потерять их</p>
          <Link to="/shop" className="btn btn-primary">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => {
            console.log('🔍 Рендер элемента:', item);
            console.log('🔍 item.product:', item.product);
            
            // ✅ Проверяем, есть ли product
            if (!item.product) {
              console.warn('⚠️ Нет product в элементе!', item);
              return null;
            }
            
            return (
              <div key={item.id} className="wishlist-item">
                <ProductCard product={item.product} />
                <button 
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                  title="Удалить из избранного"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;