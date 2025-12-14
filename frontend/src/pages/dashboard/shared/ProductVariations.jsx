import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pencil, Trash2, Plus } from 'lucide-react';

const ProductVariations = ({ variations = [] }) => {
  if (variations.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-600 dark:text-gray-400'>
          No variations available for this product.
        </p>
      </div>
    );
  }

  // Get all unique attribute names
  const attributeNames = [
    ...new Set(variations.flatMap((v) => Object.keys(v.attributes || {}))),
  ];

  return (
    <div className='space-y-4'>
      <div className='rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <Table className='dark:bg-gray-800'>
          <TableHeader>
            <TableRow>
              <TableHead className='dark:bg-gray-800 dark:text-gray-300'>
                Variant
              </TableHead>
              {attributeNames.map((attr, index) => (
                <TableHead
                  key={index}
                  className='capitalize dark:bg-gray-800 dark:text-gray-300'>
                  {attr}
                </TableHead>
              ))}
              <TableHead className='dark:bg-gray-800 dark:text-gray-300'>
                Price
              </TableHead>
              <TableHead className='dark:bg-gray-800 dark:text-gray-300'>
                Stock
              </TableHead>
              <TableHead className='dark:bg-gray-800 dark:text-gray-300'>
                SKU
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variations.map((variant, index) => (
              <TableRow
                key={variant.id || index}
                className='dark:border-gray-700 dark:hover:bg-gray-700/50'>
                <TableCell>
                  <div className='flex items-center space-x-3'>
                    {variant.image && (
                      <div className='h-10 w-10 rounded-md overflow-hidden border'>
                        <img
                          src={variant.image}
                          alt=''
                          className='h-full w-full object-cover'
                        />
                      </div>
                    )}
                    <span className='font-medium text-gray-900 dark:text-gray-100'>
                      {variant.name || `Variant ${index + 1}`}
                    </span>
                  </div>
                </TableCell>

                {attributeNames.map((attr, attrIndex) => (
                  <TableCell key={attrIndex}>
                    <Badge
                      variant='outline'
                      className='font-normal dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'>
                      {variant.attributes?.[attr] || '-'}
                    </Badge>
                  </TableCell>
                ))}

                <TableCell>
                  <span className='font-medium text-gray-900 dark:text-gray-100'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(variant.price)}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={variant.stock > 0 ? 'outline' : 'destructive'}
                    className={`min-w-[60px] justify-center ${
                      variant.stock > 0
                        ? 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                        : ''
                    }`}>
                    {variant.stock || 0}
                  </Badge>
                </TableCell>

                <TableCell className='font-mono text-sm'>
                  {variant.sku || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='text-sm text-muted-foreground'>
        {variations.length} variation{variations.length !== 1 ? 's' : ''} in
        total
      </div>
    </div>
  );
};

export default ProductVariations;
