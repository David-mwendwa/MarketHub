import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Backdrop } from '../ui/Backdrop';
import { Check, Eye, EyeOff, Loader2, RefreshCw, X } from 'lucide-react';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import {
  AlertCircle,
  UserCheck,
  UserX,
  Lock,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { USER_STATUS, getStatusConfig } from '../../constants/status.jsx';

const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'seller', label: 'Seller' },
  { value: 'buyer', label: 'Buyer' },
];

// Get status options from USER_STATUS
const STATUSES = Object.values(USER_STATUS).map((status) => {
  const config = getStatusConfig('user', status);
  return {
    value: status,
    label: config.label,
    icon: config.icon,
    color: config.color,
  };
});

// Using status constants from status.js

export const EditUserModal = ({
  user,
  open,
  onOpenChange,
  onSave,
  isSaving = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    role: 'buyer',
    status: 'active',
    notes: '',
  });

  // Dialog states
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
    useState(false);
  const [pendingChange, setPendingChange] = useState({
    type: null,
    value: null,
  });

  // Form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Password requirements
  const passwordRequirements = [
    {
      id: 'length',
      label: 'At least 8 characters',
      validate: (pwd) => pwd.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter',
      validate: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter',
      validate: (pwd) => /[a-z]/.test(pwd),
    },
    {
      id: 'number',
      label: 'At least one number',
      validate: (pwd) => /[0-9]/.test(pwd),
    },
    {
      id: 'special',
      label: 'At least one special character',
      validate: (pwd) => /[^A-Za-z0-9]/.test(pwd),
    },
  ];

  // Calculate password strength (0-4)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Generate a random password
  const generatePassword = () => {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
    setConfirmPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
    setPasswordError('');
  };

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || 'buyer',
        status: user.status || 'active',
        notes: user.notes || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setPendingChange({ type: 'role', value });
    setIsRoleChangeDialogOpen(true);
  };

  const handleStatusChange = (value) => {
    setPendingChange({ type: 'status', value });
    setIsStatusChangeDialogOpen(true);
  };

  const confirmChange = () => {
    const { type, value } = pendingChange;
    if (type === 'role') {
      setFormData((prev) => ({ ...prev, role: value }));
      setIsRoleChangeDialogOpen(false);
    } else if (type === 'status') {
      setFormData((prev) => ({ ...prev, status: value }));
      setIsStatusChangeDialogOpen(false);
    }
    setPendingChange({ type: null, value: null });
  };

  const cancelChange = () => {
    setPendingChange({ type: null, value: null });
    setIsRoleChangeDialogOpen(false);
    setIsStatusChangeDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: user.id,
    });
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Check all password requirements
    const failedRequirements = passwordRequirements
      .filter((req) => !req.validate(newPassword))
      .map((req) => req.label);

    if (failedRequirements.length > 0) {
      setPasswordError('Please ensure all password requirements are met');
      return;
    }

    try {
      setIsResettingPassword(true);
      // Call your API to reset the password
      // await resetUserPassword(user.id, newPassword);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast.success('Password has been reset successfully', {
        description:
          'The user will be required to change their password on next login.',
      });

      setIsResetPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPasswordStrength(0);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (!open) return null;

  return (
    <Backdrop className='p-4'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform border border-gray-200 dark:border-gray-700 animate-scaleIn'>
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {user?.name ? `Edit ${user.name}` : 'Edit User'}
              </h2>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium'>
                Update account settings and permissions
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/20 dark:focus:ring-offset-gray-800'
              aria-label='Close'>
              <X className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(100vh-16rem)] bg-white dark:bg-gray-800'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {error && (
              <div className='p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg'>
                <div className='flex items-center space-x-2 text-red-600 dark:text-red-400'>
                  <AlertCircle className='h-5 w-5 flex-shrink-0' />
                  <span className='text-sm font-medium'>{error}</span>
                </div>
              </div>
            )}

            <div className='space-y-6 text-gray-900 dark:text-gray-100'>
              <div className='bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                <div className='space-y-3'>
                  <div>
                    <div>
                      <Label
                        htmlFor='role'
                        className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
                        User Role
                      </Label>
                    </div>
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      Select the appropriate role for this user
                    </p>
                  </div>
                  <div className='mt-2'>
                    <Select
                      value={formData.role}
                      onValueChange={handleRoleChange}
                      name='role'
                      id='role'>
                      <SelectTrigger className='w-full h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'>
                        <SelectValue
                          placeholder='Select a role'
                          className='text-sm'
                        />
                      </SelectTrigger>
                      <SelectContent className='z-50 mt-1 w-full rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
                        {ROLES.map((role) => (
                          <SelectItem
                            key={role.value}
                            value={role.value}
                            className='px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 cursor-pointer transition-colors'>
                            <span className='flex items-center'>
                              {role.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                <div className='space-y-3'>
                  <div>
                    <div>
                      <Label
                        htmlFor='status'
                        className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
                        Account Status
                      </Label>
                    </div>
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      Set the current status of this user account
                    </p>
                    <div className='mt-2'>
                      <Select
                        value={formData.status}
                        onValueChange={handleStatusChange}
                        name='status'
                        id='status'>
                        <SelectTrigger className='w-full h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'>
                          <SelectValue
                            placeholder='Select status'
                            className='text-sm'
                          />
                        </SelectTrigger>
                        <SelectContent className='z-50 mt-1 w-full rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
                          {STATUSES.map((status) => (
                            <SelectItem
                              key={status.value}
                              value={status.value}
                              className={`px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 cursor-pointer transition-colors`}>
                              <div className='flex items-center'>
                                <span
                                  className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-600 dark:text-${status.color}-400 mr-2`}>
                                  {React.cloneElement(status.icon, {
                                    className: 'h-3 w-3',
                                  })}
                                </span>
                                <span>{status.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className='bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                <div className='space-y-3'>
                  <div>
                    <Label
                      htmlFor='notes'
                      className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
                      Admin Notes
                    </Label>
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      Add private notes about this user (only visible to admins)
                    </p>
                    <div className='mt-2'>
                      <Textarea
                        id='notes'
                        name='notes'
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className='w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                        placeholder='Add any notes about this user...'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='pt-2'>
                <div className='flex items-center justify-end space-x-3'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onOpenChange(false)}
                    disabled={isSaving}
                    className='px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/20 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700'>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSaving}
                    className='px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/50 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 flex items-center'>
                    {isSaving ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        <span>Saving Changes</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Security Section */}
              <div className='pt-6 mt-6 border-t border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Security
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                      Manage user account security settings
                    </p>
                  </div>
                </div>

                <div className='bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                      <h4 className='text-sm font-medium text-gray-900 dark:text-white flex items-center'>
                        <svg
                          className='w-4 h-4 mr-2 text-gray-500 dark:text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                        Password Management
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        Generate a new secure password for this user
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setIsResetPasswordDialogOpen(true)}
                      className='text-sm font-medium text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 dark:bg-gray-800'>
                      <svg
                        className='w-4 h-4 mr-1.5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                        />
                      </svg>
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Role Change Confirmation Dialog */}
        <ConfirmationDialog
          open={isRoleChangeDialogOpen}
          onOpenChange={(open) => !open && cancelChange()}
          title={
            <div className='flex items-center'>
              <AlertCircle className='w-5 h-5 mr-2 text-blue-500' />
              Confirm Role Change
            </div>
          }
          description={
            <div className='space-y-2'>
              <p>Are you sure you want to change this user's role?</p>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500'>From:</span>
                <span className='font-medium'>
                  {ROLES.find((r) => r.value === formData.role)?.label}
                </span>
                <span className='mx-2'>→</span>
                <span className='text-sm text-gray-500'>To:</span>
                <span className='font-medium'>
                  {ROLES.find((r) => r.value === pendingChange.value)?.label}
                </span>
              </div>
            </div>
          }
          variant='warning'
          onConfirm={confirmChange}
          confirmText='Confirm Change'
          cancelText='Cancel'
        />

        {/* Status Change Confirmation Dialog */}
        <ConfirmationDialog
          open={isStatusChangeDialogOpen}
          onOpenChange={(open) => !open && cancelChange()}
          title={
            <div className='flex items-center'>
              <AlertCircle className='w-5 h-5 mr-2 text-amber-500' />
              Confirm Status Change
            </div>
          }
          description={
            <div className='space-y-2'>
              <p>Are you sure you want to change this user's status?</p>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500'>From:</span>
                <span className='font-medium'>
                  {STATUSES.find((s) => s.value === formData.status)?.label}
                </span>
                <span className='mx-2'>→</span>
                <span className='text-sm text-gray-500'>To:</span>
                <span className='font-medium'>
                  {STATUSES.find((s) => s.value === pendingChange.value)?.label}
                </span>
              </div>
              {pendingChange.value === 'suspended' && (
                <p className='text-sm text-amber-600 dark:text-amber-400 mt-2'>
                  This will prevent the user from accessing their account.
                </p>
              )}
            </div>
          }
          variant='warning'
          onConfirm={confirmChange}
          confirmText='Confirm Change'
          cancelText='Cancel'
        />

        {/* Reset Password Dialog */}
        {isResetPasswordDialogOpen && (
          <Backdrop>
            <div className='relative z-10 w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <Lock className='w-5 h-5' />
                    <span>Reset Password</span>
                  </h3>
                  <button
                    onClick={() => {
                      setIsResetPasswordDialogOpen(false);
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                      setPasswordStrength(0);
                    }}
                    className='text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'>
                    <X className='h-5 w-5' />
                  </button>
                </div>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label
                        htmlFor='newPassword'
                        className='text-sm font-medium'>
                        New Password
                      </Label>
                      <button
                        type='button'
                        onClick={generatePassword}
                        className='text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center transition-colors'>
                        <RefreshCw className='w-3.5 h-3.5 mr-1' />
                        Generate Password
                      </button>
                    </div>
                    <div className='relative'>
                      <Input
                        id='newPassword'
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordStrength(
                            calculatePasswordStrength(e.target.value)
                          );
                          setPasswordError('');
                        }}
                        onFocus={() => setShowPasswordRequirements(true)}
                        onBlur={() => {
                          if (!newPassword) setShowPasswordRequirements(false);
                        }}
                        placeholder='Enter a strong password'
                        className='w-full pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }>
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className='space-y-1.5'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>
                          Password Strength
                        </span>
                        <span className='font-medium'>
                          {passwordStrength < 2
                            ? 'Weak'
                            : passwordStrength < 4
                              ? 'Good'
                              : 'Strong'}
                        </span>
                      </div>
                      <div className='flex space-x-1 h-1.5'>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-full rounded-full flex-1 ${
                              i <= passwordStrength
                                ? passwordStrength < 2
                                  ? 'bg-red-500'
                                  : passwordStrength < 4
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Password Requirements */}
                  {showPasswordRequirements && (
                    <div className='space-y-2 pt-2'>
                      <p className='text-xs font-medium text-muted-foreground'>
                        Password must contain:
                      </p>
                      <ul className='space-y-1 text-xs text-muted-foreground'>
                        {passwordRequirements.map((req) => (
                          <li
                            key={req.id}
                            className={`flex items-center ${req.validate(newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                            <Check
                              className={`h-3 w-3 mr-1.5 ${req.validate(newPassword) ? 'text-green-500' : 'opacity-0'}`}
                            />
                            {req.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Confirm Password */}
                  <div className='space-y-1.5'>
                    <Label
                      htmlFor='confirmPassword'
                      className='text-sm font-medium'>
                      Confirm Password
                    </Label>
                    <Input
                      id='confirmPassword'
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value && e.target.value !== newPassword) {
                          setPasswordError('Passwords do not match');
                        } else {
                          setPasswordError('');
                        }
                      }}
                      placeholder='Confirm your password'
                      className='w-full'
                    />
                  </div>

                  {passwordError && (
                    <div className='p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                      <p className='text-sm text-red-600 dark:text-red-400 flex items-center'>
                        <X className='h-4 w-4 mr-1.5 flex-shrink-0' />
                        {passwordError}
                      </p>
                    </div>
                  )}

                  <div className='flex justify-end space-x-3 pt-4'>
                    <Button
                      type='button'
                      variant='outline'
                      className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
                      onClick={() => {
                        setIsResetPasswordDialogOpen(false);
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordError('');
                        setPasswordStrength(0);
                      }}>
                      Cancel
                    </Button>
                    <Button
                      type='button'
                      onClick={handleResetPassword}
                      disabled={
                        !newPassword ||
                        !confirmPassword ||
                        passwordError ||
                        isResettingPassword
                      }>
                      {isResettingPassword ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            //{' '}
          </Backdrop>
        )}
      </div>
    </Backdrop>
  );
};
