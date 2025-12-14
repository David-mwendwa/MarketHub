// src/components/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/toast';

const ResetPassword = ({ onSuccess, className, ...props }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { resetPasswordConfirm } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or expired reset link');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await resetPasswordConfirm(token, password);
      setIsSubmitted(true);
      toast.success('Password reset successful!');
      onSuccess?.();
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn('text-center', className)} {...props}>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
          Password reset successful!
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your password has been successfully reset. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-md mx-auto', className)} {...props}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input
            label="New password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={Lock}
            placeholder="••••••••"
          />
        </div>

        <div>
          <Input
            label="Confirm new password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            startIcon={Lock}
            placeholder="••••••••"
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            startIcon={isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;