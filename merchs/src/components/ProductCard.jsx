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
        <span className={`product-card-badge ${isSecondHand ? 'product-card-badge-second' : 'product-card-badge-official'}`}>
          {isSecondHand ? 'Секонд' : 'Мерч'}
        </span>
        {isSecondHand && product.condition && (
          <span className="product-card-condition">
            {product.condition === 'excellent' ? 'Отл.' : product.condition === 'good' ? 'Хор.' : 'Б/У'}
          </span>
        )}
        <div className="product-card-actions">
          <button className="product-card-action-btn">❤️</button>
          <button className="product-card-action-btn">🔗</button>
        </div>
      </div>
      
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        {product.creator && <p className="product-card-creator">🎤 {product.creator.name}</p>}
        {isSecondHand && product.owner && <p className="product-card-owner">👤 {product.owner}</p>}
        <div className="product-card-price-row">
          <span className="product-card-price">{product.price} ₽</span>
          {product.is_negotiable && <span className="product-card-negotiable">💰 Торг</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;