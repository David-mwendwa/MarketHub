import { useState } from 'react';
import { Switch } from '../../components/ui/Switch';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bell,
  Mail,
  Smartphone,
  Sun,
  Moon,
  Monitor,
  Globe,
  CreditCard,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateUserPreferences } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      sms: user?.preferences?.notifications?.sms ?? false,
      promotions: user?.preferences?.notifications?.promotions ?? true,
    },
    theme: user?.preferences?.theme ?? 'system',
    language: user?.preferences?.language ?? 'en',
    currency: user?.preferences?.currency ?? 'KES',
  });

  const handleNotificationChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleThemeChange = (theme) => {
    setPreferences((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserPreferences(preferences);
      toast.success('Your preferences have been updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error(error.message || 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Account Settings
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage your account preferences and notification settings
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className='space-y-6'>
        {/* Notifications Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
              Notifications
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Manage how you receive notifications
            </p>
          </div>

          <div className='divide-y divide-gray-200 dark:divide-gray-700'>
            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='p-2 rounded-full bg-blue-100 dark:bg-blue-900/30'>
                    <Mail className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                      Email Notifications
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Receive email notifications about your account
                    </p>
                  </div>
                </div>
                <Switch
                  id='email-notifications'
                  checked={preferences.notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>
            </div>

            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='p-2 rounded-full bg-purple-100 dark:bg-purple-900/30'>
                    <Smartphone className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                      SMS Notifications
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Receive text message notifications
                    </p>
                  </div>
                </div>
                <Switch
                  id='sms-notifications'
                  checked={preferences.notifications.sms}
                  onCheckedChange={() => handleNotificationChange('sms')}
                />
              </div>
            </div>

            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30'>
                    <Bell className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
                  </div>
                  <div>
                    <h3 className='text-base font-medium text-gray-900 dark:text-white'>
                      Promotional Emails
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Receive emails about new products and offers
                    </p>
                  </div>
                </div>
                <Switch
                  id='promo-notifications'
                  checked={preferences.notifications.promotions}
                  onCheckedChange={() => handleNotificationChange('promotions')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
              Appearance
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Customize how this application looks on your device
            </p>
          </div>

          <div className='p-6'>
            <div className='space-y-4'>
              <Label className='text-sm font-medium text-gray-900 dark:text-white'>
                Theme
              </Label>
              <div className='grid grid-cols-3 gap-4'>
                <button
                  type='button'
                  onClick={() => handleThemeChange('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
                    preferences.theme === 'light'
                      ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                  <div className='w-full h-24 mb-2 bg-white rounded-md shadow-sm border border-gray-200' />
                  <div className='flex items-center gap-2 mt-2'>
                    <Sun className='h-4 w-4 text-gray-700' />
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      Light
                    </span>
                  </div>
                </button>

                <button
                  type='button'
                  onClick={() => handleThemeChange('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
                    preferences.theme === 'dark'
                      ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                  <div className='w-full h-24 mb-2 bg-gray-900 rounded-md shadow-sm border border-gray-800' />
                  <div className='flex items-center gap-2 mt-2'>
                    <Moon className='h-4 w-4 text-gray-300' />
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      Dark
                    </span>
                  </div>
                </button>

                <button
                  type='button'
                  onClick={() => handleThemeChange('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
                    preferences.theme === 'system'
                      ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                  <div className='relative w-full h-24 mb-2 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700'>
                    <div className='absolute top-0 left-0 w-1/2 h-full bg-white border-r border-gray-200' />
                    <div className='absolute top-0 right-0 w-1/2 h-full bg-gray-900' />
                  </div>
                  <div className='flex items-center gap-2 mt-2'>
                    <Monitor className='h-4 w-4 text-gray-700 dark:text-gray-300' />
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      System
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Region Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
              Language & Region
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Choose your preferred language and region settings
            </p>
          </div>

          <div className='p-6 space-y-6'>
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <Globe className='h-5 w-5 text-gray-500' />
                <Label
                  htmlFor='language'
                  className='text-sm font-medium text-gray-900 dark:text-white'>
                  Language
                </Label>
              </div>
              <select
                id='language'
                value={preferences.language}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                className='mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white'>
                <option value='en'>English</option>
                <option value='es'>Español</option>
                <option value='fr'>Français</option>
                <option value='de'>Deutsch</option>
              </select>
            </div>

            <div>
              <div className='flex items-center gap-3 mb-2'>
                <CreditCard className='h-5 w-5 text-gray-500' />
                <Label
                  htmlFor='currency'
                  className='text-sm font-medium text-gray-900 dark:text-white'>
                  Currency
                </Label>
              </div>
              <select
                id='currency'
                value={preferences.currency}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    currency: e.target.value,
                  }))
                }
                className='mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white'>
                <option value='KES'>Kenyan Shilling (KES)</option>
                <option value='USD'>US Dollar (USD)</option>
                <option value='TZS'>Tanzanian Shilling (TZS)</option>
                <option value='UGX'>Ugandan Shilling (UGX)</option>
              </select>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className='px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center gap-2'>
            {isLoading ? (
              'Saving...'
            ) : (
              <>
                <Save className='h-4 w-4' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
