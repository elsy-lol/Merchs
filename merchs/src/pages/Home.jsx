// src/pages/Home.jsx

import { Link } from 'react-router-dom';
import { 
  MicIcon, 
  RecycleIcon, 
  ShieldIcon, 
  ArrowLeft,
  LogoIcon 
} from '../components/Icons';
import './Home.css';

const Home = () => {
  const artists = [
    "OG Buda", "Scally Milano", "163ONMYNECK", "MAYOT", 
    "FRIENDLY THUG 52 NGG", "ALBLAK 52", "BUSY", "TOXI$",
    "AARNE", "BIG BABY TAPE", "KIZARU", "MORGENSHTERN"
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <LogoIcon />
            <span>ЭКСКЛЮЗИВ И АРХИВЫ</span>
          </div>
          <h1 className="hero-title">
            Носи свою<br />
            <span className="highlight">Культуру</span>
          </h1>
          <p className="hero-subtitle">
            Главная экосистема для оригинального мерча, дропов артистов 
            и кураторских находок из мира уличной моды.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              СМОТРЕТЬ ДРОПЫ
            </Link>
          </div>
        </div>
      </section>

      {/* Artists Marquee */}
      <section className="artist-marquee">
        <div className="marquee-inner">
          <div className="artist-list">
            {artists.map((artist, index) => (
              <div key={index} className="artist-group">
                <span className="artist-item">{artist}</span>
                <div className="artist-sep"></div>
              </div>
            ))}
          </div>
          {/* Duplicate for loop */}
          <div className="artist-list" aria-hidden="true">
            {artists.map((artist, index) => (
              <div key={index} className="artist-group">
                <span className="artist-item">{artist}</span>
                <div className="artist-sep"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="featured">
        <div className="container">
          <div className="featured-header">
            <h2 className="featured-title">Пульс Платформы</h2>
            <p className="featured-subtitle">Создано улицами для тех, кто в теме.</p>
          </div>
          
          <div className="featured-grid">
            <div className="featured-card">
              <div className="featured-icon-wrap"><MicIcon /></div>
              <h3 className="featured-card-title">Официальные Дропы</h3>
              <p className="featured-card-desc">Напрямую от создателей. Проверка на подлинность. Никаких фейков.</p>
            </div>
            
            <div className="featured-card">
              <div className="featured-icon-wrap"><RecycleIcon /></div>
              <h3 className="featured-card-title">Вторая Жизнь</h3>
              <p className="featured-card-desc">Продавай свои архивы. Дай вещам новый дом. Устойчивый хайп.</p>
            </div>
            
            <div className="featured-card">
              <div className="featured-icon-wrap"><ShieldIcon /></div>
              <h3 className="featured-card-title">Сейф Сделок</h3>
              <p className="featured-card-desc">Защита покупателя на каждом этапе. Безопасные платежи для каждого.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-home">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-bg-glow"></div>
            <h2 className="cta-title">Готов к Дропу?</h2>
            <p className="cta-subtitle">Присоединяйся к самому активному стритвир-комьюнити сегодня.</p>
            <Link to="/register" className="cta-btn-premium">
              СТАТЬ ЧАСТЬЮ ПЛЕМЕНИ <ArrowLeft style={{ transform: 'rotate(180deg)' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;