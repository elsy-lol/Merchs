import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user, isAuthenticated, fetchWithAuth } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form');
  const [paymentData, setPaymentData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [formError, setFormError] = useState(null);
  
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formData.shipping_address.trim()) {
      setFormError('⚠️ Укажите адрес доставки');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('⚠️ Укажите телефон');
      return;
    }
    if (cart.length === 0) {
      setFormError('⚠️ Корзина пуста');
      return;
    }
    
    setFormError(null);
    setLoading(true);
    
    try {
      if (!isAuthenticated) {
        throw new Error('❌ Не авторизован. Перенаправляю на вход...');
      }

      // Формируем items
      const items = cart.map(item => ({
        product: item.product?.id,
        variant: item.variant?.id || null,
        quantity: parseInt(item.quantity) || 1,
      }));
      
      // Создаём заказ
      const orderRes = await fetchWithAuth('http://localhost:8000/api/orders/', {
        method: 'POST',
        body: JSON.stringify({
          shipping_address: formData.shipping_address.trim(),
          phone: formData.phone.trim(),
          email: formData.email?.trim() || '',
          items,
        }),
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        const errorMsg = orderData.items 
          ? '❌ Ошибка в товарах: ' + JSON.stringify(orderData.items)
          : orderData.detail || 'Не удалось создать заказ';
        throw new Error(errorMsg);
      }
      
      setOrderData(orderData);
      
      // Создаём платёж
      const paymentRes = await fetchWithAuth('http://localhost:8000/api/payments/', {
        method: 'POST',
        body: JSON.stringify({
          order_id: orderData.id,
          payment_method: 'sbp',
        }),
      });
      
      const paymentData = await paymentRes.json();
      
      if (!paymentRes.ok) {
        let errorMsg = 'Не удалось создать платёж';
        if (paymentData.detail) {
          errorMsg = paymentData.detail;
        } else if (paymentData.order_id) {
          errorMsg = 'Ошибка заказа: ' + JSON.stringify(paymentData.order_id);
        } else {
          errorMsg = 'Ошибка: ' + JSON.stringify(paymentData);
        }
        throw new Error(errorMsg);
      }
      
      setPaymentData(paymentData);
      setPaymentStep('qr');
      
    } catch (error) {
      if (error.message.includes('token') || error.message.includes('auth')) {
        alert('⚠️ Сессия истекла. Пожалуйста, войдите снова.');
        navigate('/login');
        return;
      }
      
      setFormError(error.message || 'Произошла неизвестная ошибка');
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:8000/api/payments/${paymentData.id}/confirm/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        setPaymentStep('success');
        clearCart();
      } else {
        setPaymentStep('failed');
      }
    } catch (error) {
      console.error('❌ Payment confirm error:', error);
      setPaymentStep('failed');
    } finally {
      setLoading(false);
    }
  };

  // Если корзина пуста
  if (cart.length === 0 && paymentStep !== 'success') {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>
          <h1>Корзина пуста</h1>
          <p>Добавьте товары, чтобы оформить заказ</p>
          <button onClick={() => navigate('/shop')} className="btn btn-primary">
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">💳 Оформление заказа</h1>
        
        {formError && (
          <div className="form-error-banner">
            ⚠️ {formError}
            <button onClick={() => setFormError(null)} className="error-close">✕</button>
          </div>
        )}
        
        {paymentStep === 'form' && (
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-section">
              <h2 className="checkout-section-title">📍 Адрес доставки</h2>
              <div className="form-group">
                <label>Адрес *</label>
                <textarea
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                  required
                  rows={4}
                  placeholder="Город, улица, дом, квартира"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Телефон *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="+7 (999) 000-00-00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="checkout-section">
              <h2 className="checkout-section-title">📦 Ваш заказ</h2>
              <div className="order-summary">
                {cart.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-info">
                      <span className="order-item-name">{item.product?.name || 'Товар'}</span>
                      {item.variant && (
                        <span className="order-item-variant">Размер: {item.variant.size}</span>
                      )}
                    </div>
                    <div className="order-item-right">
                      <span className="order-item-qty">x{item.quantity}</span>
                      <span className="order-item-price">{(item.product?.price * item.quantity)?.toFixed(2)} ₽</span>
                    </div>
                  </div>
                ))}
                <div className="order-total">
                  <span>Итого:</span>
                  <span className="total-amount">{total?.toFixed(2) || '0.00'} ₽</span>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || cart.length === 0} 
              className="checkout-btn"
            >
              {loading ? '⏳ Обработка...' : '💳 Перейти к оплате'}
            </button>
          </form>
        )}
        
        {paymentStep === 'qr' && paymentData && (
          <div className="payment-qr">
            <div className="qr-header">
              <h2>💳 Оплата через СБП</h2>
              <p>Отсканируйте QR-код в приложении вашего банка</p>
            </div>
            
            <div className="qr-container">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${paymentData.qr_code_url}`}
                alt="QR Code"
                className="qr-code"
              />
            </div>
            
            <div className="qr-info">
              <div className="qr-info-row">
                <span>💰 Сумма:</span>
                <strong>{paymentData.amount} ₽</strong>
              </div>
              <div className="qr-info-row">
                <span>📦 Заказ:</span>
                <strong>#{orderData?.id}</strong>
              </div>
              <div className="qr-info-row">
                <span>🔑 Транзакция:</span>
                <code>{paymentData.transaction_id}</code>
              </div>
            </div>
            
            <div className="qr-actions">
              <button onClick={handleConfirmPayment} disabled={loading} className="btn btn-primary btn-lg">
                {loading ? '⏳ Проверка...' : '✅ Я оплатил'}
              </button>
              <button onClick={() => setPaymentStep('form')} className="btn btn-secondary btn-lg">
                ← Назад
              </button>
            </div>
          </div>
        )}
        
        {paymentStep === 'success' && (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h2>Оплата успешна!</h2>
            <p>Ваш заказ оплачен и будет обработан в ближайшее время</p>
            <div className="success-details">
              <div className="success-row">
                <span>📦 Номер заказа:</span>
                <strong>#{orderData?.id || paymentData?.order?.id || 'N/A'}</strong>
              </div>
              <div className="success-row">
                <span>💰 Сумма оплаты:</span>
                <strong>{paymentData?.amount || total} ₽</strong>
              </div>
            </div>
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              В профиль
            </button>
          </div>
        )}
        
        {paymentStep === 'failed' && (
          <div className="payment-failed">
            <div className="failed-icon">❌</div>
            <h2>Оплата не прошла</h2>
            <p>Что-то пошло не так. Попробуйте снова</p>
            <div className="failed-actions">
              <button onClick={() => setPaymentStep('form')} className="btn btn-secondary">
                Попробовать снова
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;