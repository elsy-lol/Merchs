// src/components/Navbar.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          🎨 MerchMarket
        </Link>

        {/* Mobile toggle */}
        <button 
          className={`navbar-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/shop" 
            className={`navbar-link ${isActive('/shop') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            🛒 Каталог
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            ℹ️ О нас
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/cart" 
                className={`navbar-link navbar-cart ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🛒 Корзина
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <Link 
                to="/profile" 
                className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 {user?.username}
              </Link>
              <Link 
                to="/wishlist" 
                className={`navbar-link ${isActive('/wishlist') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                ❤️ Избранное
              </Link>
              <button 
                onClick={handleLogout} 
                className="navbar-link navbar-logout"
              >
                🚪 Выйти
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🔐 Вход
              </Link>
              <Link 
                to="/register" 
                className="navbar-link navbar-register"
                onClick={() => setMobileMenuOpen(false)}
              >
                📝 Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;