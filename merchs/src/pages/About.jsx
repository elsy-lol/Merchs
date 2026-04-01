import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Граффити фон */}
      <div className="graffiti-bg">
        <div className="graffiti-tag">ABOUT</div>
        <div className="graffiti-tag">STORY</div>
        <div className="graffiti-tag">MERCH</div>
      </div>

      {/* Hero секция */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">
            О <span className="gradient-text">нас</span>
          </h1>
          <p className="about-subtitle">
            Мы создаём платформу для настоящих фанатов и ценителей мерча
          </p>
        </div>
      </section>

      {/* Миссия */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card animate-slide-up">
              <div className="mission-icon">🎯</div>
              <h3 className="mission-title">Наша миссия</h3>
              <p className="mission-text">
                Мы объединяем фанатов и создателей контента, предоставляя платформу 
                для покупки и продажи официального мерча и секонд-хенд вещей. 
                Наша цель — сделать мерч доступным и качественным для каждого.
              </p>
            </div>
            
            <div className="mission-card animate-slide-up stagger-1">
              <div className="mission-icon">🌟</div>
              <h3 className="mission-title">Что мы делаем</h3>
              <p className="mission-text">
                Сотрудничаем с топовыми блогерами и музыкантами, чтобы ты мог 
                купить оригинальный мерч напрямую от исполнителя. А ещё у нас 
                можно найти редкие вещи от других фанатов!
              </p>
            </div>
            
            <div className="mission-card animate-slide-up stagger-2">
              <div className="mission-icon">💎</div>
              <h3 className="mission-title">Почему мы</h3>
              <p className="mission-text">
                Гарантия подлинности, удобная доставка, безопасные платежи и 
                комьюнити настоящих фанатов. Мы не просто магазин — мы часть 
                культуры!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="about-stats">
        <div className="container">
          <h2 className="stats-title">Наши достижения</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number gradient-text">1000+</div>
              <div className="stat-label">Товаров в каталоге</div>
            </div>
            <div className="stat-item">
              <div className="stat-number gradient-text">50+</div>
              <div className="stat-label">Артистов и блогеров</div>
            </div>
            <div className="stat-item">
              <div className="stat-number gradient-text">5000+</div>
              <div className="stat-label">Довольных клиентов</div>
            </div>
            <div className="stat-item">
              <div className="stat-number gradient-text">100%</div>
              <div className="stat-label">Оригинальный мерч</div>
            </div>
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="about-team">
        <div className="container">
          <h2 className="team-title">Наша команда</h2>
          <p className="team-subtitle">Люди, которые создают этот проект</p>
          
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">👨‍💻</div>
              <h4 className="team-name">Разработчики</h4>
              <p className="team-role">Создают магию кода</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">🎨</div>
              <h4 className="team-name">Дизайнеры</h4>
              <p className="team-role">Делают красиво</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">📦</div>
              <h4 className="team-name">Логисты</h4>
              <p className="team-role">Доставляют вовремя</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">💬</div>
              <h4 className="team-name">Поддержка</h4>
              <p className="team-role">Всегда на связи</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2 className="cta-title">Присоединяйся к нам!</h2>
          <p className="cta-subtitle">
            Стань частью комьюнити и получи доступ к эксклюзивному мерчу
          </p>
          <a href="/register" className="cta-btn">Создать аккаунт</a>
        </div>
      </section>
    </div>
  );
};

export default About;