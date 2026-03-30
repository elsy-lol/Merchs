import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">🛍️ MerchMarket</Link>
        
        <div className="navbar-menu">
          <Link to="/shop" className="navbar-link">Каталог</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="navbar-cart">
                🛒 Корзина
                {count > 0 && <span className="navbar-cart-count">{count}</span>}
              </Link>
              <Link to="/profile" className="navbar-link">👤 Профиль</Link>
              {user?.role === 'seller' && <Link to="/seller" className="navbar-link">📦 Продавцу</Link>}
              <button onClick={handleLogout} className="navbar-btn navbar-btn-logout">Выход</button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-btn navbar-btn-login">Вход</Link>
              <Link to="/register" className="navbar-btn navbar-btn-register">Регистрация</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;