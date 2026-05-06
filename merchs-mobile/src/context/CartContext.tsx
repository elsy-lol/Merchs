// src/context/CartContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';


interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
  variant?: {
    id: number;
    size: string;
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, variant?: any, quantity?: number) => void;
  removeFromCart: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await storage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Load cart error:', error);
    }

  };

  const saveCart = async () => {
    try {
      await storage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Save cart error:', error);
    }

  };

  const addToCart = (product: any, variant?: any, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      return [...prev, { product, variant, quantity }];
    });
  };

  const removeFromCart = (productId: number, variantId?: number) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (variantId ? item.variant?.id === variantId : true)
          )
      )
    );
  };

  const updateQuantity = (productId: number, variantId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant?.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};