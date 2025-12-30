import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// UI Components
import { Button } from '../../../components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/UICard';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Context
import { useOrder } from '../../../contexts/OrderContext';

// Constants & Utils
import { ROUTES } from '../../../constants/routes';
import { formatCurrency, formatDate } from '../../../lib/utils';

// Status mapping for orders
const statuses = {
  pending: {
    label: 'Pending',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  shipped: {
    label: 'Shipped',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

const Orders = () => {
  const { orders, loading, error, fetchUserOrders } = useOrder();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  // Fetch orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log('Fetching orders...');
        const ordersData = await fetchUserOrders();
        console.log('Orders fetched successfully:', ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          navigate(ROUTES.LOGIN);
        } else {
          toast.error('Failed to load orders. Please try again.');
        }
      }
    };

    loadOrders();
  }, [fetchUserOrders, navigate]);

  // Log when orders change
  useEffect(() => {
    console.log('Orders updated:', orders);
  }, [orders]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-2'>Loading your orders...</span>
      </div>
    );
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getOrderStatus = (status) => {
    const statusInfo = statuses[status?.toLowerCase()] || {
      label: status || 'Unknown',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return (
      <Badge className={`${statusInfo.color} capitalize`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentMethod = (payment) => {
    if (!payment) return 'N/A';

    if (payment.method === 'paypal') {
      return 'PayPal';
    } else if (payment.method === 'stripe') {
      const last4 = payment.paymentMethodDetails?.last4;
      return `Card ending in ${last4 || '****'}`;
    } else if (payment.method === 'bank_transfer') {
      return 'Bank Transfer';
    } else if (payment.method === 'cod') {
      return 'Cash on Delivery';
    }

    return payment.method || 'N/A';
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Orders</h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            View and track your order history
          </p>
        </div>
      </div>

      {/* Order Filters */}
      <div className='flex flex-wrap gap-2'>
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setActiveFilter('all')}>
          All Orders
        </Button>
        {Object.entries(statuses).map(([key, { label }]) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'default' : 'outline'}
            size='sm'
            onClick={() => setActiveFilter(key)}>
            {label}
          </Button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className='text-center py-12 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.5}>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            {activeFilter === 'all'
              ? "You haven't placed any orders yet"
              : `No ${activeFilter} orders found`}
          </h3>
          <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto'>
            {activeFilter === 'all'
              ? "Your order history will appear here once you've made a purchase."
              : `You don't have any ${activeFilter} orders at the moment.`}
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-3'>
            {activeFilter !== 'all' && (
              <Button
                variant='outline'
                onClick={() => setActiveFilter('all')}
                className='w-full sm:w-auto'>
                View All Orders
              </Button>
            )}
            <Button
              variant='outline'
              className='w-full sm:w-auto flex items-center justify-center'>
              <Link to={ROUTES.SHOP} className='flex items-center'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order) => (
            <Card key={order.id} className='overflow-hidden'>
              <div className='border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-col sm:flex-row sm:items-baseline sm:space-x-3'>
                      <h3 className='text-base font-semibold text-gray-900 dark:text-white truncate'>
                        {order.orderNumber ||
                          `Order #${order.id?.substring(0, 8)}`}
                      </h3>
                      <div className='flex items-center mt-1 sm:mt-0'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                              : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                                : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                          {order.status
                            ? order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)
                            : 'Processing'}
                        </span>
                      </div>
                    </div>
                    <div className='mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-4 text-sm text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center mt-1'>
                        <svg
                          className='flex-shrink-0 mr-1.5 h-4 w-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        Placed on{' '}
                        {formatDate(
                          order.createdAt || order.date,
                          'MMM D, YYYY'
                        )}
                      </div>
                      {order.deliveryDate && (
                        <div className='flex items-center mt-1'>
                          <svg
                            className='flex-shrink-0 mr-1.5 h-4 w-4 text-green-500'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          Delivered{' '}
                          {formatDate(order.deliveryDate, 'MMM D, YYYY')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-right hidden sm:block'>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Total
                      </div>
                      <div className='text-base font-semibold text-gray-900 dark:text-white'>
                        {formatCurrency(order.total?.amount ?? order.total)}
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1.5 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200'
                      onClick={() => toggleOrderDetails(order.id)}>
                      {expandedOrder === order.id ? (
                        <>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 15l7-7 7 7'
                            />
                          </svg>
                          Hide Details
                        </>
                      ) : (
                        <>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mobile total - only shown on small screens */}
                <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 sm:hidden'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Order Total
                    </span>
                    <span className='text-base font-semibold text-gray-900 dark:text-white'>
                      {formatCurrency(order.total?.amount ?? order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className='p-4 bg-gray-50 dark:bg-gray-800/50'>
                  <div className='grid gap-6 md:grid-cols-2'>
                    {/* Order Items */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700'>
                      <div className='flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700'>
                        <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          Order Items
                        </h4>
                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                          {order.items.length}{' '}
                          {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>

                      <div className='space-y-4'>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                            <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
                              <img
                                src={
                                  item.image ||
                                  '/images/placeholder-product.png'
                                }
                                alt={item.name}
                                className='h-full w-full object-contain p-1.5'
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    'https://via.placeholder.com/80?text=No+Image';
                                }}
                              />
                              {item.quantity > 1 && (
                                <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                                  {item.quantity}
                                </span>
                              )}
                            </div>

                            <div className='ml-4 flex-1 min-w-0'>
                              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                                <div className='flex-1 min-w-0'>
                                  <h3 className='text-base font-medium text-gray-900 dark:text-white truncate'>
                                    {item.name}
                                  </h3>
                                  {item.sku && (
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                      SKU: {item.sku}
                                    </p>
                                  )}
                                </div>

                                <div className='mt-2 sm:mt-0 sm:ml-4 text-right'>
                                  <p className='text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap'>
                                    {formatCurrency(
                                      item.price?.amount ?? item.price
                                    )}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                      {item.quantity} ×{' '}
                                      {formatCurrency(
                                        (item.price?.amount ?? item.price) /
                                          item.quantity
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {item.variants && (
                                <div className='mt-2 flex flex-wrap gap-2'>
                                  {Object.entries(item.variants).map(
                                    ([key, value]) => (
                                      <span
                                        key={key}
                                        className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                                        <span className='text-gray-500 dark:text-gray-400 mr-1'>
                                          {key}:
                                        </span>{' '}
                                        {value}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}

                              {item.status && (
                                <div className='mt-2'>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      item.status === 'shipped'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        : item.status === 'delivered'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }`}>
                                    {item.status.charAt(0).toUpperCase() +
                                      item.status.slice(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6 border border-gray-100 dark:border-gray-700'>
                      <div>
                        <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-700'>
                          Order Summary
                        </h4>
                        <div className='space-y-4'>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-3'>
                              <div>
                                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                  Order Status
                                </p>
                                <div className='flex items-center'>
                                  {getOrderStatus(order.status)}
                                </div>
                              </div>

                              <div>
                                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                  Order Date
                                </p>
                                <p className='text-sm text-gray-900 dark:text-gray-200'>
                                  {formatDate(order.createdAt, 'll')}
                                </p>
                              </div>

                              {order.orderNumber && (
                                <div>
                                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                    Order #
                                  </p>
                                  <p className='text-sm font-mono text-gray-900 dark:text-gray-200'>
                                    {order.orderNumber}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className='space-y-3'>
                              {order.trackingNumber && (
                                <div>
                                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                    Tracking
                                  </p>
                                  <a
                                    href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 hover:underline dark:text-blue-400 text-sm inline-flex items-center'>
                                    {order.trackingNumber}
                                    <svg
                                      className='w-3.5 h-3.5 ml-1'
                                      fill='currentColor'
                                      viewBox='0 0 20 20'
                                      xmlns='http://www.w3.org/2000/svg'>
                                      <path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
                                      <path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
                                    </svg>
                                  </a>
                                </div>
                              )}

                              <div>
                                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                  Payment Method
                                </p>
                                <p className='text-sm text-gray-900 dark:text-gray-200'>
                                  {getPaymentMethod(order.payment)}
                                </p>
                              </div>

                              <div>
                                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                  Payment Status
                                </p>
                                <div className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                                  {order.payment?.status || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                            <h5 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                              Shipping Address
                            </h5>
                            <address className='not-italic text-sm text-gray-700 dark:text-gray-300 space-y-1'>
                              {order.shippingAddress ? (
                                <>
                                  <p className='font-medium text-gray-900 dark:text-white'>
                                    {order.shippingAddress.fullName}
                                  </p>
                                  <p>{order.shippingAddress.street}</p>
                                  {order.shippingAddress.street2 && (
                                    <p>{order.shippingAddress.street2}</p>
                                  )}
                                  <p>
                                    {order.shippingAddress.city},{' '}
                                    {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.postalCode}
                                  </p>
                                  <p>{order.shippingAddress.country}</p>
                                  {order.shippingAddress.phone && (
                                    <p className='mt-2 text-gray-600 dark:text-gray-400'>
                                      <span className='font-medium'>
                                        Phone:
                                      </span>{' '}
                                      {order.shippingAddress.phone}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className='text-gray-500 dark:text-gray-400'>
                                  No shipping address provided
                                </p>
                              )}
                            </address>
                          </div>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                          <div className='flex justify-between items-center'>
                            <span className='text-base font-semibold text-gray-900 dark:text-white'>
                              Order Total
                            </span>
                            <span className='text-lg font-bold text-gray-900 dark:text-white'>
                              {formatCurrency(
                                typeof order.total === 'object'
                                  ? order.total.amount
                                  : order.total
                              )}
                            </span>
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                          {(order.status === 'shipped' ||
                            order.status === 'delivered') &&
                            order.trackingNumber && (
                              <Button
                                variant='outline'
                                size='sm'
                                className='flex items-center gap-1.5'
                                asChild>
                                <a
                                  href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                                  target='_blank'
                                  rel='noopener noreferrer'>
                                  <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                    />
                                  </svg>
                                  Track Package
                                </a>
                              </Button>
                            )}

                          <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-1.5 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200'
                            onClick={() =>
                              toast('Invoice download will be available soon.')
                            }>
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                            View Invoice
                          </Button>

                          {['pending', 'processing'].includes(order.status) && (
                            <Button
                              variant='outline'
                              size='sm'
                              className='text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30 flex items-center gap-1.5'
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    'Are you sure you want to cancel this order?'
                                  )
                                ) {
                                  try {
                                    await orderService.cancelOrder(order._id);
                                    setOrders((prevOrders) =>
                                      prevOrders.map((o) =>
                                        o._id === order._id
                                          ? { ...o, status: 'cancelled' }
                                          : o
                                      )
                                    );
                                    toast.success(
                                      'Your order has been cancelled successfully.'
                                    );
                                  } catch (error) {
                                    console.error(
                                      'Error cancelling order:',
                                      error
                                    );
                                    toast.error(
                                      'Failed to cancel order. Please try again.'
                                    );
                                  }
                                }
                              }}>
                              <svg
                                className='w-4 h-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M6 18L18 6M6 6l12 12'
                                />
                              </svg>
                              Cancel Order
                            </Button>
                          )}

                          {order.status === 'delivered' && (
                            <Button
                              variant='outline'
                              size='sm'
                              className='flex items-center gap-1.5'
                              onClick={() =>
                                toast(
                                  'Return functionality will be available soon.'
                                )
                              }>
                              <svg
                                className='w-4 h-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                />
                              </svg>
                              Return Items
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
