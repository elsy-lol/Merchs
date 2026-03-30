import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import './ProductFilter.css';

const ProductFilter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [creators, setCreators] = useState([]);
  const [filters, setFilters] = useState({ 
    product_type: '', 
    category: '', 
    creator: '', 
    search: '', 
    ordering: '' 
  });

  useEffect(() => {
    // ✅ Получаем категории с обработкой пагинации
    shopAPI.getCategories()
      .then(res => {
        const data = res.data.results || res.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки категорий:', err);
        setCategories([]);
      });

    // ✅ Получаем блогеров с обработкой пагинации
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    const cleaned = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );
    onFilterChange(cleaned);
  };

  const handleClear = () => {
    const emptyFilters = { 
      product_type: '', 
      category: '', 
      creator: '', 
      search: '', 
      ordering: '' 
    };
    setFilters(emptyFilters);
    onFilterChange({});
  };

  return (
    <div className="product-filter">
      <div className="product-filter-grid">
        <div className="product-filter-group">
          <label className="product-filter-label">🔍 Поиск</label>
          <input 
            type="text" 
            name="search" 
            placeholder="Название товара..." 
            value={filters.search} 
            onChange={handleChange} 
            className="product-filter-input" 
          />
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