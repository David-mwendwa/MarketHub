import React from 'react';
import { format } from 'date-fns';
import { Button } from '../../../components/ui/Button';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  CheckCheck,
} from 'lucide-react';

const OrderHistory = () => {
  // Mock order data
  const orders = [
    {
      id: 'ORD-12345',
      date: '2023-11-15',
      status: 'delivered',
      total: 129.99,
      items: 3,
      tracking: 'TRK-78945',
    },
    {
      id: 'ORD-12344',
      date: '2023-11-10',
      status: 'shipped',
      total: 89.99,
      items: 2,
      tracking: 'TRK-78944',
    },
    {
      id: 'ORD-12343',
      date: '2023-11-05',
      status: 'processing',
      total: 199.99,
      items: 1,
      tracking: 'TRK-78943',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className='h-4 w-4 text-yellow-500 mr-2' />;
      case 'shipped':
        return <Truck className='h-4 w-4 text-blue-500 mr-2' />;
      case 'delivered':
        return <CheckCheck className='h-4 w-4 text-green-500 mr-2' />;
      default:
        return <ShoppingBag className='h-4 w-4 text-gray-500 mr-2' />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Order History</h2>
      </div>

      <div className='space-y-4'>
        {orders.map((order) => (
          <div key={order.id} className='border rounded-lg p-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
              <div className='space-y-1'>
                <div className='flex items-center'>
                  <h3 className='font-medium'>Order #{order.id}</h3>
                  <span className='mx-2 text-muted-foreground'>•</span>
                  <span className='text-sm text-muted-foreground'>
                    {format(new Date(order.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className='flex items-center text-sm'>
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className='mt-4 md:mt-0 text-right'>
                <div className='text-lg font-medium'>
                  KES {order.total.toFixed(2)}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {order.items} item{order.items > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className='mt-4 pt-4 border-t flex justify-end space-x-2'>
              <Button variant='outline' size='sm'>
                View Details
              </Button>
              <Button variant='outline' size='sm'>
                Track Order
              </Button>
              <Button variant='outline' size='sm'>
                Buy Again
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
