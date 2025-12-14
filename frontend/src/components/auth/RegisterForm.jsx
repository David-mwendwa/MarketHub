// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/toast';

const RegisterForm = ({ onSuccess, className, ...props }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      onSuccess?.();
      navigate('/account');
    } catch (error) {
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)} {...props}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input
            label="Full name"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            startIcon={User}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            startIcon={Mail}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            startIcon={Lock}
            placeholder="••••••••"
          />
        </div>

        <div>
          <Input
            label="Confirm password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            startIcon={Lock}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            required
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            I agree to the{' '}
            <Link
              to="/terms"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            startIcon={isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;