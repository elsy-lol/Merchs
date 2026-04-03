// src/pages/ProductDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { shopAPI } from '../api/shop';
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
    
    console.log('🛒 Добавляем в корзину:', {
      product: product.id,
      variant: selectedVariant?.id || null,
      quantity: quantity  // ✅ Передаём выбранное количество!
    });
    
    // ✅ Добавляем с выбранным количеством
    addToCart(product, selectedVariant, quantity);
    
    // Анимация/уведомление
    setTimeout(() => {
      setAddingToCart(false);
      alert(`✅ Добавлено ${quantity} шт. в корзину!`);
    }, 300);
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
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <h1>❌ {error || 'Товар не найден'}</h1>
          <Link to="/shop" className="btn btn-primary">В каталог</Link>
        </div>
      </div>
    );
  }

  const productPrice = typeof product.price === 'number' 
    ? product.price 
    : parseFloat(product.price) || 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Галерея */}
        <div className="product-gallery">
          {product.images?.[0]?.image ? (
            <img src={product.images[0].image} alt={product.name} className="product-main-image" />
          ) : (
            <div className="product-no-image">📷</div>
          )}
        </div>

        {/* Информация */}
        <div className="product-info">
          <div className="product-badges">
            {product.product_type === 'second_hand' ? (
              <span className="badge badge-second-hand">♻️ Секонд</span>
            ) : (
              <span className="badge badge-official">🎤 Официальный</span>
            )}
            {product.is_negotiable && (
              <span className="badge badge-negotiable">💰 Торг</span>
            )}
          </div>

          <h1 className="product-title">{product.name}</h1>

          {product.creator && (
            <p className="product-creator">🎤 {product.creator.name}</p>
          )}

          <div className="product-price">{productPrice.toFixed(2)} ₽</div>

          <p className="product-description">{product.description || 'Описание отсутствует'}</p>

          {/* Выбор размера */}
          {product.variants && product.variants.length > 0 && (
            <div className="product-variants">
              <label className="variants-label">Выберите размер:</label>
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
              {selectedVariant && (
                <p className="variant-stock">
                  ✅ В наличии: {selectedVariant.stock} шт.
                </p>
              )}
            </div>
          )}

          {/* Выбор количества */}
          <div className="product-quantity">
            <label className="quantity-label">Количество:</label>
            <div className="quantity-controls">
              <button
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={addingToCart || (product.variants?.length > 0 && !selectedVariant)}
          >
            {addingToCart ? '⏳ Добавляю...' : '🛒 В корзину'}
          </button>

          {product.variants?.length > 0 && !selectedVariant && (
            <p className="warning-text">⚠️ Выберите размер перед добавлением</p>
          )}

          <Link to="/shop" className="back-to-shop">← Назад в каталог</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;