import React from 'react';

const CategoryCardSkeleton = () => {
  return (
    <div className='animate-pulse'>
      <div className='h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl'></div>
      <div className='p-5 space-y-3'>
        <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6'></div>
        <div className='flex justify-between items-center pt-2'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
          <div className='h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md'></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
