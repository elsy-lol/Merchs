import api from './axios';

export const shopAPI = {
  getProducts: (params = {}) => api.get('shop/products/', { params }),
  getProduct: (id) => api.get(`shop/products/${id}/`),
  createProduct: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        data.images.forEach(img => formData.append('images', img));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('shop/products/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getCategories: () => api.get('shop/categories/'),
  getCreators: () => api.get('shop/creators/'),
  getFavorites: () => api.get('interactions/favorites/my_favorites/'),
  toggleFavorite: (productId) => api.post('interactions/favorites/toggle/', { product: productId }),
};