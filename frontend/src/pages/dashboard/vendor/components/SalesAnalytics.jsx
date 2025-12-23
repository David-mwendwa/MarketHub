import React from 'react';
import { Card } from '../../../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';

const SalesAnalytics = () => {
  // Mock data - replace with actual API call
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 2400 },
    { name: 'Feb', sales: 3000, orders: 1398 },
    { name: 'Mar', sales: 2000, orders: 9800 },
    { name: 'Apr', sales: 2780, orders: 3908 },
    { name: 'May', sales: 1890, orders: 4800 },
    { name: 'Jun', sales: 2390, orders: 3800 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12.5%',
      isPositive: true,
      icon: <DollarSign className='h-5 w-5 text-green-500' />,
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      isPositive: true,
      icon: <Package className='h-5 w-5 text-blue-500' />,
    },
    {
      title: 'New Customers',
      value: '89',
      change: '-2.1%',
      isPositive: false,
      icon: <Users className='h-5 w-5 text-purple-500' />,
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat, index) => (
          <Card key={index} className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  {stat.title}
                </p>
                <p className='text-2xl font-bold mt-1'>{stat.value}</p>
                <div
                  className={`flex items-center mt-2 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? (
                    <ArrowUp className='h-4 w-4 mr-1' />
                  ) : (
                    <ArrowDown className='h-4 w-4 mr-1' />
                  )}
                  <span className='text-sm font-medium'>{stat.change}</span>
                  <span className='text-gray-500 text-sm ml-1'>
                    vs last month
                  </span>
                </div>
              </div>
              <div className='p-3 rounded-full bg-gray-100 dark:bg-gray-700'>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h3 className='text-lg font-medium'>Sales Overview</h3>
            <p className='text-sm text-gray-500'>Monthly performance</p>
          </div>
          <div className='flex items-center text-sm text-green-500'>
            <TrendingUp className='h-4 w-4 mr-1' />
            <span>12% increase from last month</span>
          </div>
        </div>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Bar
                dataKey='sales'
                fill='#4F46E5'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SalesAnalytics;
