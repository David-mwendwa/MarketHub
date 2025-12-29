import { paymentAPI } from '@/lib/api';

// Log the base URL and example endpoint
console.log('Payment Service: File loaded');

const paymentService = {
  /**
   * Get payment configuration
   * @returns {Promise<Object>} Payment configuration
   */
  async getConfig() {
    try {
      return await paymentAPI.getConfig();
    } catch (error) {
      console.error('Failed to fetch payment config:', error);
      throw error;
    }
  },

  /**
   * Get available payment methods
   * @returns {Promise<Array>} List of available payment methods
   */
  async getMethods() {
    try {
      const response = await paymentAPI.getPaymentMethods();
      return response.methods || [];
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw error;
    }
  },

  /**
   * Process card payment
   * @param {string} orderId - The order ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @returns {Promise<Object>} Payment result
   */
  async processCardPayment(orderId, paymentMethodId) {
    try {
      console.log('Processing card payment for order:', orderId);
      const response = await paymentAPI.processCardPayment(
        orderId,
        paymentMethodId
      );
      console.log('Card payment processed successfully:', response);
      return response;
    } catch (error) {
      console.error('Card payment failed:', error);
      throw error;
    }
  },

  /**
   * Process M-Pesa payment
   * @param {string} orderId - The order ID
   * @param {string} phone - Customer's phone number
   * @returns {Promise<Object>} Payment result
   */
  async processMpesaPayment(orderId, phone) {
    try {
      console.log('Processing M-Pesa payment for order:', orderId);
      const response = await paymentAPI.processMpesaPayment(orderId, phone);
      console.log('M-Pesa payment initiated successfully:', response);
      return response;
    } catch (error) {
      console.error('M-Pesa payment failed:', error);
      throw error;
    }
  },

  /**
   * Process PayPal payment
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} Payment result
   */
  async processPayPalPayment(orderId) {
    try {
      console.log('Processing PayPal payment for order:', orderId);
      const response = await paymentAPI.processPayPalPayment(orderId);
      console.log('PayPal payment processed successfully:', response);
      return response;
    } catch (error) {
      console.error('PayPal payment failed:', error);
      throw error;
    }
  },

  /**
   * Check payment status
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} Payment status
   */
  async checkStatus(orderId) {
    try {
      console.log('Checking payment status for order:', orderId);
      const response = await paymentAPI.checkStatus(orderId);
      console.log('Payment status checked successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  },
};

export default paymentService;
