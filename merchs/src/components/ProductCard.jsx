import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkIfFavorite();
    } else {
      setIsFavorite(false);
    }
  }, [isAuthenticated, product.id]);

  const checkIfFavorite = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/shop/wishlist/?product_id=${product.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Проверка избранного:', data);
        setIsFavorite(Array.isArray(data) && data.length > 0);
      }
    } catch (error) {
      console.error('❌ Ошибка проверки избранного:', error);
    }
  };

  const toggleFavorite = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!isAuthenticated) {
    alert('❤️ Войдите, чтобы добавлять в избранное!');
    window.location.href = '/login';
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('access_token');
    
    if (isFavorite) {
      // Удаляем
      const wishlistRes = await fetch(`http://localhost:8000/api/shop/wishlist/?product_id=${product.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        if (wishlistData.length > 0) {
          await fetch(`http://localhost:8000/api/shop/wishlist/${wishlistData[0].id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          setIsFavorite(false);
          console.log('❌ Удалено из избранного');
        }
      }
    } else {
      // Добавляем
      const response = await fetch('http://localhost:8000/api/shop/wishlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });
      
      // ✅ Принимаем и 200, и 201 статусы
      if (response.ok) {
        setIsFavorite(true);
        console.log('✅ Добавлено в избранное');
      } else {
        const error = await response.json();
        console.error('❌ Ошибка:', error);
        alert('❌ Не удалось добавить: ' + (error.detail || 'Неизвестная ошибка'));
      }
    }
  } catch (error) {
    console.error('❌ Исключение:', error);
    alert('❌ Произошла ошибка');
  } finally {
    setLoading(false);
  }
};

  const isSecondHand = product.product_type === 'second_hand';
  
  const conditionLabels = {
    'excellent': 'Отл.',
    'good': 'Хор.',
    'fair': 'Б/У',
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.images?.[0]?.image ? (
          <img src={product.images[0].image} alt={product.name} />
        ) : (
          <div className="product-card-no-image">📷</div>
        )}
        
        <span className="product-card-badge">
          {isSecondHand ? '♻️ Секонд' : '🎤 Мерч'}
        </span>
        
        {isSecondHand && product.condition && (
          <span className="product-card-condition">
            {conditionLabels[product.condition]}
          </span>
        )}
        
        <button 
          className={`product-card-favorite ${isFavorite ? 'active' : ''} ${loading ? 'loading' : ''}`}
          onClick={toggleFavorite}
          disabled={loading}
          title={isFavorite ? 'Удалить из избранного' : 'В избранное'}
        >
          {loading ? '⏳' : isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        {product.creator && <p className="product-card-creator">🎤 {product.creator.name}</p>}
        <div className="product-card-price-row">
          <span className="product-card-price">{product.price} ₽</span>
          {product.is_negotiable && <span className="product-card-negotiable">💰 Торг</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;