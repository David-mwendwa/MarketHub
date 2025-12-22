import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Trash2, ImageOff } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const OrderSummary = ({
  items = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  isCheckout = false,
  hasOrderProtection = false,
}) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Order Summary
        </h2>

        <div className='mt-6 space-y-4'>
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className='flex items-center'>
              <div
                key={`${item.id}-image-${index}`}
                className='w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-center'>
                {imageErrors[item.id] ? (
                  <div className='text-gray-400'>
                    <ImageOff className='h-6 w-6' />
                  </div>
                ) : (
                  <img
                    src={
                      item.image || item.thumbnail || '/placeholder-product.jpg'
                    }
                    alt={item.name}
                    onError={() => handleImageError(item.id)}
                    className='w-full h-full object-cover object-center'
                  />
                )}
              </div>
              <div key={`${item.id}-details-${index}`} className='ml-4 flex-1'>
                <div
                  key={`${item.id}-header-${index}`}
                  className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
                  <h3 className='line-clamp-1'>{item.name}</h3>
                  <p className='ml-4 whitespace-nowrap'>
                    {formatCurrency((item.price || 0) * (item.quantity || 0))}
                  </p>
                </div>
                <p
                  key={`${item.id}-quantity-${index}`}
                  className='text-sm text-gray-500 dark:text-gray-400'>
                  Qty {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-6'>
          <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
            <p>Subtotal</p>
            <p>{formatCurrency(subtotal || 0)}</p>
          </div>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1'>
            <p>Shipping</p>
            <p>
              {!shipping || shipping === 0
                ? 'Free'
                : formatCurrency(shipping || 0)}
            </p>
          </div>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1'>
            <p>Tax</p>
            <p>{formatCurrency(tax || 0)}</p>
          </div>
          {hasOrderProtection && (
            <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1'>
              <p>Order Protection</p>
              <p>Ksh 500</p>
            </div>
          )}
          <div className='flex justify-between text-lg font-bold text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <p>Total</p>
            <p>{formatCurrency(total || 0)}</p>
          </div>
        </div>

        {!isCheckout && (
          <div className='mt-6'>
            <Button as={Link} to='/checkout' className='w-full'>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
