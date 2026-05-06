// src/pages/Cart.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { 
  ShopIcon, 
  RecycleIcon, 
  TrashIcon, 
  ClearIcon, 
  CheckoutIcon,
  BoxIcon,
  ArrowLeft 
} from '../components/Icons';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total, itemCount, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [removingKey, setRemovingKey] = useState(null);

  const getPrice = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    return parseFloat(value) || 0;
  };

  const getItemKey = (item) => {
    const pid = item.product?.id;
    const vid = item.variant?.id;
    return vid ? `p${pid}-v${vid}` : `p${pid}`;
  };

  const handleRemoveItem = (item) => {
    const key = getItemKey(item);
    setRemovingKey(key);
    setTimeout(() => {
      removeFromCart(item.product?.id, item.variant?.id);
      setRemovingKey(null);
    }, 300);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    updateQuantity(item.product?.id, item.variant?.id, newQuantity);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-premium animate-fade-in">
            <div className="empty-icon-wrap">
              <BoxIcon size={64} />
            </div>
            <h1 className="gradient-text">Корзина пуста</h1>
            <p>Вы пока ничего не добавили в свою коллекцию.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">Начать покупки</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title mb-12 animate-fade-in">
          <span className="gradient-text">Корзина</span>
          <span className="text-muted text-sm ml-4 uppercase tracking-widest">{itemCount} Тов.</span>
        </h1>

        <div className="cart-container-premium">
          {/* Left: Items List */}
          <div className="cart-items-wrap animate-slide-up">
            {cart.map((item) => {
              const itemKey = getItemKey(item);
              const isRemoving = removingKey === itemKey;
              const productPrice = getPrice(item.product?.price);
              const quantity = item.quantity || 1;
              const itemTotal = productPrice * quantity;
              
              return (
                <div 
                  key={itemKey} 
                  className={`cart-item-premium ${isRemoving ? 'removing' : ''}`}
                >
                  <div className="cart-img-wrap">
                    {item.product?.images?.[0]?.image ? (
                      <img src={item.product.images[0].image} alt={item.product.name} />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-tertiary text-muted">
                        <BoxIcon size={40} />
                      </div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name-premium">{item.product?.name}</h3>
                    <div className="flex gap-2 items-center">
                      {item.variant && <span className="item-variant-label">Size: {item.variant.size}</span>}
                      {item.product?.product_type === 'second_hand' && (
                        <span className="badge badge-purple text-xs"><RecycleIcon /> Second Hand</span>
                      )}
                    </div>
                    {item.product?.creator && (
                      <span className="text-xs font-bold text-muted uppercase">By {item.product.creator.name}</span>
                    )}
                  </div>
                  
                  <div className="quantity-control-p">
                    <button 
                      className="q-btn"
                      onClick={() => handleQuantityChange(item, quantity - 1)}
                    >−</button>
                    <span className="font-bold">{quantity}</span>
                    <button 
                      className="q-btn"
                      onClick={() => handleQuantityChange(item, quantity + 1)}
                    >+</button>
                  </div>
                  
                  <div className="item-total-p">
                    {itemTotal.toLocaleString()} ₽
                  </div>
                  
                  <button 
                    className="remove-btn-p"
                    onClick={() => handleRemoveItem(item)}
                    title="Удалить"
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Summary Card */}
          <div className="cart-summary-premium animate-slide-right">
            <h2 className="summary-title">Итого</h2>
            
            <div className="summary-row">
              <span>Количество</span>
              <span>{itemCount} шт.</span>
            </div>
            
            <div className="summary-row">
              <span>Доставка</span>
              <span className="text-success uppercase font-bold">Бесплатно</span>
            </div>

            <div className="summary-row total">
              <span>К оплате</span>
              <span className="total-value-premium">{getPrice(total).toLocaleString()} ₽</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="checkout-btn-premium"
            >
              <CheckoutIcon /> Оформить заказ
            </button>

            <button onClick={clearCart} className="clear-cart-btn-p flex items-center justify-center gap-2">
              <ClearIcon /> Очистить корзину
            </button>

            <Link to="/shop" className="cart-continue-shopping mt-8 block text-center text-muted hover:text-primary transition-colors">
              <ArrowLeft /> Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;