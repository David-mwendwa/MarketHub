// src/contexts/WishlistContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      dispatch({ type: 'SET_WISHLIST', payload: JSON.parse(savedWishlist) });
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    } else {
      localStorage.removeItem('wishlist');
    }
  }, [state.items]);

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
