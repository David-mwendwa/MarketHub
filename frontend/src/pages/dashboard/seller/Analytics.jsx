import React, { useState, useEffect } from 'react';
import { ROUTES } from '../../../constants/routes';
import SalesAnalytics from '../shared/SalesAnalytics';
import ContentSkeleton from '../shared/ContentSkeleton';

// Mock data - replace with actual API calls
const salesData = {
  daily: [
    { date: '2023-06-01', sales: 400, orders: 24, revenue: 2400 },
    { date: '2023-06-02', sales: 300, orders: 19, revenue: 1800 },
    { date: '2023-06-03', sales: 600, orders: 32, revenue: 4200 },
    { date: '2023-06-04', sales: 800, orders: 45, revenue: 5800 },
    { date: '2023-06-05', sales: 1200, orders: 68, revenue: 8200 },
    { date: '2023-06-06', sales: 1500, orders: 72, revenue: 10500 },
    { date: '2023-06-07', sales: 1000, orders: 54, revenue: 7800 },
  ],
  weekly: [
    { week: 'Week 1', sales: 2800, orders: 156, revenue: 19600 },
    { week: 'Week 2', sales: 3200, orders: 184, revenue: 22400 },
    { week: 'Week 3', sales: 3500, orders: 201, revenue: 24500 },
    { week: 'Week 4', sales: 4000, orders: 235, revenue: 28000 },
  ],
  monthly: [
    { month: 'Jan', sales: 4000, orders: 240, revenue: 28000 },
    { month: 'Feb', sales: 3000, orders: 180, revenue: 21000 },
    { month: 'Mar', sales: 5000, orders: 300, revenue: 35000 },
    { month: 'Apr', sales: 4500, orders: 270, revenue: 31500 },
    { month: 'May', sales: 6000, orders: 360, revenue: 42000 },
    { month: 'Jun', sales: 5500, orders: 330, revenue: 38500 },
  ],
};

const topProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    sales: 1200,
    revenue: 11988,
    stock: 45,
  },
  { id: 2, name: 'Smart Watch', sales: 856, revenue: 171199.44, stock: 12 },
  { id: 3, name: 'Bluetooth Speaker', sales: 720, revenue: 57592.8, stock: 0 },
  { id: 4, name: 'Phone Stand', sales: 680, revenue: 16993.2, stock: 87 },
  { id: 5, name: 'Wireless Earbuds', sales: 540, revenue: 70194.6, stock: 23 },
];

const trafficSources = [
  { source: 'Direct', visitors: 4560, percentage: 34 },
  { source: 'Organic Search', visitors: 3780, percentage: 28 },
  { source: 'Social Media', visitors: 2340, percentage: 17 },
  { source: 'Referral', visitors: 1890, percentage: 14 },
  { source: 'Email', visitors: 930, percentage: 7 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState(salesData.weekly);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // In a real app, fetch data based on the selected time range
      setIsLoading(true);

      // Simulate API call with a small delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isMounted) {
        setChartData(salesData[timeRange]);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  // Calculate totals for the stats cards
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate percentage change compared to previous period
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const previousPeriodData = {
    sales: Math.round(totalSales * 0.9), // 10% less than current for demo
    revenue: Math.round(totalRevenue * 0.88), // 12% less than current for demo
    orders: Math.round(totalOrders * 0.85), // 15% less than current for demo
  };

  const salesChange = getPercentageChange(totalSales, previousPeriodData.sales);
  const revenueChange = getPercentageChange(
    totalRevenue,
    previousPeriodData.revenue
  );
  const ordersChange = getPercentageChange(
    totalOrders,
    previousPeriodData.orders
  );
  const avgOrderValueChange = getPercentageChange(
    avgOrderValue,
    avgOrderValue * 0.95
  );

  // Define stats for the SalesAnalytics component
  const stats = [
    {
      name: 'Total Sales',
      value: `$${totalSales.toLocaleString()}`,
      change: salesChange,
      changeType: salesChange >= 0 ? 'increase' : 'decrease',
    },
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      changeType: revenueChange >= 0 ? 'increase' : 'decrease',
    },
    {
      name: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      changeType: ordersChange >= 0 ? 'increase' : 'decrease',
    },
    {
      name: 'Avg. Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      change: avgOrderValueChange,
      changeType: avgOrderValueChange >= 0 ? 'increase' : 'decrease',
    },
  ];

  if (isLoading) {
    return (
      <ContentSkeleton
        variant='analytics'
        showStats={true}
        showCharts={true}
        cardCount={4}
        chartCount={2}
        showHeaderSection={true}
        className='space-y-8'
      />
    );
  }

  return (
    <SalesAnalytics
      // Data props
      chartData={chartData}
      stats={stats}
      topItems={topProducts}
      trafficSources={trafficSources}
      // Configuration props
      isAdmin={false}
      title='Analytics Dashboard'
      description='Track your sales performance and customer insights'
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isLoading={isLoading}

      // Custom renderers can be added here if needed
      // renderCustomStats={...}
      // renderCustomCharts={...}
      // renderCustomContent={...}
    />
  );
};

export default Analytics;
