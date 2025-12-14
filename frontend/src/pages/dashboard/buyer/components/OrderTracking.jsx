import React from 'react';
import { Truck, CheckCircle, Package, Clock, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const OrderTracking = () => {
  // Mock order data
  const order = {
    id: 'ORD-12345',
    status: 'shipped',
    items: [
      { id: 1, name: 'Wireless Headphones', quantity: 1, price: 89.99 },
      { id: 2, name: 'Phone Case', quantity: 2, price: 19.99 },
    ],
    trackingNumber: 'TRK-78945',
    carrier: 'DHL Express',
    estimatedDelivery: '2023-12-15',
    shippingAddress: '123 Main St, Apt 4B, Nairobi, Kenya',
    orderDate: '2023-12-01',
    history: [
      {
        status: 'ordered',
        date: '2023-12-01T10:30:00',
        description: 'Order placed',
      },
      {
        status: 'processing',
        date: '2023-12-02T14:15:00',
        description: 'Order confirmed',
      },
      {
        status: 'shipped',
        date: '2023-12-04T09:45:00',
        description: 'Shipped with DHL',
      },
      {
        status: 'in_transit',
        date: '2023-12-05T11:20:00',
        description: 'In transit',
      },
    ],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'shipped':
      case 'in_transit':
        return <Truck className='h-5 w-5 text-blue-500' />;
      case 'processing':
        return <Package className='h-5 w-5 text-yellow-500' />;
      case 'ordered':
      default:
        return <Clock className='h-5 w-5 text-gray-500' />;
    }
  };

  const getStatusText = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>Order #{order.id}</h2>
          <p className='text-sm text-muted-foreground'>
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Package className='h-4 w-4 mr-2' />
            Order Details
          </Button>
          <Button variant='outline' size='sm'>
            <Truck className='h-4 w-4 mr-2' />
            Track Package
          </Button>
        </div>
      </div>

      {/* Order Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            {/* Progress Line */}
            <div className='absolute left-4 top-0 h-full w-0.5 bg-gray-200 -translate-x-1/2' />

            {order.history.map((item, index) => (
              <div key={index} className='relative pb-8 pl-10'>
                <div className='absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white'>
                  {getStatusIcon(item.status)}
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-medium'>
                      {getStatusText(item.status)}
                    </h3>
                    <span className='text-sm text-muted-foreground'>
                      {new Date(item.date).toLocaleString()}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {order.items.map((item) => (
                <div key={item.id} className='flex justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-md bg-gray-100' />
                    <div>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className='font-medium'>KES {item.price.toFixed(2)}</p>
                </div>
              ))}
              <div className='border-t pt-4'>
                <div className='flex justify-between py-1'>
                  <span>Subtotal</span>
                  <span>
                    KES{' '}
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className='flex justify-between py-1 font-bold'>
                  <span>Total</span>
                  <span>
                    KES{' '}
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6 md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Delivery Address
                  </h3>
                  <p className='mt-1'>{order.shippingAddress}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Shipping Method
                  </h3>
                  <p className='mt-1'>{order.carrier}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Tracking Number
                  </h3>
                  <p className='mt-1 font-mono'>{order.trackingNumber}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Estimated Delivery
                  </h3>
                  <p className='mt-1'>
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                    <span className='ml-2 text-sm text-muted-foreground'>
                      (
                      {Math.ceil(
                        (new Date(order.estimatedDelivery) - new Date()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      days left)
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  If you have any questions about your order, our customer
                  service team is happy to help.
                </p>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <Button variant='outline' className='w-full sm:w-auto'>
                    <MessageCircle className='h-4 w-4 mr-2' />
                    Contact Support
                  </Button>
                  <Button variant='outline' className='w-full sm:w-auto'>
                    <HelpCircle className='h-4 w-4 mr-2' />
                    Help Center
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
