import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Calendar,
  Filter,
  Download,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProductAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [chartType, setChartType] = useState('bar');

  // Mock data for product performance
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 4390 },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', value: 4000 },
    { name: 'Smart Watch', value: 3000 },
    { name: 'Bluetooth Speaker', value: 2000 },
    { name: 'Phone Case', value: 1500 },
    { name: 'Other', value: 1000 },
  ];

  const productPerformance = [
    {
      id: 1,
      name: 'Wireless Headphones',
      views: 1245,
      addToCart: 320,
      purchases: 245,
      revenue: 22050,
      conversion: '19.6%',
    },
    {
      id: 2,
      name: 'Smart Watch',
      views: 980,
      addToCart: 210,
      purchases: 180,
      revenue: 35980,
      conversion: '18.4%',
    },
    // Add more products as needed
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='sales'
              stroke='#8884d8'
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={topProducts}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={120}
              fill='#8884d8'
              dataKey='value'
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }>
              {topProducts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `KES ${value.toLocaleString()}`,
                'Revenue',
              ]}
            />
            <Legend />
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip
              formatter={(value) => [`KES ${value.toLocaleString()}`, 'Sales']}
            />
            <Legend />
            <Bar dataKey='sales' fill='#8884d8' name='Sales' />
          </BarChart>
        );
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h2 className='text-2xl font-bold'>Product Analytics</h2>
        <div className='flex items-center gap-2'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-[180px]'>
              <Calendar className='h-4 w-4 mr-2' />
              <SelectValue placeholder='Select time range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7days'>Last 7 days</SelectItem>
              <SelectItem value='30days'>Last 30 days</SelectItem>
              <SelectItem value='90days'>Last 90 days</SelectItem>
              <SelectItem value='year'>This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>KES 245,000</div>
            <p className='text-xs text-muted-foreground'>
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
            <ShoppingBag className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-xs text-muted-foreground'>+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Order Value
            </CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>KES 12,450</div>
            <p className='text-xs text-muted-foreground'>+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Conversion Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3.2%</div>
            <p className='text-xs text-muted-foreground'>
              +0.8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Sales Overview</CardTitle>
            <div className='flex items-center space-x-2'>
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size='icon'
                onClick={() => setChartType('bar')}>
                <BarChart2 className='h-4 w-4' />
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size='icon'
                onClick={() => setChartType('line')}>
                <LineChartIcon className='h-4 w-4' />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'ghost'}
                size='icon'
                onClick={() => setChartType('pie')}>
                <PieChartIcon className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    nameKey='name'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }>
                    {topProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `KES ${value.toLocaleString()}`,
                      'Revenue',
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Product Performance</CardTitle>
            <Button variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Views
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Add to Cart
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Purchases
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Revenue
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {productPerformance.map((product) => (
                  <tr key={product.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
                      {product.views.toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
                      {product.addToCart.toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
                      {product.purchases.toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right'>
                      KES {product.revenue.toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
                      {product.conversion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAnalytics;
