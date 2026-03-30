import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopAPI } from '../api/shop';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    shopAPI.getProduct(id)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity, selectedVariant);
    alert('✨ Добавлено в корзину!');
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (!product) return <div className="container text-center mt-8">Товар не найден</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-grid">
        <div className="product-detail-images">
          <div className="product-detail-main-image">
            {product.images?.[0]?.image ? (
              <img src={product.images[0].image} alt={product.name} />
            ) : <div className="product-detail-no-image">📷</div>}
          </div>
          {product.images?.length > 1 && (
            <div className="product-detail-thumbnails">
              {product.images.map((img, idx) => (
                <div key={idx} className="product-detail-thumbnail">
                  <img src={img.image} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className={`product-detail-type ${product.product_type === 'official' ? 'product-detail-type-official' : 'product-detail-type-second'}`}>
            {product.product_type === 'official' ? '🎤 Официальный мерч' : '♻️ Секонд-хенд'}
          </span>
          <h1 className="product-detail-name">{product.name}</h1>
          {product.creator && <p className="product-detail-creator">🎤 {product.creator.name}</p>}
          <div className="product-detail-price">{product.price} ₽</div>
          {product.condition && <p className="product-detail-condition">Состояние: {product.condition === 'excellent' ? 'Отличное ⭐' : product.condition === 'good' ? 'Хорошее 👍' : 'Б/У'}</p>}
          <p className="product-detail-description">{product.description}</p>

          {product.variants?.length > 0 && (
            <div className="product-detail-variants">
              <label className="product-detail-variants-title">Размер</label>
              <div className="product-detail-variants-list">
                {product.variants.map(variant => (
                  <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={`product-detail-variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}>{variant.size}</button>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-quantity">
            <label className="product-detail-quantity-title">Количество</label>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="product-detail-quantity-input" />
          </div>

          <div className="product-detail-actions">
            <button onClick={handleAddToCart} className="product-detail-add-to-cart">🛒 В корзину</button>
            <button className="product-detail-favorite">❤️</button>
          </div>

          <div className="product-detail-meta">
            <div className="product-detail-meta-item"><span className="product-detail-meta-label">Категория:</span><span className="product-detail-meta-value">{product.category_name}</span></div>
            <div className="product-detail-meta-item"><span className="product-detail-meta-label">Добавлен:</span><span className="product-detail-meta-value">{new Date(product.created_at).toLocaleDateString()}</span></div>
            <div className="product-detail-meta-item"><span className="product-detail-meta-label">Просмотры:</span><span className="product-detail-meta-value">👁️ {product.views}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;