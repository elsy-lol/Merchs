import { Link } from 'react-router-dom';
import { MicIcon, RecycleIcon, ShieldIcon } from '../components/Icons';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* ... */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">НОВАЯ КОЛЛЕКЦИЯ</span>
          <h1 className="hero-title">
            Твой стиль —<br />
            <span className="highlight">Твои правила</span>
          </h1>
          {/* ... */}
        </div>
      </section>

      <section className="featured">
        <div className="featured-header">
          <h2 className="featured-title">Почему мы</h2>
          <p className="featured-subtitle">Лучшая платформа для мерча и секонд-хенда</p>
        </div>
        <div className="featured-grid">
          <div className="featured-card">
            <div className="featured-icon"><MicIcon /></div>
            <h3 className="featured-card-title">Официальный мерч</h3>
            <p className="featured-card-desc">Напрямую от создателей и артистов. 100% аутентичные товары.</p>
          </div>
          <div className="featured-card">
            <div className="featured-icon"><RecycleIcon /></div>
            <h3 className="featured-card-title">Секонд-хенд</h3>
            <p className="featured-card-desc">Покупай и продавай мерч от фанатов. Устойчивая мода.</p>
          </div>
          <div className="featured-card">
            <div className="featured-icon"><ShieldIcon /></div>
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