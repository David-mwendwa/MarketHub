import { paymentAPI } from '@/lib/api';

// Log the base URL and example endpoint
console.log('Payment Service: File loaded');

const paymentService = {
  // Get payment configuration
  async getConfig() {
    try {
      return await paymentAPI.getConfig();
    } catch (error) {
      console.error('Failed to fetch payment config:', error);
      throw error;
    }
  },

  // Get available payment methods
  async getMethods() {
    try {
      const response = await paymentAPI.getPaymentMethods();
      return response.methods || [];
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw error;
    }
  },

  // Initialize payment
  async initializePayment(orderId, paymentMethod, details = {}) {
    try {
      console.log('Payment Service: Initializing payment with:', {
        orderId,
        paymentMethod,
        details,
      });

      const response = await paymentAPI.initializePayment(
        orderId,
        paymentMethod,
        details
      );

      console.log(
        'Payment Service: Payment initialized successfully',
        response
      );
      return response;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  },

  // Check payment status
  async checkStatus(orderId) {
    try {
      return await paymentAPI.checkStatus(orderId);
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  },

  // Process card payment
  async processCardPayment(orderId, paymentMethodId) {
    return this.initializePayment(orderId, 'card', { paymentMethodId });
  },

  // Process M-Pesa payment
  async processMpesaPayment(orderId, phone, amount) {
    return this.initializePayment(orderId, 'mpesa', { phone, amount });
  },

  // Process PayPal payment
  async processPayPalPayment(orderId, amount) {
    return this.initializePayment(orderId, 'paypal', { amount });
  },

  // Save payment method (legacy support)
  async saveMethod(methodData) {
    console.warn(
      'saveMethod is deprecated. Use initializePayment with save_card flag instead.'
    );
    return this.initializePayment(null, 'card', {
      paymentMethodId: methodData.paymentMethodId,
      save_card: true,
    });
  },
};

export default paymentService;
