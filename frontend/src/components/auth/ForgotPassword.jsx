// src/components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/toast';

const ForgotPassword = ({ onSuccess, className, ...props }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn('text-center', className)} {...props}>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
          <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
        </p>
        <div className="mt-6">
          <Button
            as={Link}
            to="/login"
            variant="outline"
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-md mx-auto', className)} {...props}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startIcon={Mail}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send reset link'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;