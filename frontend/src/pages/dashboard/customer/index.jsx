import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/UICard';
import { ShoppingBag, Clock, CheckCircle, Truck, Star } from 'lucide-react';

const CustomerDashboard = () => {
  const orderStatus = [
    {
      name: 'To Pay',
      value: '2',
      icon: ShoppingBag,
      link: ROUTES.DASHBOARD.BUYER_ORDERS,
      status: 'pending_payment',
    },
    {
      name: 'To Ship',
      value: '1',
      icon: Clock,
      link: ROUTES.DASHBOARD.BUYER_ORDERS,
      status: 'processing',
    },
    {
      name: 'To Receive',
      value: '3',
      icon: Truck,
      link: ROUTES.DASHBOARD.BUYER_ORDERS,
      status: 'shipped',
    },
    {
      name: 'To Review',
      value: '5',
      icon: Star,
      link: ROUTES.DASHBOARD.BUYER_ORDERS,
      status: 'to_review',
    },
    {
      name: 'Completed',
      value: '12',
      icon: CheckCircle,
      link: ROUTES.DASHBOARD.BUYER_ORDERS,
      status: 'completed',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-2023-0012',
      date: '2023-06-15',
      items: 3,
      total: '$249.97',
      status: 'Delivered',
      statusClass:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      id: 'ORD-2023-0011',
      date: '2023-06-10',
      items: 1,
      total: '$99.99',
      status: 'Shipped',
      statusClass:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      id: 'ORD-2023-0010',
      date: '2023-06-05',
      items: 2,
      total: '$149.98',
      status: 'Processing',
      statusClass:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          My Account
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Welcome back! Here's what's happening with your orders and account.
        </p>
      </div>

      {/* Order Status */}
      <div>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          My Orders
        </h2>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-5'>
          {orderStatus.map((status) => {
            const Icon = status.icon;
            return (
              <Link
                key={status.name}
                to={`${status.link}?status=${status.status}`}
                className='group block'>
                <Card className='h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <CardContent className='p-4 text-center'>
                    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors'>
                      <Icon className='h-6 w-6 text-primary-600 dark:text-primary-400' />
                    </div>
                    <p className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                      {status.value}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {status.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className='mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
            Recent Orders
          </h2>
          <Link
            to={ROUTES.DASHBOARD.BUYER_ORDERS}
            className='text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'>
            View all orders
          </Link>
        </div>

        <div className='mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-300 dark:divide-gray-600'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6'>
                    Order ID
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Date
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Items
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Total Amount
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Status
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                    <span className='sr-only'>View</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 sm:pl-6'>
                      <Link to={`${ROUTES.DASHBOARD.BUYER_ORDERS}/${order.id}`}>
                        {order.id}
                      </Link>
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                      {order.date}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                      {order.items} item{order.items > 1 ? 's' : ''}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white'>
                      {order.total}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                      <Link
                        to={`${ROUTES.DASHBOARD.BUYER_ORDERS}/${order.id}`}
                        className='text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300'>
                        View<span className='sr-only'>, {order.id}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-8'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Link
            to={ROUTES.DASHBOARD.BUYER_WISHLIST}
            className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-500 hover:bg-primary-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-700'>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                Wishlist
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                View your saved items
              </p>
            </div>
            <div className='rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30'>
              <Star className='h-5 w-5 text-primary-600 dark:text-primary-400' />
            </div>
          </Link>

          <Link
            to={ROUTES.DASHBOARD.BUYER_ADDRESSES}
            className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-500 hover:bg-primary-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-700'>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                Addresses
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Manage your addresses
              </p>
            </div>
            <div className='rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30'>
              <MapPin className='h-5 w-5 text-primary-600 dark:text-primary-400' />
            </div>
          </Link>

          <Link
            to={ROUTES.DASHBOARD.BUYER_PAYMENTS}
            className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-500 hover:bg-primary-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-700'>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                Payment Methods
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Update payment options
              </p>
            </div>
            <div className='rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30'>
              <CreditCard className='h-5 w-5 text-primary-600 dark:text-primary-400' />
            </div>
          </Link>

          <Link
            to={ROUTES.SETTINGS}
            className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-500 hover:bg-primary-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-700'>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                Account Settings
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Update your profile
              </p>
            </div>
            <div className='rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30'>
              <User className='h-5 w-5 text-primary-600 dark:text-primary-400' />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
