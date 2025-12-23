import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/UICard';
import {
  Package,
  ShoppingBag,
  BarChart2,
  Star,
  ArrowRight,
} from 'lucide-react';
import ContentSkeleton from '../shared/ContentSkeleton';

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set the actual data
        setStats([
          {
            name: 'Total Products',
            value: '156',
            change: '+5.2%',
            icon: Package,
            link: ROUTES.DASHBOARD.SELLER_PRODUCTS,
          },
          {
            name: 'Total Orders',
            value: '1,234',
            change: '+23.8%',
            icon: ShoppingBag,
            link: ROUTES.DASHBOARD.SELLER_ORDERS,
          },
          {
            name: 'Revenue',
            value: '$24,563',
            change: '+18.3%',
            icon: BarChart2,
            link: '#',
          },
          {
            name: 'Average Rating',
            value: '4.8',
            change: '+0.2',
            icon: Star,
            link: '#',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentOrders = [
    {
      id: 1,
      customer: 'John Doe',
      product: 'Wireless Headphones',
      amount: '$99.99',
      status: 'Shipped',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      product: 'Smart Watch',
      amount: '$199.99',
      status: 'Processing',
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      product: 'Bluetooth Speaker',
      amount: '$79.99',
      status: 'Delivered',
    },
    {
      id: 4,
      customer: 'Emily Davis',
      product: 'Phone Case',
      amount: '$24.99',
      status: 'Shipped',
    },
    {
      id: 5,
      customer: 'Michael Brown',
      product: 'Wireless Earbuds',
      amount: '$129.99',
      status: 'Processing',
    },
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Processing:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Delivered:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <ContentSkeleton
        variant='analytics'
        showStats={true}
        showCharts={true}
        cardCount={4}
        chartCount={2}
        className='space-y-8'
      />
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Seller Dashboard
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Welcome back! Here's an overview of your store's performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className='block transition-transform hover:scale-[1.02]'>
              <Card className='h-full'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {stat.name}
                      </p>
                      <p className='mt-1 text-2xl font-semibold text-gray-900 dark:text-white'>
                        {stat.value}
                      </p>
                      <p className='mt-1 text-sm text-green-600 dark:text-green-400'>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className='rounded-lg bg-primary-100 p-3 dark:bg-primary-900/30'>
                      <Icon className='h-6 w-6 text-primary-600 dark:text-primary-400' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className='mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
            Recent Orders
          </h2>
          <Link
            to={ROUTES.DASHBOARD.SELLER_ORDERS}
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
                    Customer
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Product
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Amount
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
                    <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6'>
                      #{order.id}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                      {order.customer}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                      {order.product}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                      {order.amount}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300'>
                      {getStatusBadge(order.status)}
                    </td>
                    <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                      <Link
                        to={`${ROUTES.DASHBOARD.SELLER_ORDERS}/${order.id}`}
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
    </div>
  );
};

export default SellerDashboard;
