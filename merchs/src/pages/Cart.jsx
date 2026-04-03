// src/pages/Cart.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total, itemCount, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [removingKey, setRemovingKey] = useState(null);

  // ✅ Безопасное преобразование цены
  const getPrice = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    return parseFloat(value) || 0;
  };

  // ✅ Уникальный ключ для товара (используется везде одинаково)
  const getItemKey = (item) => {
    const pid = item.product?.id;
    const vid = item.variant?.id;
    return vid ? `p${pid}-v${vid}` : `p${pid}`;
  };

  // Удаление товара
  const handleRemoveItem = (item) => {
    const key = getItemKey(item);
    console.log('🗑️ Удаляем:', { key, product: item.product?.id, variant: item.variant?.id });
    setRemovingKey(key);
    removeFromCart(item.product?.id, item.variant?.id);
    setTimeout(() => setRemovingKey(null), 300);
  };

  // ✅ Изменение количества — ПРОСТАЯ ВЕРСИЯ
  const handleQuantityChange = (item, newQuantity) => {
    const productId = item.product?.id;
    const variantId = item.variant?.id;  // Может быть undefined
    const key = getItemKey(item);
    
    console.log('🔢 Меняем количество:', { key, productId, variantId, newQuantity });
    
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    
    // ✅ Вызываем updateQuantity с теми же параметрами, что и в getItemKey
    updateQuantity(productId, variantId, newQuantity);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h1>Корзина пуста</h1>
          <p>Добавьте товары, чтобы оформить заказ</p>
          <Link to="/shop" className="btn btn-primary btn-lg">В каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">🛒 Корзина</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Товар</span>
              <span>Количество</span>
              <span>Цена</span>
              <span>Итого</span>
              <span></span>
            </div>
            
            {cart.map((item, index) => {
              const itemKey = getItemKey(item);
              const isRemoving = removingKey === itemKey;
              const productPrice = getPrice(item.product?.price);
              const quantity = item.quantity || 1;
              const itemTotal = productPrice * quantity;
              
              return (
                <div 
                  key={itemKey} 
                  className={`cart-item ${isRemoving ? 'removing' : ''}`}
                >
                  <div className="cart-item-product">
                    {item.product?.images?.[0]?.image ? (
                      <img src={item.product.images[0].image} alt={item.product.name} className="cart-item-image" />
                    ) : (
                      <div className="cart-item-no-image">📷</div>
                    )}
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.product?.name}</h3>
                      {item.variant && <p className="cart-item-variant">Размер: {item.variant.size}</p>}
                      {item.product?.product_type === 'second_hand' && (
                        <span className="cart-item-badge">♻️ Секонд</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button 
                      type="button"  // ✅ Важно: type="button" чтобы не сабмитить форму
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      type="button"
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item-price">{productPrice.toFixed(2)} ₽</div>
                  <div className="cart-item-total">{itemTotal.toFixed(2)} ₽</div>
                  
                  <button 
                    type="button"
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? '⏳' : '🗑️'}
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="cart-summary">
            <h2 className="cart-summary-title">📦 Итого</h2>
            <div className="cart-summary-row">
              <span>Товаров:</span>
              <span>{itemCount} шт.</span>
            </div>
            <div className="cart-summary-row">
              <span>Итого:</span>
              <span className="total-amount">{getPrice(total).toFixed(2)} ₽</span>
            </div>
            <div className="cart-summary-actions">
              <button onClick={clearCart} className="btn btn-secondary btn-block">🗑️ Очистить</button>
              <Link to="/checkout" className="btn btn-primary btn-block btn-lg">💳 Оформить</Link>
            </div>
            <Link to="/shop" className="cart-continue-shopping">← В каталог</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;