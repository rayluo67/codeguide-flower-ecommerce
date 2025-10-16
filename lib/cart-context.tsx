'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ProductResponse, CartItem, CartResponse } from '@/lib/types/ecommerce';

interface CartState {
  items: CartItem[];
  total: string;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartResponse }
  | { type: 'ADD_ITEM'; payload: { product: ProductResponse; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: '0.00',
  itemCount: 0,
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
        isLoading: false,
      };

    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productId === product.id);

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          id: crypto.randomUUID(),
          productId: product.id,
          quantity,
          product,
        }];
      }

      const total = newItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      ).toFixed(2);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_ITEM': {
      const { productId, quantity } = action.payload;
      
      if (quantity === 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }

      const newItems = state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );

      const total = newItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      ).toFixed(2);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      const total = newItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      ).toFixed(2);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: '0.00',
        itemCount: 0,
      };

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: ProductResponse, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Generate session ID for guest users
  const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = sessionStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const sessionId = getSessionId();
      if (!sessionId) return;

      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (!response.ok) return;

      const cartData: CartResponse = await response.json();
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add item to cart
  const addItem = async (product: ProductResponse, quantity = 1) => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;

      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        // Rollback on error
        dispatch({ type: 'REMOVE_ITEM', payload: product.id });
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Update item quantity
  const updateItem = async (productId: string, quantity: number) => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;

      const previousState = state.items.find(item => item.productId === productId)?.quantity || 0;
      
      dispatch({ type: 'UPDATE_ITEM', payload: { productId, quantity } });

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        // Rollback on error
        dispatch({ type: 'UPDATE_ITEM', payload: { productId, quantity: previousState } });
        throw new Error('Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;

      dispatch({ type: 'REMOVE_ITEM', payload: productId });

      const response = await fetch(`/api/cart?sessionId=${sessionId}&productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Rollback on error - fetch fresh cart state
        await fetchCart();
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;

      dispatch({ type: 'CLEAR_CART' });

      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        await fetchCart();
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Initialize cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
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