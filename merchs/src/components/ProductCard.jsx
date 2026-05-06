import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon, 
  RecycleIcon, 
  OfficialIcon, 
  BoxIcon, 
  StarIcon 
} from './Icons';
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
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
          }
        }
      } else {
        const response = await fetch('http://localhost:8000/api/shop/wishlist/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });
        
        if (response.ok) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('❌ Ошибка избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSecondHand = product.product_type === 'second_hand';

  return (
    <Link to={`/product/${product.id}`} className="product-card animate-fade-in">
      <div className="product-card-image-wrap">
        {/* Badge */}
        <div className={`card-badge-p ${isSecondHand ? 'badge-second-hand' : 'badge-merch'}`}>
          {isSecondHand ? <RecycleIcon size={14} /> : <OfficialIcon size={14} />}
          {isSecondHand ? 'Second Hand' : 'Drop'}
        </div>

        {/* Favorite Button */}
        <button 
          className={`fav-btn-p ${isFavorite ? 'active' : ''} ${loading ? 'loading' : ''}`}
          onClick={toggleFavorite}
          disabled={loading}
        >
          <HeartIcon size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Product Image */}
        {product.images?.[0]?.image ? (
          <img src={product.images[0].image} alt={product.name} loading="lazy" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            <BoxIcon size={60} opacity={0.2} />
          </div>
        )}

        {/* Quick Buy Overlay */}
        <div className="card-quick-buy">
          Посмотреть детали
        </div>
      </div>
      
      <div className="product-card-details">
        <h3 className="card-title-p">{product.name}</h3>
        
        {product.creator && (
          <div className="card-creator-p">
            <StarIcon size={14} className="text-accent" />
            {product.creator.name}
          </div>
        )}
        
        <div className="card-price-row-p">
          <span className="card-price-p">{parseFloat(product.price).toLocaleString()} ₽</span>
          {product.is_negotiable && (
            <span className="card-negotiable-badge">Торг</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;