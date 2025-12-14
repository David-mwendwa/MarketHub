import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';

const Unauthorized = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='max-w-md w-full space-y-6 text-center'>
        <div className='text-center'>
          <div className='mx-auto flex items-center justify-center h-24 w-24 text-red-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-full w-full'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            Unauthorized Access
          </h2>
          <p className='mt-2 text-lg text-gray-600 dark:text-gray-300'>
            You don't have permission to access this page.
          </p>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Please contact an administrator if you believe this is a mistake.
          </p>
        </div>

        <div className='mt-8 flex flex-col sm:flex-row justify-center gap-4'>
          <Button asChild>
            <Link to={from} className='w-full sm:w-auto justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
                  clipRule='evenodd'
                />
              </svg>
              Go Back
            </Link>
          </Button>

          <Button variant='outline' asChild>
            <Link to={ROUTES.HOME} className='w-full sm:w-auto justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
              Go Home
            </Link>
          </Button>
        </div>

        <div className='mt-8 border-t border-gray-200 dark:border-gray-700 pt-6'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Need help?{' '}
            <Link
              to={ROUTES.CONTACT}
              className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
