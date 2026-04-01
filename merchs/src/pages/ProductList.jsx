import { useEffect, useState } from 'react';
import { shopAPI } from '../api/shop';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

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
      <div className="product-list-header">
        <div>
          <h1 className="product-list-title">Каталог</h1>
          <p className="product-list-count">
            {filters.search && (
              <span className="badge badge-primary">🔍 "{filters.search}"</span>
            )}
            {' '}Найдено: {products.length}
          </p>
        </div>
      </div>
      
      <ProductFilter onFilterChange={handleFilterChange} />
      
      {products.length === 0 ? (
        <div className="product-list-empty">
          <div className="product-list-empty-icon">🔍</div>
          <p className="product-list-empty-text">Товары не найдены</p>
          <p className="product-list-empty-hint">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <div className="product-list-grid">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;