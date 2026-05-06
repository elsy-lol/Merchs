import { Link } from 'react-router-dom';
import { 
  TargetIcon, 
  StarIcon, 
  GemIcon, 
  CodeIcon, 
  PaletteIcon, 
  BoxIcon, 
  MessageIcon,
  ArrowLeft
} from '../components/Icons';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Decorative Blur Elements */}
      <div className="about-decor-circle decor-1"></div>
      <div className="about-decor-circle decor-2"></div>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-manifesto animate-fade-in">
            <h1 className="about-title">
              Больше чем<br />
              <span className="gradient-text">Магазин</span>
            </h1>
            <p className="about-subtitle">
              Мы строим экосистему для тех, кто ценит аутентичность, 
              дизайн и культуру уличной моды.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about-philosophy">
        <div className="container">
          <div className="philosophy-container">
            <div className="philosophy-content">
              <span className="philosophy-header">Наша философия</span>
              <h2 className="philosophy-title">Мерч — это способ<br />самовыражения</h2>
              <p className="philosophy-text">
                Мы верим, что одежда — это мощный инструмент коммуникации. Наша платформа 
                создана для того, чтобы каждый мог найти частичку своей истории, 
                поддержать любимого артиста или дать вторую жизнь уникальной вещи.
              </p>
              
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon-wrapper"><TargetIcon /></div>
                  <h3 className="value-title">Доверие</h3>
                  <p className="mission-text">Только оригинальные товары напрямую от авторов.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon-wrapper"><StarIcon /></div>
                  <h3 className="value-title">Эксклюзив</h3>
                  <p className="mission-text">Лимитированные дропы, которые нельзя найти больше нигде.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon-wrapper"><GemIcon /></div>
                  <h3 className="value-title">Качество</h3>
                  <p className="mission-text">Отбираем лучшее, следим за каждой деталью производства.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-val">100+</div>
              <div className="stat-desc">Брендов и артистов</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">50K</div>
              <div className="stat-desc">Довольных фанатов</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">10K</div>
              <div className="stat-desc">Уникальных лотов</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">100%</div>
              <div className="stat-desc">Гарантия оригинал</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Team Section */}
      <section className="about-team">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Команда</h2>
            <p className="team-subtitle">Те, кто стоит за Merch Market</p>
          </div>
          
          <div className="team-layout">
            <div className="team-item">
              <div className="team-icon-float"><CodeIcon /></div>
              <div className="team-info-wrap">
                <span className="team-label">Tech</span>
                <h4 className="team-name">Разработка</h4>
              </div>
            </div>
            
            <div className="team-item">
              <div className="team-icon-float"><PaletteIcon /></div>
              <div className="team-info-wrap">
                <span className="team-label">Creative</span>
                <h4 className="team-name">Дизайн</h4>
              </div>
            </div>
            
            <div className="team-item">
              <div className="team-icon-float"><BoxIcon size={48} /></div>
              <div className="team-info-wrap">
                <span className="team-label">Ops</span>
                <h4 className="team-name">Логистика</h4>
              </div>
            </div>
            
            <div className="team-item">
              <div className="team-icon-float"><MessageIcon /></div>
              <div className="team-info-wrap">
                <span className="team-label">Support</span>
                <h4 className="team-name">Забота</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-glass">
            <h2 className="cta-title-alt">Стань частью<br />Культуры</h2>
            <p className="cta-subtitle">
              Зарегистрируйся сегодня и получи доступ к закрытым распродажам 
              и эксклюзивным коллекциям.
            </p>
            <Link to="/register" className="cta-button-premium">
              Создать аккаунт <ArrowLeft style={{ transform: 'rotate(180deg)' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;