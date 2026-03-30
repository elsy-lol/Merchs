import { Link } from 'react-router-dom';
import './Home.css';  // ← ИМПОРТ СТИЛЕЙ

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">MerchMarket 🛍️</h1>
          <p className="hero-subtitle">Официальный мерч блогеров и музыкантов + секонд-хенд от фанатов</p>
          <div className="hero-buttons">
            <Link to="/shop" className="hero-btn hero-btn-primary">Смотреть каталог</Link>
            <Link to="/register" className="hero-btn hero-btn-secondary">Начать продавать</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="features-title">Почему мы?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3 className="feature-title">Официальный мерч</h3>
              <p className="feature-description">Прямые поставки от блогеров и музыкантов</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3 className="feature-title">Секонд-хенд</h3>
              <p className="feature-description">Покупай и продавай мерч от фанатов</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Безопасные сделки</h3>
              <p className="feature-description">Гарантия возврата и защита покупателей</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;