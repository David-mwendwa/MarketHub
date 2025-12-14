import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='text-center'>
        <h1 className='text-6xl font-extrabold text-primary-600 dark:text-primary-500'>
          404
        </h1>
        <h2 className='mt-4 text-3xl font-bold text-gray-900 dark:text-white'>
          Page not found
        </h2>
        <p className='mt-4 text-gray-600 dark:text-gray-400'>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className='mt-8 flex flex-col sm:flex-row justify-center gap-4'>
          <Button as={Link} to='/' startIcon={<Home className='h-5 w-5' />}>
            Go back home
          </Button>
          <Button
            as='button'
            onClick={() => window.history.back()}
            variant='outline'
            startIcon={<ArrowLeft className='h-5 w-5' />}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
