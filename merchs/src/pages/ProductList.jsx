import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setMobileFiltersOpen(false); // Закрыть на мобильном после применения
  };

  if (loading) {
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
      {/* Кнопка фильтров для мобильных */}
      <button 
        className="mobile-filters-toggle"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      >
        📑 Фильтры
      </button>

      <div className="product-list-container">
        {/* Боковая панель фильтров */}
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
          <ProductFilter onFilterChange={handleFilterChange} />
        </aside>

        {/* Основной контент */}
        <main className="product-list-content">
          <div className="product-list-header">
            <h1 className="product-list-title">Каталог</h1>
            <p className="product-list-count">Найдено: <strong>{products.length}</strong> товаров</p>
          </div>
          
          {products.length === 0 ? (
            <div className="product-list-empty">
              <div className="product-list-empty-icon">🔍</div>
              <p className="product-list-empty-text">Товары не найдены</p>
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