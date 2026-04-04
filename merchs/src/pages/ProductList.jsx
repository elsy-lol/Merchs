// src/pages/ProductList.jsx

import { useEffect, useState, useMemo } from 'react';
import { shopAPI } from '../api/shop';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Активные фильтры (применены к API)
  const [activeFilters, setActiveFilters] = useState({});
  
  // ✅ Отложенные фильтры (выбрал пользователь)
  const [pendingFilters, setPendingFilters] = useState({});
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // ✅ Флаг: есть ли неприменённые изменения
  const hasPendingChanges = useMemo(() => {
    return JSON.stringify(activeFilters) !== JSON.stringify(pendingFilters);
  }, [activeFilters, pendingFilters]);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await shopAPI.getProducts(params);
      setProducts(response.data.results || response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Загружаем товары только при изменении activeFilters
  useEffect(() => {
    fetchProducts(activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  // ✅ Обработчик изменения фильтров (только сохраняет, не применяет)
  const handleFilterChange = (newFilters) => {
    setPendingFilters(newFilters);
  };

  // ✅ Применить фильтры (кнопка "Показать")
  const handleApplyFilters = () => {
    setActiveFilters({ ...pendingFilters });
    setMobileFiltersOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Сбросить фильтры
  const handleResetFilters = () => {
    const emptyFilters = {};
    setPendingFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setMobileFiltersOpen(false);
  };

  if (loading && products.length === 0) {
    return (
      <div className="product-list-page">
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <button 
        className="mobile-filters-toggle"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      >
        📑 Фильтры
        {hasPendingChanges && <span className="pending-indicator">●</span>}
      </button>

      <div className="product-list-container">
        {/* ✅ SIDEBAR С ФИЛЬТРАМИ */}
        <aside className={`filters-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="filters-sidebar-header">
            <h2 className="filters-sidebar-title">Фильтры</h2>
            <button 
              className="filters-close"
              onClick={() => setMobileFiltersOpen(false)}
            >
              ✕
            </button>
          </div>
          
          {/* ✅ Компонент фильтров */}
          <ProductFilter 
            filters={pendingFilters} 
            onFilterChange={handleFilterChange} 
          />
          
          {/* ✅ Кнопки применения */}
          <div className="filters-actions">
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-reset"
            >
              🔄 Сбросить
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="btn-apply"
              disabled={!hasPendingChanges}
            >
              {hasPendingChanges ? `Показать` : '✓'}
            </button>
          </div>
        </aside>

        {/* ✅ ОСНОВНОЙ КОНТЕНТ */}
        <main className="product-list-content">
          <div className="product-list-header">
            <h1 className="product-list-title">Каталог</h1>
            <p className="product-list-count">
              Найдено: <strong>{products.length}</strong> товаров
            </p>
            {hasPendingChanges && (
              <button 
                onClick={handleApplyFilters}
                className="btn-apply-float"
              >
                ✅ Применить ({products.length})
              </button>
            )}
          </div>
          
          {products.length === 0 ? (
            <div className="product-list-empty">
              <div className="product-list-empty-icon">🔍</div>
              <p className="product-list-empty-text">Товары не найдены</p>
              {hasPendingChanges && (
                <button onClick={handleResetFilters} className="btn-reset-float">
                  🔄 Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <div className="product-list-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;