// File: context/CartContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from server on initial render
  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch cart data from server
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error(`Error fetching cart: ${response.status}`);
      }
      
      const data = await response.json();
      setCartItems(data.items || []);
      setCartCount(data.items.reduce((total, item) => total + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Initialize with empty cart on error
      setCartItems([]);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!product || !product.name) {
      console.error("Invalid product data:", product);
      return;
    }
    
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: {
            id: product.id || product.name,
            name: product.name,
            price: product.price || 0,
            stock: product.stock || 0,
            img: product.img || "/placeholder.jpg"
          },
          quantity
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error adding to cart: ${response.status}`);
      }
      
      // Refresh cart data
      fetchCart();
      
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (index, newQuantity) => {
    if (index < 0 || index >= cartItems.length) {
      console.error("Invalid cart item index:", index);
      return false;
    }
    
    const item = cartItems[index];
    
    if (newQuantity <= 0) {
      // If quantity becomes 0 or negative, remove the item
      return removeItem(index);
    }
    
    if (newQuantity > (item.stock || 0)) {
      console.error("Quantity exceeds available stock");
      return false;
    }
    
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id || item.name,
          quantity: newQuantity
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating cart: ${response.status}`);
      }
      
      // Refresh cart data
      fetchCart();
      
      return true;
    } catch (error) {
      console.error("Error updating cart:", error);
      return false;
    }
  };

  // Remove item from cart
  const removeItem = async (index) => {
    if (index < 0 || index >= cartItems.length) {
      console.error("Invalid cart item index:", index);
      return false;
    }
    
    const item = cartItems[index];
    
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id || item.name
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error removing from cart: ${response.status}`);
      }
      
      // Refresh cart data
      fetchCart();
      
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Error clearing cart: ${response.status}`);
      }
      
      setCartItems([]);
      setCartCount(0);
      
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price && typeof item.price === 'number' ? item.price : 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      calculateSubtotal,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
