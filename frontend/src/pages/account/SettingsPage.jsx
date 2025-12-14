import { useState } from 'react';
import { Switch } from '../../components/ui/Switch';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
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
    currency: user?.preferences?.currency ?? 'USD',
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
    <div className='max-w-2xl'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Account Settings
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage your account preferences and notification settings
        </p>
      </div>

      <div className='space-y-6'>
        {/* Notification Preferences */}
        <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden'>
          <div className='p-6'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
              Notification Preferences
            </h2>

            <div className='space-y-4'>
              <div className='flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700'>
                <div className='space-y-1'>
                  <Label
                    htmlFor='email-notifications'
                    className='text-gray-900 dark:text-white'>
                    Email Notifications
                  </Label>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  id='email-notifications'
                  checked={preferences.notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>

              <div className='flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700'>
                <div className='space-y-1'>
                  <Label
                    htmlFor='sms-notifications'
                    className='text-gray-900 dark:text-white'>
                    SMS Notifications
                  </Label>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Receive important updates via SMS
                  </p>
                </div>
                <Switch
                  id='sms-notifications'
                  checked={preferences.notifications.sms}
                  onCheckedChange={() => handleNotificationChange('sms')}
                />
              </div>

              <div className='flex items-center justify-between py-3'>
                <div className='space-y-1'>
                  <Label
                    htmlFor='promo-notifications'
                    className='text-gray-900 dark:text-white'>
                    Promotional Emails
                  </Label>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Receive special offers and promotions
                  </p>
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

        {/* Theme Preferences */}
        <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden'>
          <div className='p-6'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
              Display Preferences
            </h2>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-gray-900 dark:text-white'>Theme</Label>
                <div className='grid grid-cols-3 gap-3'>
                  {[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      type='button'
                      className={`p-4 rounded-lg border ${
                        preferences.theme === theme.value
                          ? 'border-primary-500 ring-2 ring-primary-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                      onClick={() => handleThemeChange(theme.value)}>
                      <div className='flex items-center justify-center h-8 mb-2'>
                        <div
                          className={`w-6 h-6 rounded-full ${
                            theme.value === 'light'
                              ? 'bg-gray-200'
                              : theme.value === 'dark'
                                ? 'bg-gray-800'
                                : 'bg-gradient-to-r from-gray-200 to-gray-800'
                          }`}
                        />
                      </div>
                      <span className='text-sm font-medium text-gray-900 dark:text-white'>
                        {theme.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
