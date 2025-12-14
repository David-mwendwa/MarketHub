import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Shield, Key, CheckCircle, AlertCircle } from 'lucide-react';

const SecurityPage = () => {
  const { user, updatePassword, enableTwoFactor, verifyTwoFactor } = useAuth();
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

  const validatePassword = () => {
    const newErrors = {};

    if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading((prev) => ({ ...prev, password: true }));

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success('Your password has been updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleEnableTwoFactor = async () => {
    if (user.twoFactorEnabled) return;

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
      icon: <Lock className='h-5 w-5 text-gray-500' />,
      title: 'Change Password',
      description: 'Update your account password',
      action: showPasswordForm ? 'Cancel' : 'Change',
      onClick: () => setShowPasswordForm(!showPasswordForm),
      content: showPasswordForm && (
        <form onSubmit={handleChangePassword} className='mt-4 space-y-4'>
          <Input
            label='Current Password'
            name='currentPassword'
            type='password'
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            required
            disabled={isLoading.password}
          />
          <Input
            label='New Password'
            name='newPassword'
            type='password'
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            error={errors.newPassword}
            required
            disabled={isLoading.password}
          />
          <Input
            label='Confirm New Password'
            name='confirmPassword'
            type='password'
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            error={errors.confirmPassword}
            required
            disabled={isLoading.password}
          />
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
      icon: <Shield className='h-5 w-5 text-gray-500' />,
      title: 'Two-Factor Authentication',
      description: user.twoFactorEnabled
        ? 'Two-factor authentication is enabled for your account.'
        : 'Add an extra layer of security to your account',
      action: user.twoFactorEnabled
        ? 'Enabled'
        : showTwoFactorForm
          ? 'Verifying...'
          : 'Enable',
      onClick: handleEnableTwoFactor,
      disabled: user.twoFactorEnabled || showTwoFactorForm,
      status: user.twoFactorEnabled ? 'enabled' : 'disabled',
      content: showTwoFactorForm && (
        <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <AlertCircle className='h-5 w-5 text-yellow-500' />
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
      icon: <Key className='h-5 w-5 text-gray-500' />,
      title: 'Active Sessions',
      description: 'Manage your active login sessions',
      action: 'View',
      onClick: () => console.log('View sessions'),
    },
  ];

  return (
    <div className='max-w-2xl'>
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
                  <div className='p-2 rounded-full bg-gray-100 dark:bg-gray-700'>
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
