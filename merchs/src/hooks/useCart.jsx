// src/hooks/useCart.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // ✅ Фиксим типы данных
        const fixed = parsed.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 1,
          product: {
            ...item.product,
            price: Number(item.product?.price) || 0
          }
        }));
        setCart(fixed);
      }
    } catch (e) {
      console.error('❌ Cart load error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Добавление товара
  const addToCart = (product, variant = null, quantity = 1) => {
    setCart(prev => {
      // Ищем по product.id + variant.id
      const idx = prev.findIndex(i => 
        i.product?.id === product.id && 
        i.variant?.id === variant?.id
      );
      
      if (idx > -1) {
        const newCart = [...prev];
        newCart[idx] = {
          ...newCart[idx],
          quantity: (newCart[idx].quantity || 1) + quantity
        };
        return newCart;
      }
      
      return [...prev, {
        product: { ...product, price: Number(product.price) || 0 },
        variant,
        quantity: Number(quantity) || 1
      }];
    });
  };

  // ✅ Удаление — простая и надёжная версия
  const removeFromCart = (productId, variantId) => {
    console.log('🗑️ removeFromCart called:', { productId, variantId });
    
    setCart(prev => {
      const filtered = prev.filter(item => {
        // Если variantId есть — сравниваем и product, и variant
        if (variantId !== undefined && variantId !== null) {
          return !(item.product?.id === productId && item.variant?.id === variantId);
        }
        // Если variantId нет — удаляем все варианты этого продукта
        return item.product?.id !== productId;
      });
      console.log('✅ Cart after remove:', filtered);
      return filtered;
    });
  };

  // ✅ Обновление количества — ПРОСТАЯ ВЕРСИЯ
  const updateQuantity = (productId, variantId, newQuantity) => {
    console.log('🔢 updateQuantity called:', { productId, variantId, newQuantity });
    
    if (newQuantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }
    
    setCart(prev => {
      const updated = prev.map(item => {
        // Сравниваем так же, как в addToCart/removeFromCart
        const match = item.product?.id === productId && item.variant?.id === variantId;
        
        if (match) {
          console.log('✅ Found item, updating quantity:', item);
          return { ...item, quantity: Number(newQuantity) };
        }
        return item;
      });
      console.log('✅ Cart after update:', updated);
      return updated;
    });
  };

  const clearCart = () => {
    console.log('🗑️ clearCart called');
    setCart([]);
  };

  // Подсчёт суммы
  const total = cart.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const value = {
    cart,
    loading,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};