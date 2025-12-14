import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
      },
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      const errorMsg = 'Please fill in all required fields';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.password.length < 8) {
      const errorMsg = 'Password must be at least 8 characters long';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!formData.acceptTerms) {
      const errorMsg = 'You must accept the terms and conditions';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setIsLoading(true);
      await register(formData);
      navigate('/');
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='w-full max-w-2xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden'>
          <div className='md:flex'>
            {/* Left side - Form */}
            <div className='p-8 sm:p-10 md:w-1/2'>
              <div className='text-center mb-8'>
                <Link
                  to='/'
                  className='inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6'>
                  <ArrowLeft className='h-5 w-5 mr-2' />
                  <span>Back to home</span>
                </Link>

                <div className='flex justify-center mb-6'>
                  <div className='bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full'>
                    <User className='h-8 w-8 text-primary-600 dark:text-primary-400' />
                  </div>
                </div>

                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  Create your account
                </h2>
                <p className='mt-2 text-gray-600 dark:text-gray-400'>
                  Join us today and start shopping
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

              <form className='space-y-6' onSubmit={handleSubmit}>
                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Full Name
                    </label>
                    <Input
                      id='name'
                      name='name'
                      type='text'
                      autoComplete='name'
                      required
                      placeholder='John Doe'
                      value={formData.name}
                      onChange={handleChange}
                      startIcon={<User className='h-5 w-5 text-gray-400' />}
                      disabled={isLoading}
                    />
                  </div>

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
                      startIcon={<Mail className='h-5 w-5 text-gray-400' />}
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
                    </div>
                    <div className='relative'>
                      <Input
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        required
                        placeholder='••••••••'
                        value={formData.password}
                        onChange={handleChange}
                        startIcon={<Lock className='h-5 w-5 text-gray-400' />}
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
                    {formData.password && (
                      <div className='mt-2 space-y-1'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Password must contain:
                        </p>
                        <ul className='text-xs space-y-1'>
                          <li
                            className={`flex items-center ${passwordValidation.requirements.minLength ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordValidation.requirements.minLength ? (
                              <Check className='h-3 w-3 mr-1' />
                            ) : (
                              <X className='h-3 w-3 mr-1' />
                            )}
                            At least 8 characters
                          </li>
                          <li
                            className={`flex items-center ${passwordValidation.requirements.hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordValidation.requirements.hasUpperCase ? (
                              <Check className='h-3 w-3 mr-1' />
                            ) : (
                              <X className='h-3 w-3 mr-1' />
                            )}
                            At least one uppercase letter
                          </li>
                          <li
                            className={`flex items-center ${passwordValidation.requirements.hasLowerCase ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordValidation.requirements.hasLowerCase ? (
                              <Check className='h-3 w-3 mr-1' />
                            ) : (
                              <X className='h-3 w-3 mr-1' />
                            )}
                            At least one lowercase letter
                          </li>
                          <li
                            className={`flex items-center ${passwordValidation.requirements.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordValidation.requirements.hasNumber ? (
                              <Check className='h-3 w-3 mr-1' />
                            ) : (
                              <X className='h-3 w-3 mr-1' />
                            )}
                            At least one number
                          </li>
                          <li
                            className={`flex items-center ${passwordValidation.requirements.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordValidation.requirements.hasSpecialChar ? (
                              <Check className='h-3 w-3 mr-1' />
                            ) : (
                              <X className='h-3 w-3 mr-1' />
                            )}
                            At least one special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <label
                        htmlFor='confirmPassword'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Confirm Password
                      </label>
                    </div>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        required
                        placeholder='••••••••'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        startIcon={<Lock className='h-5 w-5 text-gray-400' />}
                        disabled={isLoading}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        className='absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent border-none cursor-pointer focus:outline-none'
                        onClick={(e) => {
                          e.preventDefault();
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                        disabled={isLoading}>
                        {showConfirmPassword ? (
                          <EyeOff className='h-5 w-5' />
                        ) : (
                          <Eye className='h-5 w-5' />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <p
                        className={`mt-1 text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                        {passwordsMatch ? (
                          <span className='flex items-center'>
                            <Check className='h-3 w-3 mr-1' />
                            Passwords match
                          </span>
                        ) : (
                          <span className='flex items-center'>
                            <X className='h-3 w-3 mr-1' />
                            Passwords don't match
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className='flex items-start'>
                    <div className='flex items-center h-5'>
                      <input
                        id='acceptTerms'
                        name='acceptTerms'
                        type='checkbox'
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700'
                        disabled={isLoading}
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <label
                        htmlFor='acceptTerms'
                        className='font-medium text-gray-700 dark:text-gray-300'>
                        I agree to the{' '}
                        <Link
                          to={ROUTES.TERMS}
                          className='text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          to={ROUTES.PRIVACY_POLICY}
                          className='text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'>
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    type='submit'
                    className='w-full justify-center py-3'
                    variant='primary'
                    size='lg'
                    disabled={isLoading || !formData.acceptTerms}>
                    {isLoading ? (
                      <>
                        <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </div>
              </form>

              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className='font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Right side - Illustration/Image */}
            <div className='hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-500 to-primary-600 p-8 flex-col justify-center items-center text-white'>
              <div className='max-w-xs text-center'>
                <div className='bg-white/20 p-4 rounded-full inline-flex items-center justify-center mb-6'>
                  <svg
                    className='h-12 w-12 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold mb-2'>
                  Welcome to Our Store
                </h3>
                <p className='text-primary-100'>
                  Create an account to get access to exclusive deals, track your
                  orders, and more.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
