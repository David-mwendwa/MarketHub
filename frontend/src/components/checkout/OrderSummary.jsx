// src/components/checkout/OrderSummary.jsx
import React from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const OrderSummary = ({
  items = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  isCheckout = false,
}) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Order Summary
        </h2>

        <div className='mt-6 space-y-4'>
          {items.map((item) => (
            <div key={item.id} className='flex items-center'>
              <div className='w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-full h-full object-cover object-center'
                />
              </div>
              <div className='ml-4 flex-1'>
                <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
                  <h3>{item.name}</h3>
                  <p className='ml-4'>
                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </p>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Qty {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-6'>
          <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
            <p>Subtotal</p>
            <p>${(subtotal || 0).toFixed(2)}</p>
          </div>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1'>
            <p>Shipping</p>
            <p>
              {!shipping || shipping === 0
                ? 'Free'
                : `$${(shipping || 0).toFixed(2)}`}
            </p>
          </div>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1'>
            <p>Tax</p>
            <p>${(tax || 0).toFixed(2)}</p>
          </div>
          <div className='flex justify-between text-lg font-bold text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <p>Total</p>
            <p>${(total || 0).toFixed(2)}</p>
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
