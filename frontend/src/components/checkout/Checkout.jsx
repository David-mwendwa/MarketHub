// src/components/checkout/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/toast';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import ShippingMethod from './ShippingMethod';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState('shipping'); // 'shipping', 'payment', 'review'

  const handleSubmitOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send this data to your backend
      const order = {
        ...orderData,
        items: cart.items,
        total: cart.total,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        tax: cart.tax,
        orderNumber: `ORD-${Date.now()}`,
        status: 'processing',
        createdAt: new Date().toISOString(),
      };

      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.orderNumber}`, { 
        state: { order } 
      });
    } catch (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0 && activeStep === 'shipping') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button onClick={() => navigate('/shop')} startIcon={<ArrowLeft className="h-4 w-4" />}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Already have an account?</span>
                <Button variant="link" className="ml-1 text-sm" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              {activeStep === 'shipping' && (
                <CheckoutForm 
                  user={user} 
                  onSubmit={(data) => {
                    handleSubmitOrder(data);
                    // In a real app, you might validate the form here first
                    // setActiveStep('payment');
                  }}
                  isSubmitting={isSubmitting}
                />
              )}

              {activeStep === 'payment' && (
                <PaymentMethod
                  onBack={() => setActiveStep('shipping')}
                  onSubmit={() => setActiveStep('review')}
                />
              )}

              {activeStep === 'review' && (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveStep('payment')}
                    startIcon={<ArrowLeft className="h-4 w-4" />}
                    className="mb-6"
                  >
                    Back to Payment
                  </Button>
                  <OrderSummary 
                    items={cart.items} 
                    subtotal={cart.subtotal}
                    shipping={cart.shipping}
                    tax={cart.tax}
                    total={cart.total}
                    onSubmitOrder={handleSubmitOrder}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <OrderSummary 
              items={cart.items} 
              subtotal={cart.subtotal}
              shipping={cart.shipping}
              tax={cart.tax}
              total={cart.total}
              isCheckout
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;