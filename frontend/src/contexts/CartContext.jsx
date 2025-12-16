import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const debug = process.env.NODE_ENV === 'development';

// Load cart from localStorage
const loadCart = () => {
  if (typeof window === 'undefined')
    return { items: [], total: 0, itemCount: 0 };
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error loading cart:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
};

// Calculate cart total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * (item.quantity || 1);
  }, 0);
};

// Calculate total items in cart
const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + (item.quantity || 1), 0);
};

const cartReducer = (state, action) => {
  // if (debug) {
    console.log('🔄 Cart Reducer Action:', {
      type: action.type,
      payload: action.payload,
      previousState: state,
      timestamp: new Date().toISOString(),
    });
  // }
  let newItems = [...state.items];

  switch (action.type) {
    case 'ADD_ITEM': {
      const { _id } = action.payload;
      const existingIndex = newItems.findIndex((item) => item._id === _id);

      if (existingIndex >= 0) {
        // Update existing item
        const updatedItem = {
          ...newItems[existingIndex],
          quantity:
            newItems[existingIndex].quantity + (action.payload.quantity || 1),
        };
        newItems[existingIndex] = updatedItem;
      } else {
        // Add new item
        newItems = [
          ...newItems,
          {
            ...action.payload,
            quantity: action.payload.quantity || 1,
          },
        ];
      }
      break;
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = newItems.find((item) => item._id === action.payload);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`, {
          position: 'bottom-right',
          style: { background: '#22c55e', color: '#fff' },
        });
      }
      newItems = newItems.filter((item) => item._id !== action.payload);
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { _id, quantity } = action.payload;
      if (quantity < 1) {
        return { ...state }; // Don't update if quantity is less than 1
      }

      newItems = newItems.map((item) =>
        item._id === _id ? { ...item, quantity } : item
      );
      break;
    }

    case 'CLEAR_CART':
      newItems = [];
      break;

    default:
      return state;
  }

  // Calculate new totals
  const total = calculateTotal(newItems);
  const itemCount = calculateItemCount(newItems);

  return {
    items: newItems,
    total,
    itemCount,
  };
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadCart());

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [state]);

  const addToCart = useCallback((product, quantity = 1) => {
    console.log('📦 addToCart called with:', {
      product,
      hasId: !!product?._id,
      productKeys: product ? Object.keys(product) : 'no product',
    });
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return;
    }
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        quantity: Math.max(1, quantity),
      },
    });
    toast.success(`${product.name} added to cart`, {
      position: 'bottom-right',
      style: { background: '#22c55e', color: '#fff' },
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { _id: productId, quantity },
      });
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared', {
      position: 'bottom-right',
      style: { background: '#22c55e', color: '#fff' },
    });
  }, []);

  const isInCart = useCallback(
    (productId) => {
      return state.items.some((item) => item._id === productId);
    },
    [state.items]
  );

  const getItemQuantity = useCallback(
    (productId) => {
      const item = state.items.find((item) => item._id === productId);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  const increaseQuantity = useCallback(
    (productId) => {
      const item = state.items.find((item) => item._id === productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
      }
    },
    [state.items, updateQuantity]
  );

  const decreaseQuantity = useCallback(
    (productId) => {
      const item = state.items.find((item) => item._id === productId);
      if (item) {
        if (item.quantity <= 1) {
          removeFromCart(productId);
        } else {
          updateQuantity(productId, item.quantity - 1);
        }
      }
    },
    [state.items, updateQuantity, removeFromCart]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        total: state.total,
        itemCount: state.itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        increaseQuantity,
        decreaseQuantity
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
