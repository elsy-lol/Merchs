// src/pages/ProductDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { shopAPI } from '../api/shop';
import { 
  RecycleIcon, 
  OfficialIcon, 
  ShieldIcon, 
  BoxIcon, 
  StarIcon,
  ArrowLeft 
} from '../components/Icons';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await shopAPI.getProduct(id);
        setProduct(response.data);
      } catch (err) {
        console.error('❌ Ошибка загрузки товара:', err);
        setError('Товар не найден');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setAddingToCart(true);
    addToCart(product, selectedVariant, quantity);
    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      return newQty < 1 ? 1 : newQty;
    });
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loader">
            <div className="loader-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-container">
            <h1 className="gradient-text">❌ {error || 'Товар не найден'}</h1>
            <Link to="/shop" className="btn btn-primary mt-4">В каталог</Link>
          </div>
        </div>
      </div>
    );
  }

  const productPrice = typeof product.price === 'number' 
    ? product.price 
    : parseFloat(product.price) || 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumbs / Back Link */}
        <Link to="/shop" className="back-link mb-8 inline-flex items-center gap-2 text-muted hover:text-primary">
          <ArrowLeft /> Назад в каталог
        </Link>

        <div className="product-detail-container">
          {/* Left: Gallery */}
          <div className="product-gallery">
            <div className="product-main-image-wrap animate-fade-in">
              {product.images?.[0]?.image ? (
                <img src={product.images[0].image} alt={product.name} className="product-main-image" />
              ) : (
                <div className="product-no-image"><BoxIcon size={80} /></div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info animate-slide-up">
            <div className="product-badges">
              {product.product_type === 'second_hand' ? (
                <span className="badge badge-purple"><RecycleIcon /> Second Hand</span>
              ) : (
                <span className="badge badge-primary"><OfficialIcon /> Official Merch</span>
              )}
              {product.is_negotiable && (
                <span className="badge badge-success">💰 Торг возможен</span>
              )}
            </div>

            <h1 className="product-title">{product.name}</h1>

            {product.creator && (
              <Link to={`/shop/creator/${product.creator.id}`} className="product-creator-link">
                <div className="creator-avatar-mini">
                  {product.creator.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-muted uppercase">Создатель</div>
                  <div className="font-bold">{product.creator.name}</div>
                </div>
              </Link>
            )}

            <div className="product-price-large gradient-text">
              {productPrice.toLocaleString()} ₽
            </div>

            <p className="product-description">
              {product.description || 'Этот товар пока не имеет подробного описания, но мы гарантируем его качество и аутентичность.'}
            </p>

            <div className="divider"></div>

            {/* Selection Area */}
            {product.variants && product.variants.length > 0 && (
              <div className="product-variants">
                <label className="variants-label">Размер</label>
                <div className="variants-grid">
                  {product.variants
                    .filter(v => v.stock > 0)
                    .map(variant => (
                      <button
                        key={variant.id}
                        type="button"
                        className={`variant-btn ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.size}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="product-actions-group">
              <div className="quantity-selector">
                <button 
                  className="qty-btn" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >−</button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => handleQuantityChange(1)}
                >+</button>
              </div>

              <button
                type="button"
                className="add-to-cart-premium"
                onClick={handleAddToCart}
                disabled={addingToCart || (product.variants?.length > 0 && !selectedVariant)}
              >
                {addingToCart ? '⏳ Добавляем...' : '🛒 В корзину'}
              </button>
            </div>

            {product.variants?.length > 0 && !selectedVariant && (
              <p className="text-danger text-sm font-bold mt-2">
                ⚠️ Пожалуйста, выберите размер перед покупкой
              </p>
            )}

            {/* Trust Badges Area */}
            <div className="trust-badges-grid">
              <div className="trust-item">
                <div className="trust-icon"><ShieldIcon /></div>
                <div className="trust-label">Оригинал</div>
              </div>
              <div className="trust-item">
                <div className="trust-icon"><StarIcon /></div>
                <div className="trust-label">Качество</div>
              </div>
              <div className="trust-item">
                <div className="trust-icon"><BoxIcon /></div>
                <div className="trust-label">Доставка</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;