import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import './ProductFilter.css';

const ProductFilter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [creators, setCreators] = useState([]);
  
  // ✅ Отдельное состояние для поиска (локальное, пока не нажата кнопка)
  const [searchInput, setSearchInput] = useState('');
  
  const [filters, setFilters] = useState({ 
    product_type: '', 
    category: '', 
    creator: '', 
    search: '', 
    ordering: '' 
  });

  useEffect(() => {
    shopAPI.getCategories()
      .then(res => {
        const data = res.data.results || res.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки категорий:', err);
        setCategories([]);
      });

    shopAPI.getCreators()
      .then(res => {
        const data = res.data.results || res.data;
        setCreators(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки блогеров:', err);
        setCreators([]);
      });
  }, []);

  // ✅ Обработчик для поиска — только обновляет локальное состояние
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  // ✅ Кнопка поиска — отправляет фильтр
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    
    const cleaned = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );
    onFilterChange(cleaned);
  };

  // ✅ Обработчик для остальных фильтров (мгновенное применение)
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    const cleaned = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );
    onFilterChange(cleaned);
  };

  // ✅ Сброс всех фильтров
  const handleClear = () => {
    const emptyFilters = { 
      product_type: '', 
      category: '', 
      creator: '', 
      search: '', 
      ordering: '' 
    };
    setSearchInput('');
    setFilters(emptyFilters);
    onFilterChange({});
  };

  // ✅ Обработка нажатия Enter в поле поиска
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <div className="product-filter">
      <div className="product-filter-grid">
        {/* 🔍 Поиск с кнопкой */}
        <div className="product-filter-group product-filter-search">
          <label className="product-filter-label">🔍 Поиск</label>
          <div className="product-filter-search-wrapper">
            <input 
              type="text" 
              placeholder="Название товара..." 
              value={searchInput} 
              onChange={handleSearchInput}
              onKeyDown={handleSearchKeyDown}
              className="product-filter-input" 
            />
            <button 
              type="button" 
              onClick={handleSearchSubmit}
              className="product-filter-search-btn"
              title="Найти"
            >
              🔍
            </button>
          </div>
        </div>
        
        <div className="product-filter-group">
          <label className="product-filter-label">Тип товара</label>
          <select 
            name="product_type" 
            value={filters.product_type} 
            onChange={handleChange} 
            className="product-filter-select"
          >
            <option value="">Все</option>
            <option value="official">🎤 Официальный мерч</option>
            <option value="second_hand">♻️ Секонд-хенд</option>
          </select>
        </div>
        
        <div className="product-filter-group">
          <label className="product-filter-label">Категория</label>
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleChange} 
            className="product-filter-select"
          >
            <option value="">Все</option>
            {Array.isArray(categories) && categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="product-filter-group">
          <label className="product-filter-label">Блогер</label>
          <select 
            name="creator" 
            value={filters.creator} 
            onChange={handleChange} 
            className="product-filter-select"
          >
            <option value="">Все</option>
            {Array.isArray(creators) && creators.map(cr => (
              <option key={cr.id} value={cr.id}>{cr.name}</option>
            ))}
          </select>
        </div>
        
        <div className="product-filter-group">
          <label className="product-filter-label">Сортировка</label>
          <select 
            name="ordering" 
            value={filters.ordering} 
            onChange={handleChange} 
            className="product-filter-select"
          >
            <option value="">По умолчанию</option>
            <option value="price">💰 Цена: по возрастанию</option>
            <option value="-price">💰 Цена: по убыванию</option>
            <option value="-created_at">🆕 Сначала новые</option>
            <option value="created_at">📅 Сначала старые</option>
          </select>
        </div>
        
        <div className="product-filter-clear">
          <button 
            type="button" 
            onClick={handleClear} 
            className="product-filter-clear-btn"
          >
            🗑️ Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;