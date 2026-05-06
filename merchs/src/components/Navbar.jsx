// src/components/Navbar.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../context/ThemeContext';
import { 
  LogoIcon, 
  ShopIcon, 
  InfoIcon, 
  UserIcon, 
  HeartIcon, 
  LogoutIcon, 
  LoginIcon, 
  RegisterIcon, 
  SunIcon, 
  MoonIcon 
} from './Icons';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
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
          <LogoIcon /> MerchMarket
        </Link>

        {/* Action Group (Always visible on desktop, moved in mobile) */}
        <div className="navbar-actions-desktop">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Переключить тему"
            title={isDarkMode ? "Светлая тема" : "Темная тема"}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

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
            <ShopIcon /> Каталог
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <InfoIcon /> О нас
          </Link>
          
          <div className="navbar-divider-mobile"></div>

          {isAuthenticated ? (
            <>
              <Link 
                to="/cart" 
                className={`navbar-link navbar-cart ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShopIcon /> Корзина
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <Link 
                to="/profile" 
                className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon /> {user?.username}
              </Link>
              <Link 
                to="/wishlist" 
                className={`navbar-link ${isActive('/wishlist') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HeartIcon /> Избранное
              </Link>
              <button 
                onClick={handleLogout} 
                className="navbar-link navbar-logout"
              >
                <LogoutIcon /> Выйти
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LoginIcon /> Вход
              </Link>
              <Link 
                to="/register" 
                className="navbar-link navbar-register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RegisterIcon /> Регистрация
              </Link>
            </>
          )}

          {/* Theme toggle for mobile menu */}
          <div className="navbar-theme-mobile">
             <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                aria-label="Переключить тему"
              >
                {isDarkMode ? <><SunIcon /> Светлая тема</> : <><MoonIcon /> Темная тема</>}
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;