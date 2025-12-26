import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import toast from 'react-hot-toast';
import {
  Lock,
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const SecurityPage = () => {
  const { user, enableTwoFactor, verifyTwoFactor } = useAuth();
  const { updatePassword } = useUser();
  const [isLoading, setIsLoading] = useState({
    password: false,
    twoFactor: false,
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    if (!value) return;

    if (name === 'newPassword') {
      const { isValid } = validatePassword(value);
      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Password does not meet requirements',
        }));
      } else if (
        passwordForm.confirmPassword &&
        value !== passwordForm.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '',
          [name]: '',
        }));
      }
    } else if (
      name === 'confirmPassword' &&
      value !== passwordForm.newPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Passwords do not match',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear confirm password error when passwords match
    if (name === 'newPassword' && passwordForm.confirmPassword) {
      if (value === passwordForm.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '',
        }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      // Validate all fields are filled
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        toast.error('Please fill in all fields');
        return;
      }

      // Validate password requirements
      const passwordValidation = validatePassword(passwordForm.newPassword);
      if (!passwordValidation.isValid) {
        toast.error('Please ensure your new password meets all requirements');
        return;
      }

      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('New password and confirm password do not match');
        return;
      }

      console.log('Calling updatePassword with:', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      // Show loading state
      setIsLoading((prev) => ({ ...prev, password: true }));

      // Call the update password API with an object parameter
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      // On success
      toast.success('Your password has been updated successfully');

      // Reset the form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Hide the password form
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error in handleChangePassword:', {
        error,
        response: error.response?.data,
      });

      // Show user-friendly error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update password. Please try again.';

      toast.error(errorMessage);

      // Set specific field errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      // Reset loading state
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleEnableTwoFactor = async () => {
    if (user.twoFactorEnabled) return;

    // Show enhanced coming soon message
    toast(
      <div className='flex flex-col gap-1'>
        <div className='font-semibold text-white'>
          🔒 Two-Factor Authentication (2FA) Coming Soon
        </div>
        <p className='text-sm text-gray-300'>
          We're working hard to bring you enhanced security with 2FA. This
          feature will add an extra layer of protection to your account.
        </p>
        <p className='text-xs text-gray-400 mt-1'>
          Check back in our next update!
        </p>
      </div>,
      {
        style: {
          borderRadius: '0.75rem',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          padding: '1rem',
          maxWidth: '380px',
        },
        duration: 5000,
      }
    );

    /*
    setIsLoading((prev) => ({ ...prev, twoFactor: true }));

    try {
      await enableTwoFactor();
      setShowTwoFactorForm(true);
    } catch (error) {
      console.error('Error enabling two-factor authentication:', error);
      toast.error(
        error.message || 'Failed to enable two-factor authentication'
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, twoFactor: false }));
    }
    */
  };

  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();

    if (!twoFactorCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading((prev) => ({ ...prev, twoFactor: true }));

    try {
      await verifyTwoFactor(twoFactorCode);

      toast.success(
        'Two-factor authentication has been enabled for your account'
      );
      setShowTwoFactorForm(false);
      setTwoFactorCode('');
    } catch (error) {
      console.error('Error verifying two-factor authentication:', error);
      toast.error(
        error.message || 'Invalid verification code. Please try again'
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, twoFactor: false }));
    }
  };

  const securityItems = [
    {
      icon: <Lock className='h-5 w-5 text-blue-600 dark:text-blue-400' />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      title: 'Change Password',
      description: 'Update your account password',
      action: showPasswordForm ? 'Cancel' : 'Change',
      onClick: () => setShowPasswordForm(!showPasswordForm),
      content: showPasswordForm && (
        <form onSubmit={handleChangePassword} className='mt-4 space-y-4'>
          <div className='space-y-4'>
            <div>
              <Input
                label='Current Password'
                name='currentPassword'
                type={showPassword.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={errors.currentPassword}
                required
                disabled={isLoading.password}
                rightIcon={
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('current')}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                    {showPassword.current ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                }
              />
            </div>

            <div>
              <Input
                label='New Password'
                name='newPassword'
                type={showPassword.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={errors.newPassword}
                required
                disabled={isLoading.password}
                rightIcon={
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('new')}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                    {showPassword.new ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                }
              />
              {passwordForm.newPassword && (
                <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                  <p className='font-medium'>Password must contain:</p>
                  <ul className='list-disc list-inside space-y-1 mt-1'>
                    <li
                      className={
                        passwordForm.newPassword.length >= 8
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }>
                      At least 8 characters long
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(passwordForm.newPassword)
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }>
                      At least one uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(passwordForm.newPassword)
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }>
                      At least one lowercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(passwordForm.newPassword)
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }>
                      At least one number
                    </li>
                    <li
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword)
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }>
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Input
                label='Confirm New Password'
                name='confirmPassword'
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                onBlur={handlePasswordBlur}
                error={errors.confirmPassword}
                required
                disabled={isLoading.password}
                rightIcon={
                  <button
                    type='button'
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                    {showPassword.confirm ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                }
              />
              {passwordForm.newPassword && passwordForm.confirmPassword && (
                <div
                  className={`mt-1 text-xs ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordForm.newPassword === passwordForm.confirmPassword
                    ? 'Passwords match!'
                    : 'Passwords do not match'}
                </div>
              )}
            </div>
          </div>
          <div className='flex justify-end space-x-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setShowPasswordForm(false);
                setPasswordForm({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                setErrors({});
              }}
              disabled={isLoading.password}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading.password}>
              {isLoading.password ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      ),
    },
    {
      icon: <Shield className='h-5 w-5 text-purple-600 dark:text-purple-400' />,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      title: 'Two-Factor Authentication',
      description: user?.twoFactorEnabled
        ? 'Two-factor authentication is enabled for your account.'
        : 'Add an extra layer of security to your account',
      action: user?.twoFactorEnabled
        ? 'Enabled'
        : showTwoFactorForm
          ? 'Verifying...'
          : 'Enable',
      onClick: handleEnableTwoFactor,
      disabled: !user || user.twoFactorEnabled || showTwoFactorForm,
      status: user?.twoFactorEnabled ? 'enabled' : 'disabled',
      content: showTwoFactorForm && (
        <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <div className='p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30'>
                <AlertCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
              </div>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                Two-Factor Authentication
              </h3>
              <div className='mt-2 text-sm text-yellow-700 dark:text-yellow-300'>
                <p>
                  Please check your authenticator app for a verification code
                  and enter it below.
                </p>
                <form
                  onSubmit={handleVerifyTwoFactor}
                  className='mt-3 space-y-3'>
                  <Input
                    label='Verification Code'
                    type='text'
                    placeholder='Enter 6-digit code'
                    value={twoFactorCode}
                    onChange={(e) =>
                      setTwoFactorCode(
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    required
                    disabled={isLoading.twoFactor}
                  />
                  <div className='flex justify-end'>
                    <Button
                      type='submit'
                      disabled={
                        isLoading.twoFactor || twoFactorCode.length !== 6
                      }>
                      {isLoading.twoFactor ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Key className='h-5 w-5 text-green-600 dark:text-green-400' />,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      title: 'Active Sessions',
      description: 'Manage your active login sessions',
      action: 'View',
      onClick: () => {
        toast(
          <div className='flex flex-col gap-1'>
            <div className='font-semibold text-white'>
              🔐 Active Sessions Coming Soon
            </div>
            <p className='text-sm text-gray-300'>
              We're developing a way for you to view and manage your active
              login sessions across devices.
            </p>
            <p className='text-xs text-gray-400 mt-1'>
              Stay tuned for this security enhancement in an upcoming update!
            </p>
          </div>,
          {
            style: {
              borderRadius: '0.75rem',
              background: '#111827',
              color: '#fff',
              border: '1px solid #374151',
              padding: '1rem',
              maxWidth: '380px',
            },
            duration: 5000,
          }
        );
      },
    },
  ];

  return (
    <div className='w-full'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Security
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage your account security settings
        </p>
      </div>

      <div className='space-y-4'>
        {securityItems.map((item, index) => (
          <div
            key={index}
            className='bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden'>
            <div className='p-6'>
              <div className='flex items-start justify-between'>
                <div className='flex items-start space-x-4'>
                  <div className={`p-2 rounded-full ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900 dark:text-white'>
                      {item.title}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {item.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={item.status === 'enabled' ? 'outline' : 'default'}
                  size='sm'
                  onClick={item.onClick}
                  disabled={item.disabled || item.status === 'enabled'}
                  className={
                    item.status === 'enabled'
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30'
                      : ''
                  }>
                  {item.status === 'enabled' ? (
                    <span className='flex items-center'>
                      <CheckCircle className='h-4 w-4 mr-2' />
                      {item.action}
                    </span>
                  ) : (
                    item.action
                  )}
                </Button>
              </div>
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityPage;
