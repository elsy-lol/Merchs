import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ordersAPI } from '../api/orders';
import './Checkout.css';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ shipping_address: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(item => ({ product: item.product.id, quantity: item.quantity, variant: item.variant?.id }));
      await ordersAPI.createOrder({ ...formData, items });
      clearCart();
      navigate('/profile');
    } catch (err) { alert('Ошибка оформления: ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  if (cart.length === 0) return <div className="container text-center mt-8">Корзина пуста</div>;

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Оформление заказа</h1>
      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3 className="checkout-form-title">Адрес доставки</h3>
          <div className="form-group">
            <label className="form-label">Адрес *</label>
            <textarea name="shipping_address" value={formData.shipping_address} onChange={(e) => setFormData({...formData, shipping_address: e.target.value})} required rows={4} className="form-input" placeholder="Город, улица, дом, квартира" />
          </div>
          <button type="submit" disabled={loading} className="checkout-submit">{loading ? 'Обработка...' : 'Оплатить заказ'}</button>
        </form>
        <div className="checkout-summary">
          <h3 className="checkout-summary-title">Ваш заказ</h3>
          <div className="checkout-summary-items">
            {cart.map((item, idx) => (
              <div key={idx} className="checkout-summary-item">
                <div className="checkout-summary-item-image">{item.product.images?.[0]?.image && <img src={item.product.images[0].image} alt="" />}</div>
                <div className="checkout-summary-item-info">
                  <p className="checkout-summary-item-name">{item.product.name}</p>
                  <p className="checkout-summary-item-quantity">x{item.quantity}</p>
                </div>
                <span className="checkout-summary-item-price">{(item.product.price * item.quantity).toFixed(0)} ₽</span>
              </div>
            ))}
          </div>
          <div className="checkout-summary-row"><span>Товары:</span><span>{total.toFixed(2)} ₽</span></div>
          <div className="checkout-summary-row"><span>Доставка:</span><span>Бесплатно</span></div>
          <div className="checkout-summary-total"><span>Итого:</span><span>{total.toFixed(2)} ₽</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;