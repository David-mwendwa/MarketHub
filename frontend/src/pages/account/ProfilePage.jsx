import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        ...formData,
        avatar: avatarPreview,
      });

      toast.success('Your profile has been updated successfully');

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-2xl'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          My Profile
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage your personal information and preferences
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden'>
        <div className='p-6'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8'>
            <div className='flex items-center space-x-4 mb-4 sm:mb-0'>
              <div className='relative'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage
                    src={avatarPreview}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback>
                    {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    className='absolute -bottom-2 -right-2 bg-primary-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-primary-600 transition-colors'
                    htmlFor='avatar-upload'>
                    <input
                      id='avatar-upload'
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleAvatarChange}
                    />
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                    </svg>
                  </label>
                )}
              </div>
              <div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                  {user.firstName} {user.lastName}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {user.email}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                    });
                    setAvatarPreview(user.avatar || '');
                  }}
                  disabled={isLoading}>
                  Cancel
                </Button>
                <Button size='sm' onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  label='First Name'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label='Last Name'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Input
                label='Phone Number'
                name='phone'
                type='tel'
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </form>
          ) : (
            <div className='space-y-6'>
              <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Personal Information
                </h3>
                <dl className='space-y-4'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Full Name
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2'>
                      {user.firstName} {user.lastName}
                    </dd>
                  </div>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Email
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2'>
                      {user.email}
                    </dd>
                  </div>
                  {user.phone && (
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Phone
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2'>
                        {user.phone}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
