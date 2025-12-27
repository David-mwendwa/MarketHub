import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ArrowLeft } from 'lucide-react';

// Constants
import { ROUTES } from '../../../constants/routes';

// Mock data - replace with actual API calls
const orders = [
  {
    id: 'ORD-1001',
    date: '2023-06-15',
    status: 'delivered',
    items: [
      {
        name: 'Wireless Headphones',
        quantity: 1,
        price: 99.99,
        image: '/images/headphones.jpg',
      },
      {
        name: 'Phone Stand',
        quantity: 2,
        price: 24.99,
        image: '/images/phone-stand.jpg',
      },
    ],
    total: 149.97,
    shippingAddress: '123 Main St, Anytown, CA 12345',
    paymentMethod: 'Visa ending in 4242',
    trackingNumber: '1Z999AA1234567890',
  },
  {
    id: 'ORD-1002',
    date: '2023-06-10',
    status: 'shipped',
    items: [
      {
        name: 'Smart Watch',
        quantity: 1,
        price: 199.99,
        image: '/images/smart-watch.jpg',
      },
    ],
    total: 199.99,
    shippingAddress: '456 Oak Ave, Somewhere, CA 98765',
    paymentMethod: 'Mastercard ending in 5555',
    trackingNumber: '1Z888BB9876543210',
  },
  {
    id: 'ORD-1003',
    date: '2023-06-05',
    status: 'processing',
    items: [
      {
        name: 'Bluetooth Speaker',
        quantity: 1,
        price: 79.99,
        image: '/images/speaker.jpg',
      },
      {
        name: 'USB-C Cable',
        quantity: 2,
        price: 15.99,
        image: '/images/usb-cable.jpg',
      },
    ],
    total: 111.97,
    shippingAddress: '789 Pine Rd, Nowhere, CA 54321',
    paymentMethod: 'PayPal',
    trackingNumber: null,
  },
  {
    id: 'ORD-1004',
    date: '2023-05-28',
    status: 'cancelled',
    items: [
      {
        name: 'Wireless Earbuds',
        quantity: 1,
        price: 129.99,
        image: '/images/earbuds.jpg',
      },
    ],
    total: 129.99,
    shippingAddress: '321 Elm St, Anywhere, CA 13579',
    paymentMethod: 'Visa ending in 1234',
    trackingNumber: null,
    cancellationReason: 'Changed my mind',
  },
];

const statuses = {
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  shipped: {
    label: 'Shipped',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getOrderStatus = (status) => {
    const statusInfo = statuses[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Orders</h2>
          <p className='text-muted-foreground'>
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
        <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
          </div>
          <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
            No orders found
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
            {activeFilter === 'all'
              ? "You haven't placed any orders yet."
              : `You don't have any ${activeFilter} orders.`}
          </p>
          <Button
            asChild
            variant='default'
            size='sm'
            className='inline-flex items-center'>
            <Link to={ROUTES.SHOP}>
              <ArrowLeft className='h-3.5 w-3.5 mr-1.5' />
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order) => (
            <Card key={order.id} className='overflow-hidden'>
              <div className='border-b p-4'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                  <div className='mb-2 sm:mb-0'>
                    <div className='font-medium'>Order #{order.id}</div>
                    <div className='text-sm text-gray-500'>
                      Placed on {formatDate(order.date)}
                    </div>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <div className='text-sm text-gray-500'>Total</div>
                      <div className='font-medium'>
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => toggleOrderDetails(order.id)}>
                      {expandedOrder === order.id
                        ? 'Hide Details'
                        : 'View Details'}
                    </Button>
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className='p-4 bg-gray-50 dark:bg-gray-800/50'>
                  <div className='grid gap-6 md:grid-cols-2'>
                    {/* Order Items */}
                    <div>
                      <h4 className='font-medium mb-3'>Order Items</h4>
                      <div className='space-y-4'>
                        {order.items.map((item, index) => (
                          <div key={index} className='flex'>
                            <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700'>
                              <img
                                src={item.image}
                                alt={item.name}
                                className='h-full w-full object-cover object-center'
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    'https://via.placeholder.com/80?text=No+Image';
                                }}
                              />
                            </div>
                            <div className='ml-4 flex flex-1 flex-col'>
                              <div>
                                <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
                                  <h3>{item.name}</h3>
                                  <p className='ml-4'>
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                                <p className='mt-1 text-sm text-gray-500'>
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className='space-y-4'>
                      <div>
                        <h4 className='font-medium mb-3'>Order Summary</h4>
                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>Status:</span>
                            <span>{getOrderStatus(order.status)}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className='flex justify-between'>
                              <span className='text-gray-500'>
                                Tracking Number:
                              </span>
                              <a
                                href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline dark:text-blue-400'>
                                {order.trackingNumber}
                              </a>
                            </div>
                          )}
                          {order.cancellationReason && (
                            <div className='flex justify-between'>
                              <span className='text-gray-500'>
                                Cancellation Reason:
                              </span>
                              <span className='text-right'>
                                {order.cancellationReason}
                              </span>
                            </div>
                          )}
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>
                              Payment Method:
                            </span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>
                              Shipping Address:
                            </span>
                            <address className='not-italic text-right'>
                              {order.shippingAddress
                                .split(',')
                                .map((line, i) => (
                                  <div key={i}>{line.trim()}</div>
                                ))}
                            </address>
                          </div>
                        </div>
                      </div>

                      <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
                          <p>Total</p>
                          <p>{formatCurrency(order.total)}</p>
                        </div>
                        <div className='mt-4 space-x-3'>
                          {order.status === 'delivered' && (
                            <Button variant='outline' size='sm'>
                              Track Package
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button variant='outline' size='sm'>
                              Track Package
                            </Button>
                          )}
                          <Button variant='outline' size='sm'>
                            View Invoice
                          </Button>
                          {order.status === 'processing' && (
                            <Button
                              variant='outline'
                              size='sm'
                              className='text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30'>
                              Cancel Order
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <Button variant='outline' size='sm'>
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
