import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/Avatar';
import { CheckCircle, AlertCircle, Pencil, X, Save } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const ProfilePage = () => {
  const {
    profile,
    updateProfile,
    updatePassword,
    refreshToken,
    isLoading,
    error,
  } = useUser();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: profile?.user?.firstName || '',
      lastName: profile?.user?.lastName || '',
      phone: profile?.user?.phone || '',
    },
  });

  // Update form defaults when profile changes
  useEffect(() => {
    if (profile?.user) {
      reset({
        firstName: profile.user.firstName || '',
        lastName: profile.user.lastName || '',
        phone: profile.user.phone || '',
      });
      setAvatarPreview(profile.user.avatar?.url || '');
    }
  }, [profile, reset]);

  // Update form defaults when profile changes
  useEffect(() => {
    if (profile?.user) {
      reset({
        firstName: profile.user.firstName || '',
        lastName: profile.user.lastName || '',
        phone: profile.user.phone || '',
      });
      setAvatarPreview(profile.user.avatar?.url || '');
    }
  }, [profile, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset the isAvatarRemoved flag when a new file is selected
      setIsAvatarRemoved(false);

      // Set the file for upload
      setAvatarFile(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        // Clear the input value to allow re-uploading the same file
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    reset();
    setAvatarPreview(profile?.user?.avatar?.url || '');
    setAvatarFile(null);
    setIsAvatarRemoved(false);
    setIsEditing(false);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile('REMOVE');
    setAvatarPreview('');
    setIsAvatarRemoved(true);
  };

  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Handle avatar changes (new upload or removal)
      if (avatarFile === 'REMOVE') {
        formData.append('removeAvatar', 'true');
      } else if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // The updateProfile function from UserContext handles the state update and shows a toast
      await updateProfile(formData);
      setAvatarFile(null); // Reset avatar file state
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner size='lg' centered />
      </div>
    );
  }

  if (isLoading && !profile) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner size='lg' centered />
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg'>
        Error loading profile: {error.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            My Profile
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            View and manage your personal information
          </p>
        </div>
        {!isEditing && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditing(true)}
            className='flex items-center gap-2'>
            <Pencil className='h-4 w-4' />
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Profile Information */}
        <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden'>
          <div className='p-6'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6'>
              <div className='flex-shrink-0 relative group'>
                <div className='relative flex h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700'>
                  {!isAvatarRemoved &&
                  (avatarPreview || profile?.user?.avatar?.url) ? (
                    <img
                      src={avatarPreview || profile?.user?.avatar?.url}
                      alt={`${profile?.user?.firstName} ${profile?.user?.lastName}`}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center text-2xl font-medium text-gray-700 dark:text-gray-200 ${!isAvatarRemoved && (avatarPreview || profile?.user?.avatar?.url) ? 'hidden' : 'flex'}`}>
                    {profile?.user?.firstName?.[0]?.toUpperCase()}
                    {profile?.user?.lastName?.[0]?.toUpperCase()}
                  </div>
                </div>
                {isEditing && (
                  <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 group-hover:opacity-100 opacity-70 hover:opacity-100 transition-all duration-300 bg-gradient-to-b from-black/40 to-transparent rounded-full'>
                    <div className='relative group/controls'>
                      <div className='absolute -inset-1.5 bg-white/20 rounded-full animate-pulse group-hover/controls:animate-none' />
                      <div className='flex flex-col items-center gap-3 relative'>
                        <label className='group/btn bg-white/90 hover:bg-white backdrop-blur-sm text-gray-800 rounded-full p-2 cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-white/20'>
                          <Pencil className='h-4 w-4' />
                          <input
                            type='file'
                            className='hidden'
                            accept='image/*'
                            onChange={handleAvatarChange}
                          />
                          <span className='sr-only'>Change avatar</span>
                        </label>
                        {!isAvatarRemoved && profile?.user?.avatar?.url && (
                          <button
                            type='button'
                            onClick={handleRemoveAvatar}
                            className='group/remove bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-white/20'
                            title='Remove avatar'
                            aria-label='Remove avatar'>
                            <X className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='text-center sm:text-left space-y-2 flex-1'>
                {isEditing ? (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='firstName'
                          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          First Name
                        </label>
                        <input
                          id='firstName'
                          type='text'
                          {...register('firstName', {
                            required: 'First name is required',
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                          disabled={isUpdating}
                        />
                        {errors.firstName && (
                          <p className='mt-1 text-sm text-red-600'>
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor='lastName'
                          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Last Name
                        </label>
                        <input
                          id='lastName'
                          type='text'
                          {...register('lastName', {
                            required: 'Last name is required',
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                          disabled={isUpdating}
                        />
                        {errors.lastName && (
                          <p className='mt-1 text-sm text-red-600'>
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor='phone'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Phone Number
                      </label>
                      <input
                        id='phone'
                        type='tel'
                        {...register('phone')}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {profile?.user?.firstName} {profile?.user?.lastName}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-300'>
                      {profile?.user?.email}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Member since{' '}
                      {new Date(profile?.user?.createdAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className='border-t border-gray-200 dark:border-gray-700 px-6 py-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Account Details
              </h3>
              {isEditing && (
                <div className='flex space-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleCancelEdit}
                    disabled={isUpdating}>
                    <X className='h-4 w-4 mr-1' />
                    Cancel
                  </Button>
                  <Button type='submit' size='sm' disabled={isUpdating}>
                    {isUpdating ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className='h-4 w-4 mr-1' />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            <dl className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-1'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Phone
                </dt>
                <dd className='text-gray-900 dark:text-white'>
                  {isEditing ? (
                    <input
                      type='tel'
                      {...register('phone')}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                      disabled={isUpdating}
                    />
                  ) : (
                    profile?.user?.phone || 'Not provided'
                  )}
                </dd>
              </div>
              <div className='space-y-1'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Email Verified
                </dt>
                <dd className='text-gray-900 dark:text-white'>
                  {profile?.user?.isEmailVerified ? (
                    <span className='inline-flex items-center text-green-600 dark:text-green-400'>
                      <CheckCircle className='h-4 w-4 mr-1.5' />
                      Verified
                    </span>
                  ) : (
                    <span className='inline-flex items-center text-yellow-600 dark:text-yellow-400'>
                      <AlertCircle className='h-4 w-4 mr-1.5' />
                      Not verified
                    </span>
                  )}
                </dd>
              </div>
              <div className='space-y-1'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Account Status
                </dt>
                <dd className='text-gray-900 dark:text-white'>
                  {profile?.user?.isActive ? (
                    <span className='inline-flex items-center text-green-600 dark:text-green-400'>
                      <CheckCircle className='h-4 w-4 mr-1.5' />
                      Active
                    </span>
                  ) : (
                    <span className='inline-flex items-center text-red-600 dark:text-red-400'>
                      <AlertCircle className='h-4 w-4 mr-1.5' />
                      Inactive
                    </span>
                  )}
                </dd>
              </div>
              <div className='space-y-1'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Role
                </dt>
                <dd className='text-gray-900 dark:text-white capitalize'>
                  {profile?.user?.role}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
