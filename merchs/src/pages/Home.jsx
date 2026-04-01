import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Граффити фон */}
      <div className="graffiti-bg">
        <div className="graffiti-tag">STYLE</div>
        <div className="graffiti-tag">STREET</div>
        <div className="graffiti-tag">MERCH</div>
        <div className="graffiti-tag">VIBE</div>
      </div>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🔥 Новая коллекция</span>
          <h1 className="hero-title">
            Твой стиль —<br />
            <span className="highlight">Твои правила</span>
          </h1>
          <p className="hero-subtitle">
            Эксклюзивный мерч от твоих любимых создателей и артистов. 
            Качество встречается с культурой.
          </p>
          <div className="hero-buttons">
            <Link to="/shop" className="hero-btn hero-btn-primary">В каталог</Link>
            <Link to="/register" className="hero-btn hero-btn-secondary">Начать продавать</Link>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="featured-header">
          <h2 className="featured-title">Почему мы</h2>
          <p className="featured-subtitle">Лучшая платформа для мерча и секонд-хенда</p>
        </div>
        <div className="featured-grid">
          <div className="featured-card">
            <div className="featured-icon">🎤</div>
            <h3 className="featured-card-title">Официальный мерч</h3>
            <p className="featured-card-desc">Напрямую от создателей и артистов. 100% аутентичные товары.</p>
          </div>
          <div className="featured-card">
            <div className="featured-icon">♻️</div>
            <h3 className="featured-card-title">Секонд-хенд</h3>
            <p className="featured-card-desc">Покупай и продавай мерч от фанатов. Устойчивая мода.</p>
          </div>
          <div className="featured-card">
            <div className="featured-icon">🛡️</div>
            <h3 className="featured-card-title">Безопасные сделки</h3>
            <p className="featured-card-desc">Защищённые платежи и гарантия защиты покупателя.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Готов начать?</h2>
          <p className="cta-subtitle">Присоединяйся к тысячам фанатов и коллекционеров сегодня.</p>
          <Link to="/register" className="cta-btn">Создать аккаунт</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;