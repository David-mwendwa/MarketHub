import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import paymentService from '../services/payment';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // Load payment configuration
  const loadPaymentConfig = useCallback(async () => {
    console.log('PaymentContext: Loading payment config...');
    setLoading(true);
    try {
      console.log('PaymentContext: Fetching config from payment service');
      const config = await paymentService.getConfig();
      console.log('PaymentContext: Received config:', config);
      setConfig(config);
      setError(null);
      return config;
    } catch (err) {
      const errorMsg = 'Failed to load payment configuration';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load available payment methods
  const loadPaymentMethods = useCallback(async () => {
    try {
      const methods = await paymentService.getMethods();
      setPaymentMethods(methods);
      return methods;
    } catch (err) {
      console.error('Failed to load payment methods:', err);
      toast.error('Failed to load payment methods');
      throw err;
    }
  }, []);

  // Process card payment
  const processCardPayment = useCallback(async (orderId, paymentMethodId) => {
    setIsProcessing(true);
    try {
      console.log('Processing card payment for order:', orderId);
      const result = await paymentService.processCardPayment(
        orderId,
        paymentMethodId
      );
      console.log('Card payment processed successfully:', result);
      return result;
    } catch (error) {
      console.error('Card payment failed:', error);
      toast.error(error.response?.data?.message || 'Card payment failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Process M-Pesa payment
  const processMpesaPayment = useCallback(async (orderId, phone) => {
    setIsProcessing(true);
    try {
      console.log('Processing M-Pesa payment for order:', orderId);
      const result = await paymentService.processMpesaPayment(orderId, phone);
      console.log('M-Pesa payment initiated successfully:', result);
      return result;
    } catch (error) {
      console.error('M-Pesa payment failed:', error);
      toast.error(error.response?.data?.message || 'M-Pesa payment failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Process PayPal payment
  const processPayPalPayment = useCallback(async (orderId) => {
    setIsProcessing(true);
    try {
      console.log('Processing PayPal payment for order:', orderId);
      const result = await paymentService.processPayPalPayment(orderId);
      console.log('PayPal payment processed successfully:', result);
      return result;
    } catch (error) {
      console.error('PayPal payment failed:', error);
      toast.error(error.response?.data?.message || 'PayPal payment failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Check payment status
  const checkPaymentStatus = useCallback(async (orderId) => {
    try {
      console.log('Checking payment status for order:', orderId);
      const status = await paymentService.checkStatus(orderId);
      console.log('Payment status checked successfully:', status);
      return status;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      toast.error('Failed to check payment status');
      throw error;
    }
  }, []);

  // Initial load
  useEffect(() => {
    console.log('PaymentContext: Initializing payment context');
    const init = async () => {
      console.log('PaymentContext: Starting initialization');
      try {
        await loadPaymentConfig();
        await loadPaymentMethods();
        console.log('PaymentContext: Initialization complete');
      } catch (error) {
        console.error('PaymentContext: Initialization error:', error);
      }
    };

    init();

    // Cleanup function
    return () => {
      console.log('PaymentContext: Cleaning up');
    };
  }, [loadPaymentConfig, loadPaymentMethods]);

  const value = {
    // State
    config,
    loading,
    error,
    paymentMethods,
    isProcessing,

    // Methods
    processCardPayment,
    processMpesaPayment,
    processPayPalPayment,
    checkPaymentStatus,
    loadPaymentConfig,
    loadPaymentMethods,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
