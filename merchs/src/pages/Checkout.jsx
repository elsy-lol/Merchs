import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ordersAPI } from '../api/orders';
import './Cart.css';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ shipping_address: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(item => ({ 
        product: item.product.id, 
        quantity: item.quantity, 
        variant: item.variant?.id 
      }));
      await ordersAPI.createOrder({ ...formData, items });
      clearCart();
      navigate('/profile');
    } catch (err) { 
      alert('Ошибка: ' + (err.response?.data?.message || err.message)); 
    } finally { 
      setLoading(false); 
    }
  };

  if (cart.length === 0) return <div className="container text-center mt-8">Корзина пуста</div>;

  return (
    <div className="cart-page">
      <h1 className="cart-title">Оформление заказа</h1>
      <form onSubmit={handleSubmit} className="cart-items" style={{padding: '2rem'}}>
        <div className="auth-form-group">
          <label className="auth-label">Адрес доставки *</label>
          <textarea 
            name="shipping_address" 
            value={formData.shipping_address} 
            onChange={(e) => setFormData({...formData, shipping_address: e.target.value})} 
            required 
            rows={4} 
            className="auth-input" 
            placeholder="Город, улица, дом, квартира" 
          />
        </div>
        <div className="cart-summary">
          <div className="cart-summary-row"><span>Товары:</span><span>{total.toFixed(2)} ₽</span></div>
          <div className="cart-summary-row"><span>Доставка:</span><span>Бесплатно 🚀</span></div>
          <div className="cart-summary-row"><span>Итого:</span><span className="cart-summary-total">{total.toFixed(2)} ₽</span></div>
        </div>
        <button type="submit" disabled={loading} className="cart-checkout-btn" style={{width: '100%', marginTop: '1.5rem'}}>
          {loading ? 'Обработка...' : 'Разместить заказ'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;