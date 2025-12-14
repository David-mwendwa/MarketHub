import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@components/ui/UICard';
import ContentSkeleton from '@pages/dashboard/shared/ContentSkeleton';
import {
  Users,
  Package,
  ShoppingBag,
  BarChart2,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
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
            name: 'Total Users',
            value: '2,543',
            change: '+12.5%',
            icon: Users,
            link: ROUTES.DASHBOARD.ADMIN_USERS,
          },
          {
            name: 'Total Products',
            value: '1,234',
            change: '+5.2%',
            icon: Package,
            link: ROUTES.DASHBOARD.ADMIN_PRODUCTS,
          },
          {
            name: 'Total Orders',
            value: '856',
            change: '+8.1%',
            icon: ShoppingBag,
            link: ROUTES.DASHBOARD.ADMIN_ORDERS,
          },
          {
            name: 'Revenue',
            value: '$12,543',
            change: '+15.3%',
            icon: BarChart2,
            link: ROUTES.DASHBOARD.ADMIN_ANALYTICS,
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

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Dashboard Overview</h1>
        </div>

        <ContentSkeleton
          variant='analytics'
          showStats={true}
          showCharts={true}
          cardCount={4}
          chartCount={2}
          showHeaderSection={false}
          className='space-y-8'
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className='group'>
            <Card className='h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  {stat.name}
                </CardTitle>
                <stat.icon className='h-4 w-4 text-gray-500 dark:text-gray-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-xs text-green-500 dark:text-green-400'>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <p className='text-gray-500 dark:text-gray-400'>
                Sales chart will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <p className='text-gray-500 dark:text-gray-400'>
                Recent activity will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
