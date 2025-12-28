import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Loader2,
  ArrowLeft,
  Shield,
  Truck,
  Lock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  Package,
  Headphones,
  ShoppingBag,
  Tag,
} from 'lucide-react';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Get the full cart state
  const cartState = useCart() || {};

  // Get cart items with fallback
  const cartItems = cartState.cartItems || cartState.items || [];

  // Destructure with proper fallbacks
  const {
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
    itemCount = 0,
    clearCart,
    hasOrderProtection = false,
    toggleOrderProtection,
    orderProtection = 0,
  } = cartState;

  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { profile, isLoading: isUserLoading } = useUser();

  // Set loading to false when user and profile are loaded
  useEffect(() => {
    if (!isAuthLoading && !isUserLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoading, isUserLoading]);

  // Get default address if available
  const defaultAddress = profile?.user?.addresses?.find(
    (addr) => addr.isDefault
  );
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && itemCount === 0) {
      navigate('/cart');
    }
  }, [cartItems, itemCount, navigate]);

  // Calculate delivery date (2-4 business days from now)
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 3) + 2);
    setEstimatedDelivery(format(deliveryDate, 'EEEE, MMMM d, yyyy'));
  }, []);

  const steps = [
    { id: 1, name: 'Shipping', status: 'current' },
    { id: 2, name: 'Payment', status: 'upcoming' },
    { id: 3, name: 'Review', status: 'upcoming' },
  ];

  const handleSubmitOrder = async (orderData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 20% chance of error for demonstration
          if (Math.random() < 0.2) {
            reject(new Error('Payment processing failed. Please try again.'));
          } else {
            resolve();
          }
        }, 1500);
      });

      const order = {
        ...orderData,
        items: cartItems,
        orderNumber: `ORD-${Date.now()}`,
        status: 'processing',
        createdAt: new Date().toISOString(),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
      };

      // Clear cart on successful order
      clearCart();

      // Navigate to order confirmation
      navigate('/order-confirmation', {
        state: { order },
        replace: true,
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      setError(
        error.message || 'Failed to process your order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthLoading || isUserLoading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-40'>
          <LoadingSpinner size='xl' centered />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl'>
              Secure Checkout
            </h1>
            <p className='mt-3 text-lg text-gray-500 dark:text-gray-400'>
              Sign in or continue as guest to complete your purchase
            </p>
          </div>

          <div className='bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden'>
            <div className='p-8 sm:p-10'>
              <div className='flex flex-col items-center text-center'>
                <div className='w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6'>
                  <Lock className='h-10 w-10 text-blue-600 dark:text-blue-400' />
                </div>

                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  Sign in for a better experience
                </h2>
                <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-md'>
                  Sign in to save your shipping details, track orders, and enjoy
                  a faster checkout experience.
                </p>

                <div className='w-full max-w-xs space-y-4'>
                  <Button
                    as={Link}
                    to='/login'
                    state={{ from: '/checkout' }}
                    className='w-full justify-center py-3 px-6 text-base font-medium'>
                    Sign In to Your Account
                  </Button>

                  <Button
                    as={Link}
                    to='/register'
                    variant='outline'
                    state={{ from: '/checkout' }}
                    className='w-full justify-center py-3 px-6 text-base font-medium'>
                    Create an Account
                  </Button>
                </div>

                <div className='relative w-full my-8'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-200 dark:border-gray-700'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                      Or continue as guest
                    </span>
                  </div>
                </div>

                <Button
                  as={Link}
                  to='/checkout/guest'
                  variant='ghost'
                  className='w-full max-w-xs justify-center py-3 px-6 text-base font-medium'>
                  Continue as Guest
                </Button>
              </div>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-t border-gray-100 dark:border-gray-700'>
              <div className='flex items-center justify-center space-x-6'>
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                  <Shield className='h-5 w-5 text-green-500 mr-2' />
                  <span>Secure Checkout</span>
                </div>
                <div className='h-5 w-px bg-gray-200 dark:bg-gray-600'></div>
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                  <Lock className='h-5 w-5 text-blue-500 mr-2' />
                  <span>256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden'>
          <div className='p-8 sm:p-10 text-center'>
            <div className='mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6'>
              <ShoppingBag className='h-10 w-10 text-amber-600 dark:text-amber-400' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
              Your cart is empty
            </h2>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              Looks like you haven't added anything to your cart yet. Let's find
              something special for you!
            </p>
            <div className='space-y-3'>
              <Button
                as={Link}
                to='/shop'
                className='w-full justify-center py-3 px-6 text-base font-medium bg-primary-600 hover:bg-primary-700'>
                Continue Shopping
              </Button>
              <Button
                as={Link}
                to='/deals'
                variant='outline'
                className='w-full justify-center py-3 px-6 text-base font-medium'>
                <Tag className='h-5 w-5 mr-2 text-rose-500' />
                View Today's Deals
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-10'>
          <Button
            as={Link}
            to='/cart'
            variant='ghost'
            size='sm'
            className='text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mb-4 -ml-2'>
            <ArrowLeft className='h-5 w-5 mr-1.5' />
            Back to Cart
          </Button>

          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl'>
                Checkout
              </h1>
              <p className='mt-2 text-lg text-gray-500 dark:text-gray-400'>
                Complete your purchase in just a few steps
              </p>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700'>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <Lock className='h-5 w-5 text-blue-500' />
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      Secure Checkout
                    </span>
                  </div>
                  <div className='h-5 w-px bg-gray-200 dark:bg-gray-600' />
                  <div className='flex items-center space-x-1'>
                    {['visa', 'mastercard', 'mpesa', 'paypal'].map((type) => (
                      <div
                        key={type}
                        className='h-5 w-8 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center'>
                        <img
                          src={
                            type === 'visa'
                              ? '/src/assets/images/visa-logo.svg'
                              : type === 'mastercard'
                                ? '/src/assets/images/mastercard-logo.svg'
                                : type === 'mpesa'
                                  ? '/src/assets/images/mpesa-logo.svg'
                                  : '/src/assets/images/paypal-logo.svg'
                          }
                          alt={type}
                          className='h-3 w-auto opacity-70'
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/40/2A2A2A/FFFFFF?text=${type.toUpperCase()}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className='mt-8'>
            <nav aria-label='Progress'>
              <ol className='flex items-center'>
                {steps.map((step, stepIdx) => (
                  <li
                    key={step.name}
                    className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''} relative`}>
                    {stepIdx < steps.length - 1 && (
                      <div
                        className='absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-200 dark:bg-gray-700'
                        aria-hidden='true'
                      />
                    )}
                    <div className='group relative flex items-start'>
                      <span className='flex h-9 items-center'>
                        <span
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            step.status === 'current'
                              ? 'bg-primary-600 border-2 border-primary-600'
                              : step.status === 'complete'
                                ? 'bg-green-100 border-2 border-green-500 dark:bg-green-900/30 dark:border-green-600'
                                : 'bg-white border-2 border-gray-300 group-hover:border-gray-400 dark:bg-gray-700 dark:border-gray-600'
                          }`}>
                          {step.status === 'complete' ? (
                            <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                          ) : step.status === 'current' ? (
                            <span className='h-2.5 w-2.5 rounded-full bg-white' />
                          ) : (
                            <span className='h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300' />
                          )}
                        </span>
                      </span>
                      <span className='ml-4 flex min-w-0 flex-col'>
                        <span
                          className={`text-sm font-medium ${
                            step.status === 'current'
                              ? 'text-primary-600 dark:text-primary-400'
                              : step.status === 'complete'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                          }`}>
                          {step.name}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <AlertCircle className='h-5 w-5 text-red-500' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-red-700 dark:text-red-300'>
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          {/* Left Column - Checkout Form */}
          <div className='lg:col-span-7 space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
              <div className='p-6 sm:p-8'>
                <div className='flex items-center mb-6'>
                  <div className='flex-shrink-0 h-12 w-12 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center'>
                    <CreditCard className='h-6 w-6 text-primary-600 dark:text-primary-400' />
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                      Payment Information
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Complete your purchase with a secure payment
                    </p>
                  </div>
                </div>
                <CheckoutForm
                  onSubmit={handleSubmitOrder}
                  isSubmitting={isSubmitting}
                  user={user}
                  defaultAddress={defaultAddress}
                />
              </div>
            </motion.div>

            {/* Order Protection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
              <div className='p-6 sm:p-8'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center'>
                    <Shield className='h-6 w-6 text-green-600 dark:text-green-400' />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                      Order Protection
                    </h3>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                      Protect your order against damage, loss, or theft for just
                      Ksh 500
                    </p>
                    <div className='mt-3 flex items-center'>
                      <input
                        id='order-protection'
                        name='order-protection'
                        type='checkbox'
                        checked={hasOrderProtection}
                        onChange={toggleOrderProtection}
                        className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-600 dark:focus:ring-primary-500'
                      />
                      <label
                        htmlFor='order-protection'
                        className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Add Order Protection (+Ksh 500)
                      </label>
                    </div>
                    {hasOrderProtection && (
                      <p className='mt-2 text-xs text-green-600 dark:text-green-400'>
                        Your order is protected against damage, loss, or theft.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary (Desktop) */}
          <div className='hidden lg:block lg:col-span-5'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='sticky top-6'>
              <OrderSummary
                key={`desktop-summary-${hasOrderProtection}`}
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                hasOrderProtection={hasOrderProtection}
                orderProtection={orderProtection}
                isCheckout={true}
              />

              {/* Delivery Estimate */}
              <div className='mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
                <div className='p-6'>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center'>
                      <Truck className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='ml-4'>
                      <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                        Estimated Delivery
                      </h3>
                      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                        {estimatedDelivery}
                      </p>
                      <p className='mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center'>
                        <Clock className='h-3.5 w-3.5 mr-1.5' />
                        Order within the next 3 hours for same-day processing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Checkout */}
              <div className='mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
                <div className='p-6'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center'>
                      <Lock className='h-5 w-5 text-green-600 dark:text-green-400' />
                    </div>
                    <div className='ml-4'>
                      <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                        Secure Checkout
                      </h3>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>

                  <div className='mt-4 flex justify-center space-x-6'>
                    {['visa', 'mastercard', 'mpesa', 'paypal'].map((type) => (
                      <div
                        key={type}
                        className='h-6 w-10 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center'>
                        <img
                          src={
                            type === 'visa'
                              ? '/src/assets/images/visa-logo.svg'
                              : type === 'mastercard'
                                ? '/src/assets/images/mastercard-logo.svg'
                                : type === 'mpesa'
                                  ? '/src/assets/images/mpesa-logo.svg'
                                  : '/src/assets/images/paypal-logo.svg'
                          }
                          alt={type}
                          className='h-4 w-auto opacity-70'
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/40/2A2A2A/FFFFFF?text=${type.toUpperCase()}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
