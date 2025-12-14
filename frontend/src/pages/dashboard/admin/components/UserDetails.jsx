import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { formatDate } from '@/lib/utils';
import { ConfirmationDialog } from '@components/common/ConfirmationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';
import { EditUserModal } from '@components/admin/EditUserModal';
import {
  ArrowLeft,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // State for user data and UI
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      avatar: '',
      phone: '+1234567890',
      address: '123 Main St, Anytown, USA',
      joinDate: '2023-01-15T10:30:00Z',
      lastLogin: '2023-06-18T14:25:00Z',
      notes: 'Admin user with full access',
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'seller',
      status: 'active',
      avatar: '',
      phone: '+1987654321',
      address: '456 Oak Ave, Somewhere, USA',
      joinDate: '2023-02-20T09:15:00Z',
      lastLogin: '2023-06-17T16:45:00Z',
      notes: 'Top seller with 50+ products',
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'buyer',
      status: 'inactive',
      avatar: '',
      phone: '+1555123456',
      address: '789 Pine St, Nowhere, USA',
      joinDate: '2023-03-10T11:20:00Z',
      lastLogin: '2023-05-28T13:10:00Z',
      notes: 'Inactive for 30+ days',
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'buyer',
      status: 'suspended',
      avatar: '',
      phone: '+1555987654',
      address: '321 Elm St, Anywhere, USA',
      joinDate: '2023-04-05T14:45:00Z',
      lastLogin: '2023-06-10T10:15:00Z',
      notes: 'Account suspended for policy violation',
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      role: 'buyer',
      status: 'locked',
      avatar: '',
      phone: '+1555678901',
      address: '159 Maple Dr, Everywhere, USA',
      joinDate: '2023-05-20T16:30:00Z',
      lastLogin: '2023-06-19T09:45:00Z',
      notes: 'Account locked after multiple failed login attempts',
      failedLoginAttempts: 5,
      lockedUntil: '2023-06-20T09:45:00Z',
    },
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the user data from an API
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();

        // Use mock data for now
        const foundUser = mockUsers.find((u) => u.id === parseInt(userId));

        if (!foundUser) {
          throw new Error('User not found');
        }

        // Add a small delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        setUser(foundUser);
        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to load user data');
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId]);

  // Action handlers
  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      // In a real app, you would call your API here
      // await deleteUser(user.id);
      toast.success('User deleted successfully');
      navigate('/dashboard/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSuspendToggle = async () => {
    if (!user) return;

    try {
      setIsSuspending(true);
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';

      // In a real app, you would call your API here
      // await updateUserStatus(user.id, newStatus);

      setUser((prev) => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }));

      toast.success(
        `User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(
        `Failed to ${user.status === 'suspended' ? 'activate' : 'suspend'} user`
      );
    } finally {
      setIsSuspending(false);
      setIsSuspendDialogOpen(false);
    }
  };

  const handleUnlockAccount = async () => {
    if (!user) return;

    try {
      setIsUnlocking(true);
      // In a real app, you would call your API here
      // await unlockUserAccount(user.id);

      setUser((prev) => ({
        ...prev,
        status: 'active',
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date().toISOString(),
      }));

      toast.success('User account unlocked successfully');
    } catch (error) {
      console.error('Error unlocking account:', error);
      toast.error('Failed to unlock account');
    } finally {
      setIsUnlocking(false);
      setIsUnlockDialogOpen(false);
    }
  };

  const handleSaveUser = async (updatedUser) => {
    if (!user) return;

    try {
      setIsSaving(true);
      // In a real app, you would call your API here
      // await updateUser(updatedUser);

      setUser((prev) => ({
        ...prev,
        ...updatedUser,
        updatedAt: new Date().toISOString(),
      }));

      toast.success('User updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      // In a real app, you would call your API here
      // await resetUserPassword(user.id);
      toast.success('Password reset email sent to user');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        class:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: CheckCircle,
        label: 'Active',
      },
      inactive: {
        class:
          'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
        icon: XCircle,
        label: 'Inactive',
      },
      suspended: {
        class:
          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        icon: AlertTriangle,
        label: 'Suspended',
      },
      locked: {
        class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: Lock,
        label: 'Locked',
      },
      pending: {
        class:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: AlertTriangle,
        label: 'Pending',
      },
    };

    const config = statusConfig[status] || {
      class: 'bg-gray-100 text-gray-800',
      icon: User,
      label: 'Unknown',
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className='h-3.5 w-3.5 mr-1.5' />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='text-center py-12'>
        <div className='text-red-500 mb-4'>{error || 'User not found'}</div>
        <Button onClick={() => navigate('/dashboard/admin/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with back button and actions */}
      <div className='flex items-center'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate('/dashboard/admin/users')}
          className='flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Back to Users
        </Button>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader className='border-b'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <div className='h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='h-full w-full rounded-full object-cover'
                    />
                  ) : (
                    <span className='text-2xl font-medium text-gray-500 dark:text-gray-400'>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-2xl font-bold'>{user.name}</h1>
                </div>
                <p className='text-gray-500 dark:text-gray-400'>{user.email}</p>
                <div className='mt-1 flex items-center'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : user.role === 'seller'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsEditModalOpen(true)}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className='p-6'>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='mb-6'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='activity'>Activity</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Contact Information
                  </h3>
                  <div className='space-y-1'>
                    <div className='flex items-center text-sm'>
                      <Mail className='mr-2 h-4 w-4 text-gray-400' />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className='flex items-center text-sm'>
                        <Phone className='mr-2 h-4 w-4 text-gray-400' />
                        {user.phone}
                      </div>
                    )}
                    {user.address && (
                      <div className='flex items-start text-sm'>
                        <MapPin className='mr-2 h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0' />
                        <span>{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Account Information
                  </h3>
                  <div className='space-y-1'>
                    <div className='flex items-center text-sm'>
                      <User className='mr-2 h-4 w-4 text-gray-400' />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                    <div className='flex items-center text-sm'>
                      <Calendar className='mr-2 h-4 w-4 text-gray-400' />
                      Member since{' '}
                      {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                    <div className='flex items-center text-sm'>
                      <Calendar className='mr-2 h-4 w-4 text-gray-400' />
                      Last login:{' '}
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : 'Never'}
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Account Status
                  </h3>
                  <div className='space-y-1'>
                    <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                      <StatusBadge status={user.status} />
                    </div>
                    {user.status === 'locked' && user.lockedUntil && (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Locked until:{' '}
                        {new Date(user.lockedUntil).toLocaleString()}
                      </p>
                    )}
                    {user.failedLoginAttempts > 0 && (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Failed login attempts: {user.failedLoginAttempts}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {user.notes && (
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Admin Notes
                  </h3>
                  <p className='text-sm'>{user.notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value='activity' className='space-y-4'>
              <div className='rounded-lg border p-4'>
                <h3 className='font-medium'>Recent Activity</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                  User activity log will appear here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value='settings' className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='font-medium'>Danger Zone</h3>
                <div className='rounded-lg border border-red-200 dark:border-red-900/50 p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium text-red-700 dark:text-red-400'>
                        {user.status === 'suspended'
                          ? 'Activate User'
                          : 'Suspend User'}
                      </h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {user.status === 'suspended'
                          ? 'Reactivate this user account.'
                          : 'Temporarily suspend this user account.'}
                      </p>
                    </div>
                    <Button
                      variant={
                        user.status === 'suspended' ? 'default' : 'outline'
                      }
                      onClick={() => setIsSuspendDialogOpen(true)}>
                      {user.status === 'suspended'
                        ? 'Activate User'
                        : 'Suspend User'}
                    </Button>
                  </div>
                </div>

                {user.status === 'locked' && (
                  <div className='rounded-lg border border-amber-200 dark:border-amber-900/50 p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium text-amber-700 dark:text-amber-400'>
                          Unlock Account
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Unlock this user's account to allow them to log in
                          again.
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        onClick={() => setIsUnlockDialogOpen(true)}>
                        Unlock Account
                      </Button>
                    </div>
                  </div>
                )}

                <div className='rounded-lg border border-red-200 dark:border-red-900/50 p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium text-red-700 dark:text-red-400'>
                        Delete User
                      </h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Permanently delete this user account and all associated
                        data.
                      </p>
                    </div>
                    <Button
                      variant='destructive'
                      onClick={() => setIsDeleteDialogOpen(true)}>
                      Delete User
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete User'
        description='Are you sure you want to delete {item}? This action cannot be undone.'
        itemName={user.name}
        confirmText={isDeleting ? 'Deleting...' : 'Delete User'}
        onConfirm={handleDelete}
        variant='danger'
        isLoading={isDeleting}
      />

      <ConfirmationDialog
        open={isSuspendDialogOpen}
        onOpenChange={setIsSuspendDialogOpen}
        title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
        description={
          user.status === 'suspended'
            ? 'Are you sure you want to activate {item}? The user will regain access to their account.'
            : 'Are you sure you want to suspend {item}? The user will not be able to access their account until reactivated.'
        }
        itemName={user.name}
        confirmText={
          isSuspending
            ? user.status === 'suspended'
              ? 'Activating...'
              : 'Suspending...'
            : user.status === 'suspended'
              ? 'Activate User'
              : 'Suspend User'
        }
        onConfirm={handleSuspendToggle}
        variant={user.status === 'suspended' ? 'success' : 'warning'}
        isLoading={isSuspending}
      />

      <ConfirmationDialog
        open={isUnlockDialogOpen}
        onOpenChange={setIsUnlockDialogOpen}
        title='Unlock User Account'
        description="Are you sure you want to unlock {item}'s account? This will reset any failed login attempts and allow the user to log in again."
        itemName={user.name}
        confirmText={isUnlocking ? 'Unlocking...' : 'Unlock Account'}
        onConfirm={handleUnlockAccount}
        variant='warning'
        isLoading={isUnlocking}
      />

      {/* Edit User Modal */}
      <EditUserModal
        user={user}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveUser}
        isSaving={isSaving}
        error={error}
      />
    </div>
  );
};

export default UserDetails;
