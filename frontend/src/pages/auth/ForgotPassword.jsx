import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage(
        'If an account exists with this email, you will receive a password reset link shortly.'
      );
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-10'>
          <div className='text-center mb-8'>
            <Link
              to='/login'
              className='inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6'>
              <ArrowLeft className='h-5 w-5 mr-2' />
              <span>Back to sign in</span>
            </Link>

            <div className='flex justify-center mb-6'>
              <div className='bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full'>
                <Lock className='h-8 w-8 text-primary-600 dark:text-primary-400' />
              </div>
            </div>

            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Forgot your password?
            </h2>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md'>
              <div className='flex'>
                <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
                <div className='ml-3'>
                  <p className='text-sm text-red-700 dark:text-red-300'>
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {message ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4'>
                <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                Check your email
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>{message}</p>
              <Button
                as={Link}
                to='/login'
                variant='outline'
                className='w-full justify-center'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to sign in
              </Button>
            </motion.div>
          ) : (
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Email address
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startIcon={<Mail className='h-5 w-5 text-gray-400' />}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Button
                  type='submit'
                  className='w-full justify-center py-3'
                  variant='primary'
                  size='lg'
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Don't have an account?{' '}
              <Link
                to='/register'
                className='font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'>
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
