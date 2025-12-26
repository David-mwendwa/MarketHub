import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

const WishlistContext = createContext();

const initialState = {
  items: [],
  hasLoaded: false,
};

const wishlistReducer = (state, action) => {
  let newItems;
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.some((item) => item._id === action.payload._id)) {
        return state;
      }
      newItems = [...state.items, action.payload];
      return { ...state, items: newItems, hasLoaded: true };

    case 'REMOVE_FROM_WISHLIST':
      newItems = state.items.filter((item) => item._id !== action.payload);
      return { ...state, items: newItems, hasLoaded: true };

    case 'SET_WISHLIST':
      return {
        ...state,
        items: action.payload,
        hasLoaded: true,
      };

    case 'CLEAR_WISHLIST':
      return { ...state, items: [], hasLoaded: true };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'SET_WISHLIST', payload: parsed });
          return;
        }
      }
      // If no saved wishlist or invalid data, mark as loaded with empty array
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (state.hasLoaded) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      } catch (error) {
        console.error('Failed to save wishlist:', error);
      }
    }
  }, [state.items, state.hasLoaded]);

  const addToWishlist = useCallback((product) => {
    if (!product?._id) {
      console.error('Cannot add to wishlist: Invalid product');
      return;
    }
    dispatch({
      type: 'ADD_TO_WISHLIST',
      payload: {
        _id: product._id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        image:
          product.image ||
          product.thumbnail ||
          (Array.isArray(product.gallery) && product.gallery[0]?.url) ||
          '/placeholder-product.jpg',
        sku: product.sku,
        stock: product.stock?.qty || 0,
        addedDate: new Date().toISOString(),
        ...product,
      },
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return state.items.some((item) => item._id === productId);
    },
    [state.items]
  );

  const value = {
    items: state.items,
    hasLoaded: state.hasLoaded,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
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

export default WishlistContext;
