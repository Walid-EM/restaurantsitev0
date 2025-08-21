'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Types pour le panier
export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  category?: string; 
  supplements?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  stepSelections?: {
    [stepKey: string]: {
      [itemId: string]: number;
    };
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  calculateTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fonction utilitaire pour créer un identifiant unique basé sur l'ID et les suppléments
  const createUniqueId = (item: CartItem) => {
    const supplementsKey = item.supplements 
      ? JSON.stringify(item.supplements.sort((a, b) => a.id.localeCompare(b.id)))
      : '';
    return `${item.id}_${supplementsKey}`;
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const newItemWithQuantity = { ...item, quantity: 1 };
      const uniqueId = createUniqueId(newItemWithQuantity);
      
      const existingItem = prev.find(cartItem => createUniqueId(cartItem) === uniqueId);
      
      if (existingItem) {
        return prev.map(cartItem => 
          createUniqueId(cartItem) === uniqueId 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, newItemWithQuantity];
      }
    });
  };

  const removeFromCart = (uniqueId: string) => {
    setCartItems(prev => prev.filter(item => createUniqueId(item) !== uniqueId));
  };

  const updateQuantity = (uniqueId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(uniqueId);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          createUniqueId(item) === uniqueId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.supplements) {
        itemTotal += item.supplements.reduce((suppTotal, supp) => 
          suppTotal + (supp.price * supp.quantity), 0
        );
      }
      return total + itemTotal;
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      calculateTotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 