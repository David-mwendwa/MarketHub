import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { format } from 'date-fns';
import { Info, Tag, DollarSign, Box, Calendar, FileText } from 'lucide-react';
import { Separator } from '../../../components/ui/Separator';
import { formatCurrency } from '../../../lib/utils';

const ProductDetails = ({ product }) => {
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  const details = [
    {
      icon: <Info className='h-4 w-4' />,
      label: 'Status',
      value: (
        <Badge
          variant={
            product.status === 'active'
              ? 'success'
              : product.status === 'pending'
                ? 'warning'
                : 'destructive'
          }>
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </Badge>
      ),
    },
    {
      icon: <DollarSign className='h-4 w-4' />,
      label: 'Price',
      value: formatCurrency(product.price),
    },
    {
      icon: <Box className='h-4 w-4' />,
      label: 'Stock',
      value: `${product.stock} available`,
    },
    {
      icon: <Tag className='h-4 w-4' />,
      label: 'Category',
      value: product.category || 'Uncategorized',
    },
    {
      icon: <Calendar className='h-4 w-4' />,
      label: 'Created',
      value: product.createdAt
        ? format(new Date(product.createdAt), 'PPpp')
        : 'N/A',
    },
    {
      icon: <Calendar className='h-4 w-4' />,
      label: 'Last Updated',
      value: product.updatedAt
        ? format(new Date(product.updatedAt), 'PPpp')
        : 'N/A',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Product Information Section */}
      <div>
        <h3 className='text-lg font-medium mb-4'>Product Information</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {details.map((item, index) => (
            <div key={index} className='flex items-start space-x-3'>
              <div className='mt-0.5 text-muted-foreground'>{item.icon}</div>
              <div>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  {item.label}
                </p>
                <div className='text-sm text-gray-700 dark:text-gray-300'>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metadata Section */}
      {product.metadata && Object.keys(product.metadata).length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className='text-lg font-medium mb-4'>Additional Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(product.metadata).map(([key, value]) => (
                <div key={key} className='flex items-start space-x-3'>
                  <div className='mt-0.5 text-muted-foreground'>
                    <FileText className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white capitalize'>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                      {value || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />
      {/* Description Section */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          Description
        </h3>
        {product?.description ? (
          <div
            className='prose max-w-none text-gray-700 dark:text-gray-300'
            dangerouslySetInnerHTML={renderHTML(product.description)}
          />
        ) : (
          <p className='text-gray-700 dark:text-gray-300'>
            No description provided.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
