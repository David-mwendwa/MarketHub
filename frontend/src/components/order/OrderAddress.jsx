import React from 'react';
import { MapPin } from 'lucide-react';

export const OrderAddress = ({ address, title = 'Shipping Address' }) => {
  if (!address) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          {title}
        </h3>
        <p className='text-gray-500 dark:text-gray-400'>No address provided</p>
      </div>
    );
  }

  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    region,
    postalCode,
    country,
    isDefault,
  } = address;

  // Fallback for old address format (string)
  if (typeof address === 'string') {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          {title}
        </h3>
        <div className='space-y-2'>
          {address.split(',').map((line, i) => (
            <p key={i} className='text-gray-600 dark:text-gray-300'>
              {line.trim()}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
      <div className='flex items-start justify-between'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          {title}
        </h3>
        {isDefault && (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
            Default
          </span>
        )}
      </div>

      <div className='mt-4 space-y-2'>
        <div className='flex items-start'>
          <MapPin className='h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0' />
          <div>
            <p className='text-gray-900 dark:text-white font-medium'>
              {fullName}
            </p>
            <p className='text-gray-600 dark:text-gray-300'>{addressLine1}</p>
            {addressLine2 && (
              <p className='text-gray-600 dark:text-gray-300'>{addressLine2}</p>
            )}
            <p className='text-gray-600 dark:text-gray-300'>
              {[city, region, postalCode].filter(Boolean).join(', ')}
            </p>
            <p className='text-gray-600 dark:text-gray-300'>{country}</p>
            {phone && (
              <p className='mt-2 text-gray-600 dark:text-gray-300'>
                <span className='font-medium'>Phone:</span> {phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAddress;
