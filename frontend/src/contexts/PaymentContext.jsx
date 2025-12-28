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

  // Load user's payment methods
  const loadPaymentMethods = useCallback(async () => {
    if (!user) return;

    try {
      const methods = await paymentService.getMethods();
      setPaymentMethods(methods);
      return methods;
    } catch (err) {
      console.error('Failed to load payment methods:', err);
      toast.error('Failed to load payment methods');
      throw err;
    }
  }, [user]);

  // Initialize payment
  const initializePayment = useCallback(
    async (orderId, paymentMethod, details = {}) => {
      console.log('PaymentContext: Initializing payment with:', {
        orderId,
        paymentMethod,
        details,
      });
      setIsProcessing(true);
      try {
        console.log('PaymentContext: Calling paymentService.initializePayment');
        const result = await paymentService.initializePayment(
          orderId,
          paymentMethod,
          details
        );
        console.log('PaymentContext: Payment initialized successfully', result);
        return result;
      } catch (err) {
        console.error(`Payment initialization failed (${paymentMethod}):`, err);
        toast.error(
          err.response?.data?.message || 'Payment initialization failed'
        );
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Process payment (legacy support)
  const processPayment = useCallback(async (type, data) => {
    try {
      console.log('Processing payment with type:', type, 'and data:', data);
      switch (type) {
        case 'mpesa':
          return await paymentService.processMpesaPayment(
            data.orderId,
            data.phone,
            data.amount
          );
        case 'card':
          return await paymentService.processCardPayment(
            data.orderId,
            data.paymentMethodId
          );
        case 'paypal':
          return await paymentService.processPayPalPayment(
            data.orderId,
            data.amount
          );
        default:
          throw new Error(`Unsupported payment method: ${type}`);
      }
    } catch (error) {
      console.error(`Payment error (${type}):`, error);
      toast.error(error.response?.data?.message || `Payment error (${type})`);
      throw error;
    }
  }, []);

  // Save payment method
  const savePaymentMethod = useCallback(
    async (methodData) => {
      try {
        const method = await paymentService.saveMethod(methodData);
        await loadPaymentMethods(); // Refresh payment methods
        return method;
      } catch (err) {
        console.error('Failed to save payment method:', err);
        toast.error('Failed to save payment method');
        throw err;
      }
    },
    [loadPaymentMethods]
  );

  // Check payment status
  const checkPaymentStatus = useCallback(async (orderId) => {
    try {
      return await paymentService.checkStatus(orderId);
    } catch (err) {
      console.error('Failed to check payment status:', err);
      toast.error('Failed to check payment status');
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    console.log('PaymentContext: Initializing payment context');
    const init = async () => {
      console.log('PaymentContext: Starting initialization');
      try {
        await loadPaymentConfig();
        if (user) {
          console.log('PaymentContext: User detected, loading payment methods');
          await loadPaymentMethods();
        } else {
          console.log(
            'PaymentContext: No user detected, skipping payment methods'
          );
        }
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
  }, [user, loadPaymentConfig, loadPaymentMethods]);

  const value = {
    // State
    config,
    loading,
    error,
    paymentMethods,
    isProcessing,

    // Methods
    initializePayment,
    processPayment, // Legacy support
    savePaymentMethod,
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
