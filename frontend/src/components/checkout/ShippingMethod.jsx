// src/components/checkout/ShippingMethod.jsx
import React from 'react';
import { Truck, Check } from 'lucide-react';

const shippingOptions = [
  {
    id: 'standard',
    title: 'Standard',
    description: '3-5 business days',
    price: 5.99,
  },
  {
    id: 'express',
    title: 'Express',
    description: '1-2 business days',
    price: 12.99,
  },
  {
    id: 'overnight',
    title: 'Overnight',
    description: 'Next business day',
    price: 24.99,
  },
];

const ShippingMethod = ({ register, errors, defaultMethod = 'standard' }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping method</h2>
      <div className="space-y-4">
        {shippingOptions.map((option) => (
          <div key={option.id} className="relative">
            <input
              {...register('shippingMethod', { 
                required: 'Please select a shipping method',
                value: defaultMethod 
              })}
              type="radio"
              id={option.id}
              value={option.id}
              className="sr-only"
            />
            <label
              htmlFor={option.id}
              className="block cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 has-[:checked]:border-primary-500 has-[:checked]:ring-1 has-[:checked]:ring-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 mr-3">
                  <div className="h-3 w-3 rounded-full bg-primary-600 dark:bg-primary-400 hidden" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.title}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${option.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </label>
          </div>
        ))}
        {errors.shippingMethod && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.shippingMethod.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShippingMethod;