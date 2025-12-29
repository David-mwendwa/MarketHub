import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  Home,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const order = state?.order || {
    orderNumber: 'ORD-123456',
    status: 'Processing',
    items: [],
    shipping: 0,
    tax: 0,
    total: 0,
    shippingAddress: {},
    paymentMethod: {},
    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };

  if (!state?.order) {
    // In a real app, you might want to fetch the order by ID from the URL
    console.warn(
      'No order data found. This page should be accessed after a successful checkout.'
    );
  }

  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className='max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <CheckCircle className='mx-auto h-16 w-16 text-green-500' />
        <h1 className='mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl'>
          Order Confirmed!
        </h1>
        <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
          Thank you for your order, {user?.name?.split(' ')[0] || 'there'}!
          <span className='block font-medium'>Order #{order.orderNumber}</span>
        </p>
        <p className='mt-2 text-gray-500 dark:text-gray-400'>
          We've sent a confirmation email to{' '}
          {user?.email || 'your email address'}.
        </p>

        <div className='mt-8 flex flex-col sm:flex-row justify-center gap-4'>
          <Button
            onClick={() => navigate(ROUTES.DASHBOARD.BUYER + '/orders')}
            variant='outline'
            className='inline-flex items-center gap-2'>
            View Order History
            <ArrowRight className='h-4 w-4' />
          </Button>
          <Button
            onClick={() => navigate(ROUTES.HOME)}
            variant='default'
            className='inline-flex items-center gap-2'>
            <Home className='h-4 w-4' />
            Back to Home
          </Button>
        </div>
      </div>

      <div className='mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Order Summary */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
            Order Summary
          </h2>

          <div className='space-y-6'>
            {order.items.map((item) => (
              <div key={item.id} className='flex items-center'>
                <div className='flex-shrink-0 w-20 h-20 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700'>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover object-center'
                    />
                  )}
                </div>
                <div className='ml-4 flex-1'>
                  <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
                    <h3>{item.name}</h3>
                    <p className='ml-4'>{formatCurrency(item.price)}</p>
                  </div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Qty {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className='border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2'>
              <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300'>
                <p>Subtotal</p>
                <p>{formatCurrency(order.subtotal || 0)}</p>
              </div>
              <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300'>
                <p>Shipping</p>
                <p>
                  {order.shipping === 0
                    ? 'Free'
                    : formatCurrency(order.shipping)}
                </p>
              </div>
              <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300'>
                <p>Tax</p>
                <p>{formatCurrency(order.tax || 0)}</p>
              </div>
              <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700 mt-2'>
                <p>Total</p>
                <p>{formatCurrency(order.total || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className='space-y-6'>
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Order Status
            </h2>

            <div className='space-y-4'>
              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <Package className='h-6 w-6 text-primary-600 dark:text-primary-400' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    Order {order.status}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Your order has been received and is being processed.
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <Clock className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    Estimated Delivery
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <Truck className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    Shipping to
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {order.shippingAddress?.fullName}
                    <br />
                    {order.shippingAddress?.address}
                    <br />
                    {order.shippingAddress?.apartment &&
                      `${order.shippingAddress.apartment}, `}
                    {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.state}{' '}
                    {order.shippingAddress?.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              What's next?
            </h2>
            <div className='space-y-4'>
              <div className='flex items-start'>
                <div className='flex-shrink-0 mt-0.5'>
                  <Truck className='h-5 w-5 text-gray-400' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    You'll receive shipping and tracking details via email when
                    your order ships.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='flex-shrink-0 mt-0.5'>
                  <Clock className='h-5 w-5 text-gray-400' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Your order will be processed within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='flex-shrink-0 mt-0.5'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Need help?{' '}
                    <a
                      href='mailto:support@example.com'
                      className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'>
                      Contact our support team
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-6'>
              <Button
                as={Link}
                to='/shop'
                className='w-full'
                variant='outline'
                startIcon={<ShoppingCart className='h-4 w-4' />}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
