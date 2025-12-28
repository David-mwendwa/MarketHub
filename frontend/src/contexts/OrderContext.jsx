import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import orderService from '../services/order';
import { useAuth } from './AuthContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Create a new order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await orderService.createOrder(orderData);
      setCurrentOrder(newOrder);
      return newOrder;
    } catch (err) {
      console.error('Failed to create order:', err);
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order by ID
  const getOrderById = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrderById(orderId);
      setCurrentOrder(order);
      return order;
    } catch (err) {
      console.error(`Failed to fetch order ${orderId}:`, err);
      setError(err.response?.data?.message || 'Failed to fetch order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's orders
  const fetchUserOrders = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);
    try {
      const userOrders = await orderService.getUserOrders(user._id);
      setOrders(userOrders);
      return userOrders;
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial data loading
  useEffect(() => {
    if (user?._id) {
      fetchUserOrders();
    }
  }, [user?._id, fetchUserOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        createOrder,
        getOrderById,
        fetchUserOrders,
        clearCurrentOrder,
        clearError,
      }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
