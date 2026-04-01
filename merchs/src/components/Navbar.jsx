import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleThemeToggle = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">MerchMarket</Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/shop" className="navbar-link">Каталог</Link>
          <Link to="/about" className="navbar-link">О нас</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="navbar-cart">
                🛒
                {count > 0 && <span className="navbar-cart-count">{count}</span>}
              </Link>
              <Link to="/profile" className="navbar-link">Профиль</Link>
              {user?.role === 'seller' || user?.role === 'both' ? (
                <Link to="/seller" className="navbar-link">Продавцу</Link>
              ) : null}
              <button onClick={handleLogout} className="btn btn-sm btn-outline">Выйти</button>
            </>
          ) : (
            <div className="navbar-actions">
              <button onClick={handleThemeToggle} className="theme-toggle" title="Сменить тему">
                🌓
              </button>
              <Link to="/login" className="navbar-btn navbar-btn-login">Вход</Link>
              <Link to="/register" className="navbar-btn navbar-btn-register">Регистрация</Link>
            </div>
          )}
        </div>

        <button 
          className="navbar-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;