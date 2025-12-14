import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
} from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.password || !formData.confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Password does not meet the requirements');
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage(
        'Your password has been reset successfully. Redirecting to login...'
      );

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
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
            <div className='flex justify-center mb-6'>
              <div className='bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full'>
                <Shield className='h-8 w-8 text-primary-600 dark:text-primary-400' />
              </div>
            </div>

            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Reset Your Password
            </h2>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Create a new password for your account
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
                Password Reset Successful
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>{message}</p>
            </motion.div>
          ) : (
            <form className='space-y-6' onSubmit={handleSubmit}>
              <input type='hidden' name='token' value={token} />

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  New Password
                </label>
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
                          <CheckCircle className='h-3 w-3 mr-1' />
                        ) : (
                          <AlertCircle className='h-3 w-3 mr-1' />
                        )}
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center ${passwordValidation.requirements.hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
                        {passwordValidation.requirements.hasUpperCase ? (
                          <CheckCircle className='h-3 w-3 mr-1' />
                        ) : (
                          <AlertCircle className='h-3 w-3 mr-1' />
                        )}
                        At least one uppercase letter
                      </li>
                      <li
                        className={`flex items-center ${passwordValidation.requirements.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                        {passwordValidation.requirements.hasNumber ? (
                          <CheckCircle className='h-3 w-3 mr-1' />
                        ) : (
                          <AlertCircle className='h-3 w-3 mr-1' />
                        )}
                        At least one number
                      </li>
                      <li
                        className={`flex items-center ${passwordValidation.requirements.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                        {passwordValidation.requirements.hasSpecialChar ? (
                          <CheckCircle className='h-3 w-3 mr-1' />
                        ) : (
                          <AlertCircle className='h-3 w-3 mr-1' />
                        )}
                        At least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Confirm New Password
                </label>
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
                        <CheckCircle className='h-3 w-3 mr-1' />
                        Passwords match
                      </span>
                    ) : (
                      <span className='flex items-center'>
                        <AlertCircle className='h-3 w-3 mr-1' />
                        Passwords don't match
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <Button
                  type='submit'
                  className='w-full justify-center py-3'
                  variant='primary'
                  size='lg'
                  disabled={
                    isLoading || !passwordsMatch || !passwordValidation.isValid
                  }>
                  {isLoading ? (
                    <>
                      <Loader2 className='animate-spin -ml-1 mr-2 h-5 w-5' />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
