import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize wishlist from localStorage if guest
  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = localStorage.getItem('velora_wishlist');
      if (localWishlist) {
        setWishlistItems(JSON.parse(localWishlist));
      } else {
        setWishlistItems([]);
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync wishlist with DB upon login
  useEffect(() => {
    const syncWishlist = async () => {
      if (isAuthenticated && user) {
        // Retrieve local wishlist and sync
        const localWishlist = localStorage.getItem('velora_wishlist');
        let mergedWishlist = [...(user.wishlist || [])];

        if (localWishlist) {
          const guestWishlist = JSON.parse(localWishlist);
          guestWishlist.forEach(guestProd => {
            const exists = mergedWishlist.some(item => item._id === guestProd._id);
            if (!exists) {
              mergedWishlist.push(guestProd);
            }
          });
          
          localStorage.removeItem('velora_wishlist');
          
          // Save merged wishlist to DB sequentially
          for (const item of guestWishlist) {
            try {
              await api.post(`/wishlist/${item._id}`);
            } catch (err) {
              console.error('Error adding item to DB wishlist on login:', err);
            }
          }
        }

        try {
          const res = await api.get('/wishlist');
          if (res.data.success) {
            setWishlistItems(res.data.wishlist);
          }
        } catch (error) {
          console.error('Error fetching DB wishlist:', error);
        }
      }
      setLoading(false);
    };

    syncWishlist();
  }, [isAuthenticated, user]);

  // Save to localStorage if guest user wishlist changes
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      localStorage.setItem('velora_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated, loading]);

  // Toggle item in wishlist (helper function)
  const toggleWishlist = async (product) => {
    const productId = product._id;
    const exists = wishlistItems.some(item => item._id === productId);

    if (exists) {
      // Remove it
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      if (isAuthenticated) {
        try {
          await api.post(`/wishlist/${productId}`);
        } catch (error) {
          console.error('Error removing from DB wishlist:', error);
        }
      }
    } else {
      // Add it
      setWishlistItems(prev => [...prev, product]);
      if (isAuthenticated) {
        try {
          await api.post(`/wishlist/${productId}`);
        } catch (error) {
          console.error('Error adding to DB wishlist:', error);
        }
      }
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
