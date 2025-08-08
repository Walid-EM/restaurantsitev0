'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from './types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product | CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product | CartItem) => {
    // Si c'est déjà un CartItem (avec options), l'ajouter directement
    if ('selectedOptions' in product) {
      setCartItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
      return;
    }

    // Si c'est un Product simple, créer un CartItem
    const cartItem: CartItem = {
      ...product,
      id: `${product.id}-${Date.now()}`,
      originalId: product.id as number,
      quantity: 1,
      totalPrice: parseFloat(product.price.replace('€', '').trim())
    };

    setCartItems(prevItems => [...prevItems, cartItem]);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.totalPrice || parseFloat(item.price.replace('€', '').trim());
      return total + (price * item.quantity);
    }, 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

