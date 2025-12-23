import React from 'react';
import { ShoppingBag, Heart, MapPin, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/UICard';
import BuyerQuickActions from './BuyerQuickActions';
import RecommendedProducts from './RecommendedProducts';

const BuyerDashboard = () => {
  // Mock data for recent orders
  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2023-11-20',
      status: 'Delivered',
      total: 149.99,
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '2023-11-15',
      status: 'Shipped',
      total: 89.99,
      items: 2,
    },
    {
      id: 'ORD-003',
      date: '2023-11-10',
      status: 'Processing',
      total: 199.99,
      items: 1,
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Welcome back, John!</h2>
          <p className='text-muted-foreground'>
            Here's what's happening with your account today.
          </p>
        </div>
        <div className='hidden md:block'>
          <p className='text-sm text-muted-foreground'>
            Last login: Today at 2:45 PM
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <BuyerQuickActions />

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Recent Orders</CardTitle>
            <ShoppingBag className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Wishlist</CardTitle>
            <Heart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8</div>
            <p className='text-xs text-muted-foreground'>+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Saved Addresses
            </CardTitle>
            <MapPin className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3</div>
            <p className='text-xs text-muted-foreground'>+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Payment Methods
            </CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2</div>
            <p className='text-xs text-muted-foreground'>+0 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className='mt-8'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Recent Orders</h3>
          <button className='text-sm text-primary hover:underline'>
            View All Orders
          </button>
        </div>
        <div className='border rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-800'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Order ID
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Status
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Items
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-primary'>
                      <a
                        href={`/orders/${order.id}`}
                        className='hover:underline'>
                        {order.id}
                      </a>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                      {order.items} {order.items === 1 ? 'item' : 'items'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white'>
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts />
    </div>
  );
};

export default BuyerDashboard;
