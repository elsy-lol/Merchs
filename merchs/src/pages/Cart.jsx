import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Корзина</h1>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p className="cart-empty-text">Ваша корзина пуста</p>
          <Link to="/shop" className="cart-empty-link">Перейти в каталог →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Корзина</h1>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-image">
              {item.product.images?.[0]?.image && <img src={item.product.images[0].image} alt={item.product.name} />}
            </div>
            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.product.name}</h3>
              <p className="cart-item-price">{item.product.price} ₽</p>
              {item.variant && <p className="cart-item-variant">Размер: {item.variant.size}</p>}
            </div>
            <div className="cart-item-quantity">
              <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.product.id, item.variant?.id, parseInt(e.target.value))} className="cart-item-quantity-input" />
            </div>
            <button onClick={() => removeFromCart(item.product.id, item.variant?.id)} className="cart-item-remove">Удалить</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-summary-row"><span>Товаров:</span><span>{cart.reduce((s, i) => s + i.quantity, 0)}</span></div>
        <div className="cart-summary-row"><span>Итого:</span><span className="cart-summary-total">{total.toFixed(2)} ₽</span></div>
        <div className="cart-summary-actions">
          <button onClick={clearCart} className="cart-clear-btn">🗑️ Очистить</button>
          <Link to="/checkout" className="btn btn-primary cart-checkout-btn">Оформить заказ ✨</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;