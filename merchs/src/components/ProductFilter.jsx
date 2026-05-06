import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import { SearchIcon, OfficialIcon, RecycleIcon } from './Icons';
import './ProductFilter.css';

const ProductFilter = ({ filters, onFilterChange, fixedCreatorId }) => {
  const [categories, setCategories] = useState([]);
  const [creators, setCreators] = useState([]);
  const [expanded, setExpanded] = useState({
    search: true,
    price: true,
    type: true,
    category: true,
    creator: false,
    sort: true,
  });

  const [localFilters, setLocalFilters] = useState({
    product_type: '',
    category: '',
    creator: '',
    search: '',
    ordering: '',
    price__gte: '',
    price__lte: '',
  });

  useEffect(() => {
    setLocalFilters({
      product_type: filters.product_type || '',
      category: filters.category || '',
      creator: filters.creator || '',
      search: filters.search || '',
      ordering: filters.ordering || '',
      price__gte: filters.price__gte || '',
      price__lte: filters.price__lte || '',
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

  const updateFilters = (updates) => {
    const newLocalFilters = { ...localFilters, ...updates };
    setLocalFilters(newLocalFilters);
    
    const cleaned = Object.fromEntries(
      Object.entries(newLocalFilters).filter(([_, v]) => v !== '' && v !== null)
    );
    onFilterChange(cleaned);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  const selectOption = (name, value) => {
    updateFilters({ [name]: value === localFilters[name] ? '' : value });
  };

  return (
    <div className="product-filter-sidebar">
      {/* Search */}
      <div className="filter-section">
        <div className="search-box">
          <input 
            type="text" 
            name="search" 
            placeholder="Что ищем?" 
            value={localFilters.search} 
            onChange={handleInputChange} 
            className="filter-search-input" 
          />
          <span className="search-icon"><SearchIcon /></span>
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('price')}>
          <span>Цена</span>
          <span className={`filter-arrow ${expanded.price ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.price && (
          <div className="filter-section-content">
            <div className="price-inputs">
              <input 
                type="number" 
                name="price__gte" 
                placeholder="От" 
                value={localFilters.price__gte} 
                onChange={handleInputChange} 
                className="price-input"
              />
              <input 
                type="number" 
                name="price__lte" 
                placeholder="До" 
                value={localFilters.price__lte} 
                onChange={handleInputChange} 
                className="price-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Type */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('type')}>
          <span>Тип товара</span>
          <span className={`filter-arrow ${expanded.type ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.type && (
          <div className="filter-chips">
            <button 
              className={`filter-chip ${localFilters.product_type === 'official' ? 'active' : ''}`}
              onClick={() => selectOption('product_type', 'official')}
            >
              <OfficialIcon /> Мерч
            </button>
            <button 
              className={`filter-chip ${localFilters.product_type === 'second_hand' ? 'active' : ''}`}
              onClick={() => selectOption('product_type', 'second_hand')}
            >
              <RecycleIcon /> Секонд
            </button>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('category')}>
          <span>Категория</span>
          <span className={`filter-arrow ${expanded.category ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.category && (
          <div className="filter-chips">
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`filter-chip ${localFilters.category == cat.id ? 'active' : ''}`}
                onClick={() => selectOption('category', cat.id.toString())}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="filter-section">
        <button className="filter-section-title" onClick={() => toggleSection('sort')}>
          <span>Сортировка</span>
          <span className={`filter-arrow ${expanded.sort ? 'open' : ''}`}>▼</span>
        </button>
        {expanded.sort && (
          <div className="filter-options">
            {[
              { value: '', label: 'По умолчанию' },
              { value: '-created_at', label: 'Сначала новые' },
              { value: 'price', label: 'Дешевле' },
              { value: '-price', label: 'Дороже' },
            ].map(opt => (
              <button 
                key={opt.value}
                className={`filter-option ${localFilters.ordering === opt.value ? 'active' : ''}`}
                onClick={() => updateFilters({ ordering: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;