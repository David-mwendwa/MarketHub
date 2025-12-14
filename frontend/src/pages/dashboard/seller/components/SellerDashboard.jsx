import React from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  BarChart2,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/UICard';
import { Button } from '../../../components/ui/Button';
import SalesAnalytics from './SalesAnalytics';

const SellerDashboard = () => {
  // Mock data for recent orders
  const recentOrders = [
    {
      id: 'ORD-1001',
      customer: 'John Doe',
      date: '2023-11-22',
      status: 'Shipped',
      amount: 124.99,
      items: 2,
    },
    {
      id: 'ORD-1002',
      customer: 'Jane Smith',
      date: '2023-11-21',
      status: 'Processing',
      amount: 89.99,
      items: 1,
    },
    {
      id: 'ORD-1003',
      customer: 'Robert Johnson',
      date: '2023-11-20',
      status: 'Delivered',
      amount: 199.99,
      items: 3,
    },
  ];

  // Mock data for top products
  const topProducts = [
    {
      id: 'P001',
      name: 'Wireless Earbuds',
      sales: 124,
      revenue: 2475.76,
      image: 'https://via.placeholder.com/40',
    },
    {
      id: 'P002',
      name: 'Smart Watch',
      sales: 89,
      revenue: 5340.0,
      image: 'https://via.placeholder.com/40',
    },
    {
      id: 'P003',
      name: 'Bluetooth Speaker',
      sales: 76,
      revenue: 2279.24,
      image: 'https://via.placeholder.com/40',
    },
  ];

  // Mock data for order status
  const orderStatus = {
    processing: 12,
    shipped: 8,
    delivered: 108,
    cancelled: 5,
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Seller Dashboard</h2>
          <p className='text-muted-foreground'>
            Here's an overview of your business performance
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
          <Button size='sm'>
            <Plus className='h-4 w-4 mr-2' />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Products
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>42</div>
            <p className='text-xs text-muted-foreground'>+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>128</div>
            <p className='text-xs text-muted-foreground'>+24 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>KES 245,000</div>
            <p className='text-xs text-muted-foreground'>
              +18.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Customers</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>89</div>
            <p className='text-xs text-muted-foreground'>+12 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics */}
      <SalesAnalytics />

      {/* Recent Orders & Top Products */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Recent Orders */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-lg font-medium'>Recent Orders</CardTitle>
            <Button variant='ghost' size='sm' className='text-primary'>
              View All <ArrowRight className='h-4 w-4 ml-1' />
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className='flex items-center justify-between pb-3 border-b last:border-0 last:pb-0'>
                  <div>
                    <p className='font-medium text-sm'>{order.customer}</p>
                    <div className='flex items-center text-xs text-muted-foreground mt-1'>
                      <span>{order.id}</span>
                      <span className='mx-1'>•</span>
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                      <span className='mx-1'>•</span>
                      <span>
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>${order.amount.toFixed(2)}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-lg font-medium'>Top Products</CardTitle>
            <Button variant='ghost' size='sm' className='text-primary'>
              View All <ArrowRight className='h-4 w-4 ml-1' />
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='h-10 w-10 rounded-md object-cover'
                    />
                    <div>
                      <p className='font-medium text-sm'>{product.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {product.sales} sold
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>${product.revenue.toFixed(2)}</p>
                    <p className='text-xs text-muted-foreground'>
                      ${(product.revenue / product.sales).toFixed(2)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='border rounded-lg p-4 text-center'>
              <div className='mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2'>
                <Package className='h-6 w-6 text-blue-600' />
              </div>
              <p className='text-sm text-muted-foreground'>Total</p>
              <p className='text-xl font-bold'>{orderStatus.total}</p>
            </div>
            <div className='border rounded-lg p-4 text-center'>
              <div className='mx-auto h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2'>
                <Clock className='h-6 w-6 text-yellow-600' />
              </div>
              <p className='text-sm text-muted-foreground'>Pending</p>
              <p className='text-xl font-bold'>{orderStatus.pending}</p>
            </div>
            <div className='border rounded-lg p-4 text-center'>
              <div className='mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <p className='text-sm text-muted-foreground'>Delivered</p>
              <p className='text-xl font-bold'>{orderStatus.delivered}</p>
            </div>
            <div className='border rounded-lg p-4 text-center'>
              <div className='mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2'>
                <XCircle className='h-6 w-6 text-red-600' />
              </div>
              <p className='text-sm text-muted-foreground'>Cancelled</p>
              <p className='text-xl font-bold'>{orderStatus.cancelled}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;
