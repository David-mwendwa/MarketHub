import React, { useState, useEffect } from 'react';
import SalesAnalytics from '@pages/dashboard/shared/SalesAnalytics';
import { PageHeader } from '@pages/dashboard/shared/PageHeader';
import ContentSkeleton from '@pages/dashboard/shared/ContentSkeleton';

// Mock data - replace with actual API calls
const analyticsData = {
  daily: [
    { date: '2023-06-01', users: 45, revenue: 4500, orders: 32 },
    { date: '2023-06-02', users: 52, revenue: 5200, orders: 38 },
    { date: '2023-06-03', users: 68, revenue: 6800, orders: 45 },
    { date: '2023-06-04', users: 72, revenue: 7200, orders: 51 },
    { date: '2023-06-05', users: 85, revenue: 8500, orders: 62 },
    { date: '2023-06-06', users: 90, revenue: 9000, orders: 68 },
    { date: '2023-06-07', users: 78, revenue: 7800, orders: 54 },
  ],
  weekly: [
    { week: 'Week 1', users: 350, revenue: 35000, orders: 240 },
    { week: 'Week 2', users: 420, revenue: 42000, orders: 310 },
    { week: 'Week 3', users: 480, revenue: 48000, orders: 360 },
    { week: 'Week 4', users: 520, revenue: 52000, orders: 410 },
  ],
  monthly: [
    { month: 'Jan', users: 1800, revenue: 180000, orders: 1250 },
    { month: 'Feb', users: 2100, revenue: 210000, orders: 1500 },
    { month: 'Mar', users: 2400, revenue: 240000, orders: 1800 },
    { month: 'Apr', users: 2300, revenue: 230000, orders: 1700 },
    { month: 'May', users: 2600, revenue: 260000, orders: 2000 },
    { month: 'Jun', users: 2800, revenue: 280000, orders: 2200 },
  ],
};

const topSellers = [
  { id: 1, name: 'John Doe', sales: 1450, revenue: 145000 },
  { id: 2, name: 'Jane Smith', sales: 1320, revenue: 132000 },
  { id: 3, name: 'Mike Johnson', sales: 1180, revenue: 118000 },
  { id: 4, name: 'Sarah Williams', sales: 1020, revenue: 102000 },
  { id: 5, name: 'David Brown', sales: 980, revenue: 98000 },
];

const trafficSources = [
  { source: 'Direct', visitors: 7560, percentage: 45 },
  { source: 'Organic Search', visitors: 5780, percentage: 34 },
  { source: 'Social Media', visitors: 1540, percentage: 9 },
  { source: 'Referral', visitors: 980, percentage: 6 },
  { source: 'Email', visitors: 650, percentage: 4 },
  { source: 'Other', visitors: 490, percentage: 3 },
];

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState(analyticsData.weekly);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);

      // Simulate API call with a small delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isMounted) {
        setChartData(analyticsData[timeRange]);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  // Calculate totals for the stats cards
  const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate percentage change compared to previous period
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const previousPeriodData = {
    users: Math.round(totalUsers * 0.85), // 15% less than current for demo
    revenue: Math.round(totalRevenue * 0.88), // 12% less than current for demo
    orders: Math.round(totalOrders * 0.9), // 10% less than current for demo
  };

  const usersChange = getPercentageChange(totalUsers, previousPeriodData.users);
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
      name: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: usersChange,
      changeType: usersChange >= 0 ? 'increase' : 'decrease',
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
      topItems={topSellers}
      trafficSources={trafficSources}
      // Configuration props
      isAdmin={true}
      title='Admin Dashboard'
      description='Overview of platform performance and analytics'
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

export default AdminAnalytics;
