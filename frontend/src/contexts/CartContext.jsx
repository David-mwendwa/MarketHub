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

// Calculate cart subtotal (sum of all items * quantity)
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * (item.quantity || 1);
  }, 0);
};

// Calculate shipping cost
const calculateShipping = (subtotal) => {
  // Free shipping for orders over Ksh 1000
  if (subtotal >= 1000) {
    return 0;
  }
  // Standard shipping fee
  return 200;
};

// Calculate tax (16% of subtotal)
const calculateTax = (subtotal) => {
  return Math.round(subtotal * 0.16);
};

// Calculate total items in cart
const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + (item.quantity || 1), 0);
};

// Calculate all cart values
// In CartContext.jsx, update the calculateCartValues function
const calculateCartValues = (items, hasOrderProtection = false) => {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const orderProtection = hasOrderProtection ? 500 : 0;
  const total = subtotal + shipping + tax + orderProtection;
  const itemCount = calculateItemCount(items);
  
  return {
    subtotal,
    shipping,
    tax,
    orderProtection,
    total,
    itemCount,
    hasOrderProtection
  };
};

const cartReducer = (state, action) => {
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

    case 'TOGGLE_ORDER_PROTECTION': {
      const newHasOrderProtection = !state.hasOrderProtection;
      return {
        ...state,
        ...calculateCartValues(state.items, newHasOrderProtection),
        hasOrderProtection: newHasOrderProtection,
      };
    }

    case 'CLEAR_CART':
      newItems = [];
      break;

    default:
      return state;
  }

  // Calculate all cart values in one place
  return {
    ...calculateCartValues(newItems),
    items: newItems,
  };
};

export const CartProvider = ({ children }) => {
  // Initialize state with loaded cart
  const initialState = loadCart();

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

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

  const updateQuantity = useCallback((id, quantity) => {
    console.log(`Updating quantity for item ${id} to ${quantity}`);
    if (!id) {
      console.error('Cannot update quantity: Missing item ID');
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { _id: id, quantity } });
  }, []);

  const toggleOrderProtection = useCallback(() => {
    dispatch({ type: 'TOGGLE_ORDER_PROTECTION' });
  }, []);

  const clearCart = useCallback(() => {
    console.log('🔄 Clearing cart');
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared', {
      position: 'bottom-right',
      style: { background: '#22c55e', color: '#fff' },
    });
  }, []);

  const isInCart = useCallback(
    (id) => {
      const exists = state.items.some((item) => item._id === id);
      console.log(`Checking if item ${id} is in cart:`, exists);
      return exists;
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
        ...state, // Spread all state values
        cartItems: state.items, // Alias for backward compatibility
        items: state.items, // Original property name
        subtotal: state.subtotal || 0,
        shipping: state.shipping || 0,
        tax: state.tax || 0,
        total: state.total || 0,
        itemCount: state.itemCount || 0,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleOrderProtection,
        clearCart,
        isInCart,
        getItemQuantity,
        increaseQuantity,
        decreaseQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
};;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
