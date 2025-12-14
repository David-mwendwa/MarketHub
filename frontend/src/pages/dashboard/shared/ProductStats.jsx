import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card';
import {
  BarChart3,
  Eye,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  PackagePlus,
  Star,
} from 'lucide-react';

const StatCard = ({
  icon,
  title,
  value,
  change,
  isPositive,
  className = '',
}) => {
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={`border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 rounded-lg bg-primary/10 dark:bg-primary/20'>
            {icon}
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
              {title}
            </p>
            <p className='text-xl font-semibold text-gray-900 dark:text-white'>
              {value}
            </p>
          </div>
        </div>
        {change !== undefined && (
          <span
            className={`inline-flex items-center text-sm ${
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
            <ChangeIcon className='h-4 w-4 mr-1' />
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};

const ProductStats = ({ stats, simpleView = false }) => {
  const [timeRange, setTimeRange] = useState('30D');

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Here you would typically fetch new data based on the selected range
    // For now, we'll just update the UI state
  };
  if (!stats) {
    return (
      <Card className='mt-6 dark:bg-gray-800 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className='dark:text-white'>Product Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            No statistics available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      icon: <Eye className='h-5 w-5 text-blue-500' />,
      title: 'Total Views',
      value: stats.views?.toLocaleString() || '0',
      change: 12,
      isPositive: true,
    },
    {
      icon: <ShoppingCart className='h-5 w-5 text-green-500' />,
      title: 'Total Sales',
      value: stats.sales?.toLocaleString() || '0',
      change: 8,
      isPositive: true,
    },
    {
      icon: <DollarSign className='h-5 w-5 text-amber-500' />,
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(stats.revenue || 0),
      change: 15,
      isPositive: true,
    },
    {
      icon: <Star className='h-5 w-5 text-yellow-500' />,
      title: 'Average Rating',
      value: stats.rating ? `${stats.rating.toFixed(1)} / 5` : 'N/A',
      change: 2,
      isPositive: true,
    },
  ];

  if (simpleView) {
    return (
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {statItems.map((stat, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='p-1.5 rounded-md bg-muted'>{stat.icon}</div>
                <span className='text-sm font-medium'>{stat.title}</span>
              </div>
              <span className='font-medium'>{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className='space-y-6 pt-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {statItems.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className='pt-4 border-t dark:border-gray-700'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3'>
            <div>
              <h4 className='font-medium text-gray-900 dark:text-white'>
                Sales Over Time
              </h4>
              <p className='text-sm text-muted-foreground dark:text-gray-400'>
                {timeRange === '30D' && 'Last 30 days of sales activity'}
                {timeRange === '90D' && 'Last 90 days of sales activity'}
                {timeRange === '1Y' && 'Last year of sales activity'}
              </p>
            </div>
            <div className='inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 text-sm shadow-xs'>
              <button
                onClick={() => handleTimeRangeChange('30D')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeRange === '30D'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}>
                30D
              </button>
              <button
                onClick={() => handleTimeRangeChange('90D')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeRange === '90D'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}>
                90D
              </button>
              <button
                onClick={() => handleTimeRangeChange('1Y')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeRange === '1Y'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}>
                1Y
              </button>
            </div>
          </div>

          <div className='h-[300px] p-4 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700'>
            {/* Mock Chart Area */}
            <div className='relative h-full w-full'>
              {/* Y-axis labels */}
              <div className='absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-muted-foreground dark:text-gray-500'>
                <span>$5,000</span>
                <span>$3,750</span>
                <span>$2,500</span>
                <span>$1,250</span>
                <span>$0</span>
              </div>

              {/* Chart content */}
              <div className='absolute left-8 right-0 top-0 bottom-0 pl-2'>
                {/* Grid lines */}
                <div className='absolute inset-0 grid grid-rows-4'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='border-t border-gray-200 dark:border-gray-700'
                      style={{ gridRow: i + 1 }}
                    />
                  ))}
                </div>

                {/* Mock data line */}
                <svg width='100%' height='100%' className='overflow-visible'>
                  <path
                    d='M0,240 C40,200 80,220 120,180 C160,140 200,100 240,120 C280,140 320,200 360,180 C400,160 440,40 480,80 C520,120 560,280 600,240 C640,200 680,80 720,100 C760,120 800,240 840,220 C880,200 920,120 960,140 L960,300 L0,300 Z'
                    className='fill-blue-100 dark:fill-blue-900/30'
                    transform='scale(0.98 0.8) translate(0, 10)'
                  />
                  <path
                    d='M0,240 C40,200 80,220 120,180 C160,140 200,100 240,120 C280,140 320,200 360,180 C400,160 440,40 480,80 C520,120 560,280 600,240 C640,200 680,80 720,100 C760,120 800,240 840,220 C880,200 920,120 960,140'
                    className='stroke-blue-500 dark:stroke-blue-400'
                    strokeWidth='2'
                    fill='none'
                    transform='scale(0.98 0.8) translate(0, 10)'
                  />

                  {/* Data points */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                    const x = (i / 9) * 100;
                    const y = 100 - (Math.sin(i) * 20 + 50);
                    return (
                      <circle
                        key={i}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r='3'
                        className='fill-blue-500 dark:fill-blue-400'
                      />
                    );
                  })}
                </svg>

                {/* X-axis labels */}
                <div className='absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground dark:text-gray-500 mt-2'>
                  {['Jan 1', 'Jan 7', 'Jan 14', 'Jan 21', 'Jan 28'].map(
                    (label, i) => (
                      <span key={i} className='text-center' style={{ flex: 1 }}>
                        {label}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className='absolute bottom-4 right-4 flex items-center space-x-2 text-xs'>
              <div className='flex items-center'>
                <div className='w-3 h-0.5 bg-blue-500 dark:bg-blue-400 mr-1'></div>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Sales
                </span>
              </div>
            </div>
          </div>

          <div className='mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm'>
            <div className='p-3 bg-muted/30 dark:bg-gray-800/50 rounded-lg'>
              <p className='text-muted-foreground dark:text-gray-400'>
                Total Sales
              </p>
              <p className='font-medium text-gray-900 dark:text-white'>
                $12,458
              </p>
              <p className='text-green-600 dark:text-green-400 text-xs flex items-center'>
                <TrendingUp className='h-3 w-3 mr-1' /> 12.5% from last period
              </p>
            </div>
            <div className='p-3 bg-muted/30 dark:bg-gray-800/50 rounded-lg'>
              <p className='text-muted-foreground dark:text-gray-400'>Orders</p>
              <p className='font-medium text-gray-900 dark:text-white'>342</p>
              <p className='text-green-600 dark:text-green-400 text-xs flex items-center'>
                <TrendingUp className='h-3 w-3 mr-1' /> 8.2% from last period
              </p>
            </div>
            <div className='p-3 bg-muted/30 dark:bg-gray-800/50 rounded-lg'>
              <p className='text-muted-foreground dark:text-gray-400'>
                Avg. Order Value
              </p>
              <p className='font-medium text-gray-900 dark:text-white'>
                $36.43
              </p>
              <p className='text-green-600 dark:text-green-400 text-xs flex items-center'>
                <TrendingUp className='h-3 w-3 mr-1' /> 4.1% from last period
              </p>
            </div>
            <div className='p-3 bg-muted/30 dark:bg-gray-800/50 rounded-lg'>
              <p className='text-muted-foreground dark:text-gray-400'>
                Conversion
              </p>
              <p className='font-medium text-gray-900 dark:text-white'>3.2%</p>
              <p className='text-red-600 dark:text-red-400 text-xs flex items-center'>
                <TrendingDown className='h-3 w-3 mr-1' /> 0.5% from last period
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6'>
          {/* Top Selling Variants */}
          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='font-medium text-gray-900 dark:text-white'>
                Top Selling Variants
              </h4>
              <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                View All
              </button>
            </div>
            <div className='space-y-4'>
              {[
                { id: 1, name: 'Variant 1', sold: 39, stock: 124 },
                { id: 2, name: 'Variant 2', sold: 21, stock: 89 },
                { id: 3, name: 'Variant 3', sold: 38, stock: 156 },
              ].map((variant) => (
                <div
                  key={variant.id}
                  className='flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-2 px-2 py-1.5 rounded-md transition-colors'>
                  <div className='flex items-center space-x-3'>
                    <div className='h-10 w-10 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                      <Package className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {variant.name}
                      </p>
                      <div className='flex items-center space-x-2 mt-0.5'>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {variant.sold} sold
                        </span>
                        <span className='text-gray-300 dark:text-gray-600'>
                          •
                        </span>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {variant.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='text-sm font-medium text-gray-900 dark:text-white'>
                    ${(Math.random() * 100 + 10).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='font-medium text-gray-900 dark:text-white'>
                Recent Activity
              </h4>
              <button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                View All
              </button>
            </div>
            <div className='space-y-4'>
              {[
                {
                  id: 1,
                  type: 'price',
                  title: 'Price updated',
                  details: 'From $49.99 to $44.99',
                  time: '16 hours ago',
                  icon: 'dollar-sign',
                },
                {
                  id: 2,
                  type: 'stock',
                  title: 'Stock updated',
                  details: '25 units added',
                  time: '22 hours ago',
                  icon: 'package-plus',
                },
                {
                  id: 3,
                  type: 'review',
                  title: 'New review',
                  details: '4.5 stars from John D.',
                  time: '1 day ago',
                  icon: 'star',
                },
              ].map((activity) => (
                <div
                  key={activity.id}
                  className='flex items-start space-x-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-2 px-2 py-1.5 rounded-md transition-colors'>
                  <div
                    className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'price'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : activity.type === 'stock'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                    {activity.icon === 'dollar-sign' && (
                      <DollarSign className='h-4 w-4' />
                    )}
                    {activity.icon === 'package-plus' && (
                      <PackagePlus className='h-4 w-4' />
                    )}
                    {activity.icon === 'star' && <Star className='h-4 w-4' />}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {activity.title}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {activity.details}
                    </p>
                    <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStats;
