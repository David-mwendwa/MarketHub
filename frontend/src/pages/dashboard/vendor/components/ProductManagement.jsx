import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/DropdownMenu';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-001',
      price: 89.99,
      stock: 45,
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    },
    {
      id: 2,
      name: 'Smart Watch',
      sku: 'SW-002',
      price: 199.99,
      stock: 12,
      status: 'active',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      sku: 'BS-003',
      price: 59.99,
      stock: 0,
      status: 'out_of_stock',
      image:
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h2 className='text-2xl font-bold'>Product Management</h2>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add Product
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search products...'
            className='pl-9'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant='outline'>
          <Filter className='h-4 w-4 mr-2' />
          Filter
        </Button>
      </div>

      <div className='rounded-md border'>
        <div className='relative w-full overflow-auto'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='[&_tr]:border-b'>
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  Product
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  SKU
                </th>
                <th className='h-12 px-4 text-right align-middle font-medium text-muted-foreground'>
                  Price
                </th>
                <th className='h-12 px-4 text-right align-middle font-medium text-muted-foreground'>
                  Stock
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  Status
                </th>
                <th className='h-12 px-4 text-right align-middle font-medium text-muted-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='[&_tr:last-child]:border-0'>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className='border-b transition-colors hover:bg-muted/50'>
                  <td className='p-4 align-middle'>
                    <div className='flex items-center gap-4'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='h-10 w-10 rounded-md object-cover'
                      />
                      <span className='font-medium'>{product.name}</span>
                    </div>
                  </td>
                  <td className='p-4 align-middle text-muted-foreground'>
                    {product.sku}
                  </td>
                  <td className='p-4 text-right align-middle font-medium'>
                    KES {product.price.toFixed(2)}
                  </td>
                  <td className='p-4 text-right align-middle'>
                    {product.stock} units
                  </td>
                  <td className='p-4 align-middle'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className='p-4 text-right align-middle'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>
                          <Eye className='mr-2 h-4 w-4' />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className='mr-2 h-4 w-4' />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-red-600'>
                          <Trash2 className='mr-2 h-4 w-4' />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
