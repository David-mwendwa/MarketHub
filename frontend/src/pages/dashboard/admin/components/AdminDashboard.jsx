import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  DollarSign,
  CreditCard,
  BarChart2,
  AlertCircle,
  UserPlus,
  Download,
  ArrowRight,
  Activity,
  Shield,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronDown,
  SlidersHorizontal,
  Search,
  Plus,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import UserManagement from './UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { Input } from '@components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [_activeTab, setActiveTab] = useState('overview'); // Keep for future use

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'new_user',
      user: 'John Doe',
      role: 'buyer',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'new_order',
      orderId: 'ORD-10045',
      amount: 245.99,
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'new_seller',
      user: 'Acme Electronics',
      time: '1 hour ago',
      read: true,
    },
    {
      id: 4,
      type: 'payment_received',
      amount: 1245.5,
      orderId: 'ORD-10042',
      time: '3 hours ago',
      read: true,
    },
  ];

  // Mock data for system health
  const systemHealth = {
    status: 'operational',
    uptime: '99.98%',
    responseTime: '124ms',
    activeUsers: '1,245',
    lastIncident: 'No incidents reported in the past 30 days',
  };

  // Mock data for top products
  const topProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds Pro',
      image: 'https://via.placeholder.com/40',
      sales: 245,
      revenue: 3675.0,
    },
    {
      id: 2,
      name: 'Smartphone X',
      image: 'https://via.placeholder.com/40',
      sales: 189,
      revenue: 113400.0,
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      image: 'https://via.placeholder.com/40',
      sales: 156,
      revenue: 3120.0,
    },
    {
      id: 4,
      name: 'Fitness Tracker',
      image: 'https://via.placeholder.com/40',
      sales: 132,
      revenue: 1980.0,
    },
    {
      id: 5,
      name: 'Laptop Backpack',
      image: 'https://via.placeholder.com/40',
      sales: 98,
      revenue: 1470.0,
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_user':
        return <UserPlus className='h-4 w-4 text-blue-500' />;
      case 'new_order':
        return <ShoppingBag className='h-4 w-4 text-green-500' />;
      case 'new_seller':
        return <UserCheck className='h-4 w-4 text-purple-500' />;
      case 'payment_received':
        return <DollarSign className='h-4 w-4 text-green-500' />;
      default:
        return <Activity className='h-4 w-4 text-gray-500' />;
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'new_user':
        return (
          <span>
            New <span className='font-medium'>{activity.role}</span> registered:{' '}
            {activity.user}
          </span>
        );
      case 'new_order':
        return (
          <span>
            New order <span className='font-medium'>#{activity.orderId}</span>{' '}
            received (${activity.amount.toFixed(2)})
          </span>
        );
      case 'new_seller':
        return (
          <span>
            New seller onboarded:{' '}
            <span className='font-medium'>{activity.user}</span>
          </span>
        );
      case 'payment_received':
        return (
          <span>
            Payment of{' '}
            <span className='font-medium'>${activity.amount.toFixed(2)}</span>{' '}
            received for order #{activity.orderId}
          </span>
        );
      default:
        return 'New activity';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>Admin Dashboard</h2>
          <p className='text-muted-foreground'>
            Manage your platform and monitor activity
          </p>
        </div>
        <div className='flex items-center space-x-2 w-full sm:w-auto'>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search...'
              className='w-full pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='whitespace-nowrap'>
                <Download className='h-4 w-4 mr-2' />
                Export
                <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2,543</div>
            <div className='flex items-center'>
              <span className='text-xs text-green-600 font-medium'>+12%</span>
              <span className='text-xs text-muted-foreground ml-1'>
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
            <ShoppingBag className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12,345</div>
            <div className='flex items-center'>
              <span className='text-xs text-green-600 font-medium'>+19%</span>
              <span className='text-xs text-muted-foreground ml-1'>
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>KES 12.5M</div>
            <div className='flex items-center'>
              <span className='text-xs text-green-600 font-medium'>+8.2%</span>
              <span className='text-xs text-muted-foreground ml-1'>
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Sellers
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>189</div>
            <div className='flex items-center'>
              <span className='text-xs text-green-600 font-medium'>+5</span>
              <span className='text-xs text-muted-foreground ml-1'>
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <TabsList>
            <TabsTrigger
              value='overview'
              onClick={() => setActiveTab('overview')}>
              Overview
            </TabsTrigger>
            <TabsTrigger value='users' onClick={() => setActiveTab('users')}>
              Users
            </TabsTrigger>
            <TabsTrigger
              value='analytics'
              onClick={() => setActiveTab('analytics')}>
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value='settings'
              onClick={() => setActiveTab('settings')}>
              Settings
            </TabsTrigger>
          </TabsList>

          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' className='h-9'>
              <SlidersHorizontal className='h-4 w-4 mr-2' />
              Filters
            </Button>
            <Button size='sm' className='h-9'>
              <Plus className='h-4 w-4 mr-2' />
              Add New
            </Button>
          </div>
        </div>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            {/* Revenue Overview */}
            <Card className='col-span-4'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Revenue Overview</CardTitle>
                <div className='flex items-center space-x-2'>
                  <Button variant='outline' size='sm' className='h-8'>
                    This Month
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='sm' className='h-8'>
                    <Download className='h-4 w-4' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='text-center p-4'>
                    <BarChart2 className='h-12 w-12 text-muted-foreground mx-auto mb-2' />
                    <p className='text-sm text-muted-foreground'>
                      Revenue chart will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-start ${!activity.read ? 'font-medium' : ''}`}>
                      <div className='mt-1'>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className='ml-3 space-y-0.5'>
                        <p className='text-sm leading-snug'>
                          {getActivityDescription(activity)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {topProducts.map((product) => (
                    <div
                      key={product.id}
                      className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='h-10 w-10 rounded-md object-cover'
                        />
                        <div>
                          <p className='text-sm font-medium'>{product.name}</p>
                          <p className='text-xs text-muted-foreground'>
                            {product.sales} sold
                          </p>
                        </div>
                      </div>
                      <span className='text-sm font-medium'>
                        KES {product.revenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          systemHealth.status === 'operational'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className='text-sm'>Status</span>
                    </div>
                    <span className='text-sm font-medium capitalize'>
                      {systemHealth.status}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Uptime
                    </span>
                    <span className='text-sm font-medium'>
                      {systemHealth.uptime}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Response Time
                    </span>
                    <span className='text-sm font-medium'>
                      {systemHealth.responseTime}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Active Users
                    </span>
                    <span className='text-sm font-medium'>
                      {systemHealth.activeUsers}
                    </span>
                  </div>
                  <div className='pt-4 border-t'>
                    <p className='text-xs text-muted-foreground'>
                      {systemHealth.lastIncident}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='users' className='space-y-4'>
          <UserManagement />
        </TabsContent>

        <TabsContent value='analytics' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <p className='text-sm text-muted-foreground'>
                Detailed analytics and insights about your platform
              </p>
            </CardHeader>
            <CardContent>
              <div className='h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='text-center p-4'>
                  <BarChart2 className='h-12 w-12 text-muted-foreground mx-auto mb-2' />
                  <p className='text-sm text-muted-foreground'>
                    Analytics dashboard will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='settings' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <p className='text-sm text-muted-foreground'>
                Configure your platform settings and preferences
              </p>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <h3 className='font-medium'>Maintenance Mode</h3>
                    <p className='text-sm text-muted-foreground'>
                      Enable maintenance mode to restrict access to the platform
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Configure
                  </Button>
                </div>
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <h3 className='font-medium'>Payment Gateways</h3>
                    <p className='text-sm text-muted-foreground'>
                      Manage payment providers and settings
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Configure
                  </Button>
                </div>
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <h3 className='font-medium'>Email Notifications</h3>
                    <p className='text-sm text-muted-foreground'>
                      Configure email templates and settings
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
