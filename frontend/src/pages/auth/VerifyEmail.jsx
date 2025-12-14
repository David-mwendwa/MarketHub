import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const { verifyEmail } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) {
          throw new Error('No verification token provided');
        }

        await verifyEmail(token);
        setStatus('success');
        setMessage(
          'Your email has been successfully verified! You can now log in.'
        );
      } catch (error) {
        console.error('Email verification failed:', error);
        setStatus('error');
        setMessage(
          error.message ||
            'Failed to verify email. The link may have expired or is invalid.'
        );
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleResendVerification = async () => {
    try {
      // You would typically call an API to resend the verification email
      setStatus('verifying');
      setMessage('Sending a new verification email...');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      setMessage(
        'A new verification email has been sent. Please check your inbox.'
      );
    } catch (error) {
      setStatus('error');
      setMessage(
        'Failed to resend verification email. Please try again later.'
      );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            {status === 'verifying' && 'Verifying Email'}
            {status === 'success' && 'Email Verified'}
            {status === 'error' && 'Verification Failed'}
          </h2>
        </div>

        <div className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div className='text-center'>
              {status === 'verifying' && (
                <div className='flex justify-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
                </div>
              )}

              {status === 'success' && (
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900'>
                  <svg
                    className='h-6 w-6 text-green-600 dark:text-green-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              )}

              {status === 'error' && (
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900'>
                  <svg
                    className='h-6 w-6 text-red-600 dark:text-red-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </div>
              )}

              <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
                {message}
              </p>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            {status === 'error' && (
              <Button
                type='button'
                onClick={handleResendVerification}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                Resend Verification Email
              </Button>
            )}

            {status === 'success' && (
              <Button
                type='button'
                onClick={() => navigate(ROUTES.LOGIN)}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                Go to Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
