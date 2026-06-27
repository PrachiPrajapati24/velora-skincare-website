import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize cart from localStorage on mount (for guest users)
  useEffect(() => {
    if (!isAuthenticated) {
      const localCart = localStorage.getItem('velora_cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      } else {
        setCartItems([]);
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync state with database if authenticated, or with localStorage if guest
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && user) {
        // When user logs in, if they have guest items in localStorage, we merge them
        const localCart = localStorage.getItem('velora_cart');
        let mergedCart = [...user.cart];

        if (localCart) {
          const guestItems = JSON.parse(localCart);
          
          guestItems.forEach(guestItem => {
            const existing = mergedCart.find(item => 
              (item.product?._id || item.product) === (guestItem.product?._id || guestItem.product)
            );
            if (existing) {
              existing.quantity += guestItem.quantity;
            } else {
              mergedCart.push({
                product: guestItem.product?._id || guestItem.product,
                quantity: guestItem.quantity
              });
            }
          });

          localStorage.removeItem('velora_cart');
        }

        try {
          // Sync with database
          const res = await api.put('/cart', {
            cart: mergedCart.map(item => ({
              product: item.product?._id || item.product,
              quantity: item.quantity
            }))
          });
          if (res.data.success) {
            setCartItems(res.data.cart);
          }
        } catch (error) {
          console.error('Error syncing cart with DB:', error);
        }
      }
      setLoading(false);
    };

    syncCart();
  }, [isAuthenticated, user]);

  // Save to localStorage if guest user cart changes
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      localStorage.setItem('velora_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, loading]);

  // Add Item to Cart
  const addToCart = async (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => (item.product?._id || item.product) === product._id
      );

      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          (item.product?._id || item.product) === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }

      // If logged in, sync immediately to DB
      if (isAuthenticated) {
        api.put('/cart', {
          cart: newItems.map(item => ({
            product: item.product?._id || item.product,
            quantity: item.quantity
          }))
        }).catch(err => console.error('Error syncing add-to-cart:', err));
      }

      return newItems;
    });
  };

  // Remove Item from Cart
  const removeFromCart = async (productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => (item.product?._id || item.product) !== productId
      );

      // Sync immediately if logged in
      if (isAuthenticated) {
        api.put('/cart', {
          cart: newItems.map(item => ({
            product: item.product?._id || item.product,
            quantity: item.quantity
          }))
        }).catch(err => console.error('Error syncing remove-from-cart:', err));
      }

      return newItems;
    });
  };

  // Update Quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        (item.product?._id || item.product) === productId
          ? { ...item, quantity }
          : item
      );

      // Sync immediately if logged in
      if (isAuthenticated) {
        api.put('/cart', {
          cart: newItems.map(item => ({
            product: item.product?._id || item.product,
            quantity: item.quantity
          }))
        }).catch(err => console.error('Error syncing update-quantity:', err));
      }

      return newItems;
    });
  };

  // Clear Cart
  const clearCart = async () => {
    setCartItems([]);
    if (isAuthenticated) {
      try {
        await api.put('/cart', { cart: [] });
      } catch (error) {
        console.error('Error clearing cart in DB:', error);
      }
    } else {
      localStorage.removeItem('velora_cart');
    }
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
