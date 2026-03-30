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
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    const cleaned = Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ''));
    setFilters(cleaned);
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h1 className="page-title">Каталог товаров</h1>
        <p className="product-list-count">Найдено: {products.length}</p>
      </div>
      <ProductFilter onFilterChange={handleFilterChange} />
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
    </div>
  );
};

export default ProductList;