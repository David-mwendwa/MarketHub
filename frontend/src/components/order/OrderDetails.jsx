import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { Button } from '../ui/Button';
import OrderAddress from './OrderAddress';

const OrderDetails = () => {
  const { orderId } = useParams();
  // In a real app, you would fetch the order by ID from your API
  const order = {
    id: orderId,
    orderNumber: `ORD-${orderId}`,
    status: 'processing',
    createdAt: new Date().toISOString(),
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      brand: 'VISA',
    },
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'Nairobi',
      region: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      phone: '+254712345678',
      isDefault: true,
    },
    billingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'Nairobi',
      region: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      phone: '+254712345678',
      isDefault: true,
    },
    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };

  const statusIcons = {
    processing: <Clock className='h-5 w-5 text-yellow-500' />,
    shipped: <Truck className='h-5 w-5 text-blue-500' />,
    delivered: <CheckCircle className='h-5 w-5 text-green-500' />,
    cancelled: <XCircle className='h-5 w-5 text-red-500' />,
  };

  const statusText = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <Button
          as={Link}
          to='/account/orders'
          variant='ghost'
          startIcon={<ArrowLeft className='h-4 w-4' />}
          className='mb-6'>
          Back to Orders
        </Button>

        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Order #{order.orderNumber}
            </h1>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className='flex items-center'>
            <span className='mr-2'>
              {statusIcons[order.status] || (
                <Package className='h-5 w-5 text-gray-400' />
              )}
            </span>
            <span className='text-sm font-medium text-gray-900 dark:text-white'>
              {statusText[order.status] || 'Order Status'}
            </span>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8'>
        <div className='px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
            Order Items
          </h3>
        </div>
        <div className='px-4 py-5 sm:p-6'>
          {order.items.length > 0 ? (
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

              <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
                <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2'>
                  <p>Subtotal</p>
                  <p>{formatCurrency(order.subtotal)}</p>
                </div>
                <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2'>
                  <p>Shipping</p>
                  <p>
                    {order.shipping === 0
                      ? 'Free'
                      : formatCurrency(order.shipping)}
                  </p>
                </div>
                <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2'>
                  <p>Tax</p>
                  <p>{formatCurrency(order.tax)}</p>
                </div>
                <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                  <p>Total</p>
                  <p>{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <Package className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                No items in this order
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                We couldn't find any items in this order.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <OrderAddress
          address={order.shippingAddress}
          title='Shipping Information'
        />
        <OrderAddress
          address={order.billingAddress}
          title='Billing Address'
          className='lg:order-last'
        />

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            Payment Information
          </h3>
          <div className='flex items-center'>
            <CreditCard className='h-6 w-6 text-gray-400 mr-3' />
            <div>
              <p className='text-gray-900 dark:text-white font-medium'>
                {order.paymentMethod?.type} ending in{' '}
                {order.paymentMethod?.last4}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {order.paymentMethod?.brand}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Expires {String(order.paymentMethod?.expMonth).padStart(2, '0')}
                /{order.paymentMethod?.expYear}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300 mt-4'>
                <span className='font-medium'>Billing Address:</span> Same as
                shipping address
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
