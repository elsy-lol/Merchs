import { Link } from 'react-router-dom';
import './CreatorCard.css';

const CreatorCard = ({ creator }) => {
  // Формируем URL для логотипа, если он есть, иначе ставим заглушку
  const logoUrl = creator.logo ? creator.logo : 'https://via.placeholder.com/150?text=Logo';

  return (
    <Link to={`/shop/creator/${creator.id}`} className="creator-card">
      <div className="creator-card-image-container">
        <img src={logoUrl} alt={creator.name} className="creator-card-image" />
      </div>
      <div className="creator-card-content">
        <h3 className="creator-card-title">{creator.name}</h3>
        {creator.description && (
          <p className="creator-card-description">
            {creator.description.length > 80 
              ? `${creator.description.substring(0, 80)}...` 
              : creator.description}
          </p>
        )}
        <div className="creator-card-action">
          <span>Смотреть мерч &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
