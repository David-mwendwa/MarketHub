// src/contexts/CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

// Sample products data
export const sampleProducts = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
    category: 'Electronics',
    rating: 4.8,
    description:
      'High-quality wireless earbuds with noise cancellation and 24h battery life.',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    category: 'Electronics',
    rating: 4.6,
    description:
      'Stay connected with advanced health tracking and notifications.',
  },
  {
    id: '3',
    name: 'Premium Coffee Beans',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300',
    category: 'Food & Beverage',
    rating: 4.9,
    description:
      'Rich and aromatic coffee beans, freshly roasted for the perfect cup.',
  },
  {
    id: '4',
    name: 'Leather Wallet',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1548032885-b5e38734688a?w=300',
    category: 'Accessories',
    rating: 4.7,
    description:
      'Genuine leather wallet with multiple card slots and RFID protection.',
  },
];

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  products: sampleProducts, // Add sample products to the state
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, quantity = 1 } = action.payload;
      const product = state.products.find((p) => p.id === id) || action.payload;

      if (!product) {
        toast.error('Product not found', {
          position: 'bottom-right',
          style: {
            background: '#ef4444', // Red for errors
            color: '#fff',
          },
        });
        return state;
      }

      const existingItemIndex = state.items.findIndex((item) => item.id === id);
      let updatedItems;

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [
          ...state.items,
          {
            ...product,
            quantity,
            addedAt: new Date().toISOString(),
          },
        ];
      }

      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: calculateTotal(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      if (!itemToRemove) return state;

      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );

      // Show removal notification
      toast.success(`${itemToRemove.name} removed from cart`, {
        position: 'bottom-right',
        style: {
          background: '#22c55e', // Green for success
          color: '#fff',
        },
      });

      return {
        ...state,
        items: filteredItems,
        itemCount: Math.max(0, state.itemCount - itemToRemove.quantity),
        total: calculateTotal(filteredItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: calculateTotal(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialState,
      };

    case 'LOAD_CART':
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

// Helper function to calculate cart totals
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    return total + itemTotal;
  }, 0);
};

// Calculate shipping based on total
const calculateShipping = (subtotal) => {
  if (subtotal === 0) return 0;
  return subtotal > 100 ? 0 : 9.99; // Free shipping over $100
};

// Calculate tax (example: 8% tax rate)
const calculateTax = (subtotal) => {
  return subtotal * 0.08;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (initialState) => {
      // Initialize with some sample items in the cart for demo purposes
      const withSampleItems = {
        ...initialState,
        items: [
          {
            ...initialState.products[0],
            quantity: 1,
            addedAt: new Date().toISOString(),
          },
          {
            ...initialState.products[1],
            quantity: 1,
            addedAt: new Date().toISOString(),
          },
        ],
      };

      return {
        ...withSampleItems,
        itemCount: withSampleItems.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        total: calculateTotal(withSampleItems.items),
      };
    }
  );

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    // Note: Toast notifications should be handled by the component calling this function
    // to prevent duplicate notifications
    return true; // Return true to indicate success
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    toast.success('Item removed from cart', {
      position: 'bottom-right',
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity: parseInt(quantity, 10) },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
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

// // src/contexts/CartContext.jsx
// import { createContext, useContext, useReducer, useEffect } from 'react';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       const existingItem = state.items.find(item => item.id === action.payload.id);
//       if (existingItem) {
//         return {
//           ...state,
//           items: state.items.map(item =>
//             item.id === action.payload.id
//               ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
//               : item
//           ),
//         };
//       }
//       return {
//         ...state,
//         items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
//       };

//     case 'REMOVE_FROM_CART':
//       return {
//         ...state,
//         items: state.items.filter(item => item.id !== action.payload),
//       };

//     case 'UPDATE_QUANTITY':
//       return {
//         ...state,
//         items: state.items.map(item =>
//           item.id === action.payload.id
//             ? { ...item, quantity: Math.max(1, action.payload.quantity) }
//             : item
//         ),
//       };

//     case 'CLEAR_CART':
//       return { ...state, items: [] };

//     default:
//       return state;
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, { items: [] });

//   // Load cart from localStorage on initial render
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     if (state.items.length > 0) {
//       localStorage.setItem('cart', JSON.stringify(state.items));
//     } else {
//       localStorage.removeItem('cart');
//     }
//   }, [state.items]);

//   const addToCart = (product) => {
//     dispatch({ type: 'ADD_TO_CART', payload: product });
//   };

//   const removeFromCart = (productId) => {
//     dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
//   };

//   const updateQuantity = (productId, quantity) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: 'CLEAR_CART' });
//   };

//   const cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
//   const cartTotal = state.items.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         items: state.items,
//         cartCount,
//         cartTotal,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
