import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Test credentials for different user roles
const TEST_CREDENTIALS = {
  admin: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@marketplace.test',
    password: 'Admin@123',
  },
  vendor: {
    firstName: 'Vendor',
    lastName: 'User',
    email: 'vendor@marketplace.test',
    password: 'Vendor@123',
  },
  customer: {
    firstName: 'Customer',
    lastName: 'User',
    email: 'customer@marketplace.test',
    password: 'Customer@123',
  },
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'customer',
  });
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleRoleSelect = (role) => {
    const credentials = TEST_CREDENTIALS[role];
    if (!credentials) {
      console.error(`No credentials found for role: ${role}`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      role,
      email: credentials.email,
      password: credentials.password,
      rememberMe: true,
    }));
    setShowRoleSelector(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      const errorMsg = 'Please enter both email and password';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setIsLoading(true);
      // Get the user data from the login function
      const user = await login(formData.email, formData.password);

      // Determine the redirect path based on user role
      let redirectPath = from;

      // If coming from the home page or auth pages, redirect to the appropriate dashboard
      if (from === '/' || from.startsWith('/auth')) {
        if (user?.role === 'admin') {
          redirectPath = '/dashboard/admin';
        } else if (user?.role === 'vendor') {
          redirectPath = '/dashboard/vendor';
        } else {
          // Default for buyers or other roles
          redirectPath = '/';
        }
      }

      // Navigate to the determined path
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const errorMsg =
        err.message ||
        'Failed to sign in. Please check your credentials and try again.';
      setError(errorMsg);
      toast.error(errorMsg);
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
              to='/'
              className='inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6'>
              <ArrowLeft className='h-5 w-5 mr-2' />
              <span>Back to home</span>
            </Link>

            <div className='flex justify-center mb-6'>
              <div className='bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full'>
                <Lock className='h-8 w-8 text-primary-600 dark:text-primary-400' />
              </div>
            </div>

            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Welcome back
            </h2>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Sign in to your account to continue
            </p>

            <div className='mt-4 mb-6'>
              <div className='flex items-center mb-2'>
                <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Test Account Login
                </h3>
                <span className='ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full'>
                  Testing Only
                </span>
                <div className='group relative ml-2'>
                  <span className='text-gray-400 hover:text-gray-500 cursor-help'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </span>
                  <div className='hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-xs text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 rounded shadow-lg border border-gray-200 dark:border-gray-700'>
                    Select a test account role to auto-fill login credentials.
                    These are pre-configured test accounts for demonstration
                    purposes only.
                  </div>
                </div>
              </div>
              <div
                className='flex items-center justify-between p-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer border-2 border-dashed border-blue-300 dark:border-blue-900/50 overflow-hidden'
                onClick={() => setShowRoleSelector(!showRoleSelector)}>
                <div className='flex items-center min-w-0 flex-1'>
                  <div className='flex items-center min-w-0'>
                    <span className='capitalize font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap text-sm'>
                      {formData.role}
                    </span>
                    <span className='ml-2.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0'>
                      {TEST_CREDENTIALS[formData.role]?.name ||
                        'Custom Account'}
                    </span>
                    {TEST_CREDENTIALS[formData.role]?.email ===
                      formData.email && (
                      <span className='ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0'>
                        Credentials Loaded
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                    showRoleSelector ? 'rotate-180' : ''
                  }`}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>

              {showRoleSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 space-y-2 overflow-hidden'>
                  {Object.entries(TEST_CREDENTIALS).map(
                    ([role, credential]) => (
                      <div
                        key={role}
                        className={`p-3 rounded-lg cursor-pointer ${
                          formData.role === role
                            ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleRoleSelect(role)}>
                        <div className='flex items-center w-full justify-between'>
                          <div className='flex items-center min-w-0'>
                            <div
                              className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${
                                formData.role === role
                                  ? 'border-primary-500 bg-primary-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}>
                              {formData.role === role && (
                                <div className='w-2.5 h-2.5 rounded-full bg-white' />
                              )}
                            </div>
                            <div className='min-w-0'>
                              <div className='text-sm font-medium text-gray-700 dark:text-gray-300 capitalize truncate'>
                                {credential.firstName} {credential.lastName}
                              </div>
                              <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                                {credential.email}
                              </div>
                            </div>
                          </div>
                          <span className='text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 whitespace-nowrap ml-2'>
                            Use {role}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </div>
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

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
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
                  value={formData.email}
                  onChange={handleChange}
                  startIcon={Mail}
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-1'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Password
                  </label>
                  <Link
                    to='/forgot-password'
                    className='text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'>
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    required
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={handleChange}
                    startIcon={Lock}
                    disabled={isLoading}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    className='absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent border-none cursor-pointer focus:outline-none'
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    disabled={isLoading}>
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='rememberMe'
                  type='checkbox'
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700'
                  disabled={isLoading}
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
                  Remember me
                </label>
              </div>
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300 dark:border-gray-600' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <button
                type='button'
                className='w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                disabled={isLoading}>
                <svg
                  className='w-5 h-5 mr-2'
                  viewBox='0 0 24 24'
                  aria-hidden='true'>
                  <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
                    <path
                      fill='#4285F4'
                      d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.049 -9.20451 56.159 -10.1045 56.879 L -10.0945 60.819 L -6.275 60.819 C -3.845 58.429 -3.264 54.799 -3.264 51.509 Z'
                    />
                    <path
                      fill='#34A853'
                      d='M -14.754 63.239 C -11.514 63.239 -8.80451 62.159 -6.825 60.809 L -10.0945 56.879 C -11.0545 57.549 -12.3045 57.929 -13.6245 57.929 C -16.4945 57.929 -18.9845 55.909 -19.7845 53.259 L -23.0945 53.259 L -23.0945 57.319 C -21.1445 61.279 -17.134 63.239 -14.754 63.239 Z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M -19.7845 53.259 C -20.0645 52.399 -20.2145 51.479 -20.2145 50.529 C -20.2145 49.579 -20.0645 48.659 -19.7845 47.799 L -19.7845 43.739 L -23.0945 43.739 C -24.1445 45.889 -24.7245 48.269 -24.7245 50.529 C -24.7245 52.789 -24.1445 55.169 -23.0945 57.319 L -19.7845 53.259 Z'
                    />
                    <path
                      fill='#EA4335'
                      d='M -14.754 43.149 C -12.774 43.149 -10.9445 43.799 -9.43451 45.059 L -6.275 41.999 C -8.80451 39.639 -12.514 38.819 -14.754 39.829 C -17.134 40.839 -19.0045 43.529 -19.7845 47.799 L -16.4745 47.799 C -16.0345 45.809 -15.2845 44.299 -14.754 43.149 Z'
                    />
                  </g>
                </svg>
                <span>Google</span>
              </button>

              <button
                type='button'
                className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                disabled={isLoading}>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm-1-13h2v6h-2V5zm0 8h2v2h-2v-2z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>

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

export default Login;
