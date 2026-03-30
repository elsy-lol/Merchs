import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.variant?.id === variant?.id);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity, variant }];
    });
  };

  const removeFromCart = (productId, variantId = null) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.variant?.id === variantId)));
  };

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId, variantId); return; }
    setCart(prev => prev.map(item =>
      item.product.id === productId && item.variant?.id === variantId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count };
};