import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/Tabs';
import { ROUTES } from '../../../constants/routes';

const SalesAnalytics = ({
  // Data props
  chartData = [],
  stats = [],
  topItems = [],
  trafficSources = [],

  // Configuration props
  isAdmin = false,
  title = 'Sales Analytics',
  description = 'Overview of sales performance',
  timeRange = 'weekly',
  onTimeRangeChange = () => {},
  activeTab = 'overview',
  onTabChange = () => {},
  isLoading = false,

  // Custom renderers
  renderCustomStats = null,
  renderCustomCharts = null,
  renderCustomContent = null,
}) => {
  // Calculate totals
  const calculateTotal = (key) =>
    chartData.reduce((sum, item) => sum + (item[key] || 0), 0);

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Default stats calculation
  const defaultStats = [
    {
      name: 'Total Sales',
      value: `$${calculateTotal('sales').toLocaleString()}`,
      change: calculatePercentageChange(
        calculateTotal('sales'),
        calculateTotal('sales') * 0.9
      ),
      changeType: 'increase',
    },
    {
      name: 'Total Revenue',
      value: `$${calculateTotal('revenue').toLocaleString()}`,
      change: calculatePercentageChange(
        calculateTotal('revenue'),
        calculateTotal('revenue') * 0.88
      ),
      changeType: 'increase',
    },
    {
      name: isAdmin ? 'Total Users' : 'Total Orders',
      value: isAdmin
        ? calculateTotal('users').toLocaleString()
        : calculateTotal('orders').toLocaleString(),
      change: calculatePercentageChange(
        isAdmin ? calculateTotal('users') : calculateTotal('orders'),
        (isAdmin ? calculateTotal('users') : calculateTotal('orders')) * 0.85
      ),
      changeType: 'increase',
    },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight text-foreground dark:text-white'>
            {title}
          </h2>
          <p className='text-muted-foreground dark:text-gray-300 mt-1'>
            {description}
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className='h-9 rounded-md border border-input bg-background pl-3 pr-8 py-1 text-sm shadow-sm transition-colors text-foreground dark:text-white dark:border-gray-700 dark:bg-gray-800 appearance-none bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+")] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1rem_1rem]'>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
          </select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className='space-y-4'>
        <TabsList className='bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg'>
          <TabsTrigger
            value='overview'
            className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
            Overview
          </TabsTrigger>
          <TabsTrigger
            value='products'
            disabled={isLoading}
            className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
            {isAdmin ? 'Top Sellers' : 'Top Products'}
          </TabsTrigger>
          <TabsTrigger
            value='traffic'
            disabled={isLoading}
            className='data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-4 py-2 rounded-md transition-colors'>
            Traffic Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          {renderCustomStats ? (
            renderCustomStats(displayStats)
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {displayStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      {stat.name}
                    </CardTitle>
                    {stat.icon && (
                      <stat.icon className='h-4 w-4 text-muted-foreground' />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stat.value}</div>
                    <p
                      className={`text-xs ${stat.change > 0 ? 'text-green-600 dark:text-green-400' : stat.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                      {stat.change >= 0 ? '+' : ''}
                      {stat.change}% from last period
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {renderCustomCharts ? (
            renderCustomCharts(chartData)
          ) : (
            <Card className='col-span-4'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Sales Overview</CardTitle>
                <CardDescription className='mt-1'>
                  {timeRange === 'daily'
                    ? 'Daily sales performance'
                    : timeRange === 'weekly'
                      ? 'Weekly sales performance'
                      : 'Monthly sales performance'}
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='h-[300px] flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center'>
                  <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-4'>
                    <svg
                      className='w-10 h-10 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='1.5'
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                  </div>
                  <div className='space-y-1'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      {timeRange === 'daily'
                        ? 'Daily'
                        : timeRange === 'weekly'
                          ? 'Weekly'
                          : 'Monthly'}{' '}
                      Analytics
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 max-w-md'>
                      Interactive chart showing{' '}
                      {timeRange === 'daily'
                        ? 'daily'
                        : timeRange === 'weekly'
                          ? 'weekly'
                          : 'monthly'}{' '}
                      performance metrics and trends will be displayed here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='products' className='space-y-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>
                {isAdmin ? 'Top Sellers' : 'Top Products'}
              </CardTitle>
              <CardDescription className='mt-1'>
                {isAdmin
                  ? 'Sellers with the highest sales volume'
                  : 'Your best performing products'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topItems.length > 0 ? (
                <div className='space-y-3'>
                  {topItems.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150'>
                      <div className='flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary mr-4 flex-shrink-0'>
                        <span className='font-semibold'>{index + 1}</span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <p
                            className='text-sm font-medium truncate'
                            title={item.name}>
                            {item.name}
                          </p>
                          <div className='ml-2 flex-shrink-0'>
                            {item.stock !== undefined && (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.stock === 0
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                {item.stock === 0
                                  ? 'Out of Stock'
                                  : `${item.stock} in stock`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className='mt-1 flex items-center justify-between text-sm'>
                          <div className='flex items-center space-x-4'>
                            <span className='text-muted-foreground'>
                              <span className='font-medium'>{item.sales}</span>{' '}
                              sales
                            </span>
                            <span className='text-muted-foreground'>•</span>
                            <span className='text-muted-foreground'>
                              $
                              {item.revenue?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          {item.revenue && item.sales > 0 && (
                            <span className='text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 rounded-full'>
                              ${(item.revenue / item.sales).toFixed(2)} avg.
                              sale
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground text-center py-4'>
                  No data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='traffic' className='space-y-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Traffic Sources</CardTitle>
              <CardDescription className='mt-1'>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trafficSources.length > 0 ? (
                <div className='space-y-5'>
                  {trafficSources.map((source, index) => {
                    const change = source.change || 0;
                    const isPositive = change >= 0;
                    const colors = {
                      direct: 'bg-blue-500',
                      organic: 'bg-green-500',
                      social: 'bg-purple-500',
                      referral: 'bg-amber-500',
                      email: 'bg-red-500',
                      default: 'bg-primary',
                    };
                    const icon = {
                      direct: '↗️',
                      organic: '🔍',
                      social: '💬',
                      referral: '🔗',
                      email: '✉️',
                    };

                    return (
                      <div key={index} className='group'>
                        <div className='flex items-center justify-between mb-1.5'>
                          <div className='flex items-center'>
                            <span className='mr-3 text-lg'>
                              {icon[source.source.toLowerCase()] || '🌐'}
                            </span>
                            <span className='font-medium text-sm'>
                              {source.source}
                            </span>
                            {change !== 0 && (
                              <span
                                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                              </span>
                            )}
                          </div>
                          <div className='text-sm font-medium'>
                            {source.percentage}%
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <div className='flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                            <div
                              className={`h-full ${colors[source.source.toLowerCase()] || colors.default} rounded-full transition-all duration-500`}
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                          <div className='text-xs text-muted-foreground min-w-[80px] text-right'>
                            {source.visitors.toLocaleString()}
                          </div>
                        </div>
                        {source.pages && source.pages.length > 0 && (
                          <div className='mt-2 pl-9 text-xs text-muted-foreground'>
                            <p className='truncate'>
                              Top page:{' '}
                              <span className='text-foreground'>
                                {source.pages[0].page}
                              </span>{' '}
                              ({source.pages[0].percentage}%)
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='text-muted-foreground text-center py-4'>
                  No traffic data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {renderCustomContent && renderCustomContent()}
    </div>
  );
};

SalesAnalytics.propTypes = {
  // Data props
  chartData: PropTypes.arrayOf(PropTypes.object),
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      change: PropTypes.number,
      changeType: PropTypes.oneOf(['increase', 'decrease']),
      icon: PropTypes.elementType,
    })
  ),
  topItems: PropTypes.arrayOf(PropTypes.object),
  trafficSources: PropTypes.arrayOf(PropTypes.object),

  // Configuration props
  isAdmin: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  timeRange: PropTypes.oneOf(['daily', 'weekly', 'monthly']),
  onTimeRangeChange: PropTypes.func,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  isLoading: PropTypes.bool,

  // Custom renderers
  renderCustomStats: PropTypes.func,
  renderCustomCharts: PropTypes.func,
  renderCustomContent: PropTypes.func,
};

export default SalesAnalytics;
