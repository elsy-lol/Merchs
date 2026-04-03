import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import './ProductFilter.css';

const ProductFilter = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [creators, setCreators] = useState([]);
  const [expanded, setExpanded] = useState({
    search: true,
    type: true,
    category: true,
    creator: false,
    sort: false,
  });

  // ✅ Локальное состояние для инпутов (синхронизируется с props)
  const [localFilters, setLocalFilters] = useState({
    product_type: '',
    category: '',
    creator: '',
    search: '',
    ordering: '',
  });

  // ✅ Синхронизация с родительским состоянием
  useEffect(() => {
    setLocalFilters({
      product_type: filters.product_type || '',
      category: filters.category || '',
      creator: filters.creator || '',
      search: filters.search || '',
      ordering: filters.ordering || '',
    });
  }, [filters]);

  useEffect(() => {
    shopAPI.getCategories()
      .then(res => {
        const data = res.data.results || res.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => setCategories([]));

    shopAPI.getCreators()
      .then(res => {
        const data = res.data.results || res.data;
        setCreators(Array.isArray(data) ? data : []);
      })
      .catch(() => setCreators([]));
  }, []);

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newLocalFilters = { ...localFilters, [name]: value };
    setLocalFilters(newLocalFilters);
    
    // ✅ Отправляем родителю только заполненные фильтры
    const cleaned = Object.fromEntries(
      Object.entries(newLocalFilters).filter(([_, v]) => v !== '')
    );
    onFilterChange(cleaned);
  };

  const handleClear = () => {
    const emptyFilters = {
      product_type: '',
      category: '',
      creator: '',
      search: '',
      ordering: '',
    };
    setLocalFilters(emptyFilters);
    onFilterChange({});
  };

  return (
    <div className="product-filter-sidebar">
      {/* Поиск */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('search')}>
          <span>🔍 Поиск</span>
          <span className={`filter-arrow ${expanded.search ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.search && (
          <div className="filter-section-content">
            <input 
              type="text" 
              name="search" 
              placeholder="Название товара..." 
              value={localFilters.search} 
              onChange={handleChange} 
              className="filter-input" 
            />
          </div>
        )}
      </div>

      {/* Тип товара */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('type')}>
          <span>👕 Тип товара</span>
          <span className={`filter-arrow ${expanded.type ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.type && (
          <div className="filter-section-content">
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="product_type" 
                value="" 
                checked={localFilters.product_type === ''}
                onChange={handleChange} 
              />
              <span>Все</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="product_type" 
                value="official" 
                checked={localFilters.product_type === 'official'}
                onChange={handleChange} 
              />
              <span>🎤 Официальный мерч</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="product_type" 
                value="second_hand" 
                checked={localFilters.product_type === 'second_hand'}
                onChange={handleChange} 
              />
              <span>♻️ Секонд-хенд</span>
            </label>
          </div>
        )}
      </div>

      {/* Категория */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('category')}>
          <span>📁 Категория</span>
          <span className={`filter-arrow ${expanded.category ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.category && (
          <div className="filter-section-content">
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="category" 
                value="" 
                checked={localFilters.category === ''}
                onChange={handleChange} 
              />
              <span>Все</span>
            </label>
            {categories.map(cat => (
              <label key={cat.id} className="filter-checkbox">
                <input 
                  type="radio" 
                  name="category" 
                  value={cat.id} 
                  checked={localFilters.category === cat.id.toString()}
                  onChange={handleChange} 
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Исполнитель */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('creator')}>
          <span>🎤 Исполнитель</span>
          <span className={`filter-arrow ${expanded.creator ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.creator && (
          <div className="filter-section-content">
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="creator" 
                value="" 
                checked={localFilters.creator === ''}
                onChange={handleChange} 
              />
              <span>Все</span>
            </label>
            {creators.map(cr => (
              <label key={cr.id} className="filter-checkbox">
                <input 
                  type="radio" 
                  name="creator" 
                  value={cr.id} 
                  checked={localFilters.creator === cr.id.toString()}
                  onChange={handleChange} 
                />
                <span>{cr.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Сортировка */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('sort')}>
          <span>🔀 Сортировка</span>
          <span className={`filter-arrow ${expanded.sort ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.sort && (
          <div className="filter-section-content">
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="ordering" 
                value="" 
                checked={localFilters.ordering === ''}
                onChange={handleChange} 
              />
              <span>По умолчанию</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="ordering" 
                value="-created_at" 
                checked={localFilters.ordering === '-created_at'}
                onChange={handleChange} 
              />
              <span>🆕 Сначала новые</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="ordering" 
                value="price" 
                checked={localFilters.ordering === 'price'}
                onChange={handleChange} 
              />
              <span>💰 Цена: по возрастанию</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="radio" 
                name="ordering" 
                value="-price" 
                checked={localFilters.ordering === '-price'}
                onChange={handleChange} 
              />
              <span>💰 Цена: по убыванию</span>
            </label>
          </div>
        )}
      </div>

      {/* Кнопка сброса */}
      <button className="filter-clear-btn" onClick={handleClear}>
        🗑️ Сбросить все
      </button>
    </div>
  );
};

export default ProductFilter;