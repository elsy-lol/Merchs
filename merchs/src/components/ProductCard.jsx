import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const isSecondHand = product.product_type === 'second_hand';
  
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.images?.[0]?.image ? (
          <img src={product.images[0].image} alt={product.name} />
        ) : (
          <div className="product-card-no-image">📷</div>
        )}
        <div className="product-card-overlay"></div>
        <span className="product-card-badge">
          {isSecondHand ? '♻️ Секонд' : '🎤 Мерч'}
        </span>
        {isSecondHand && product.condition && (
          <span className="product-card-condition">
            {product.condition === 'excellent' ? 'Отл.' : product.condition === 'good' ? 'Хор.' : 'Б/У'}
          </span>
        )}
        <div className="product-card-actions">
          <button className="product-card-action-btn" title="В избранное">❤️</button>
          <button className="product-card-action-btn" title="Поделиться">🔗</button>
        </div>
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