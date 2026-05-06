import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import CreatorCard from '../components/CreatorCard';
import './CreatorList.css';

const CreatorList = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        const response = await shopAPI.getCreators();
        setCreators(response.data.results || response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки авторов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (loading && creators.length === 0) {
    return (
      <div className="creator-list-page">
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="creator-list-page">
      <div className="creator-list-container">
        <main className="creator-list-content">
          <div className="creator-list-header">
            <h1 className="creator-list-title">Наши исполнители и блогеры</h1>
            <p className="creator-list-subtitle">Выберите автора, чтобы посмотреть его мерч</p>
          </div>
          
          {creators.length === 0 ? (
            <div className="creator-list-empty">
              <div className="creator-list-empty-icon">🎤</div>
              <p className="creator-list-empty-text">Пока нет добавленных авторов</p>
            </div>
          ) : (
            <div className="creator-list-grid">
              {creators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreatorList;
