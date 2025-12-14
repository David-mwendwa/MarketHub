import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'ecommerce_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock login function - in a real app, this would be an API call
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - in a real app, this would come from your API
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        token: 'mock-jwt-token',
        role: email.includes('admin')
          ? 'admin'
          : email.includes('seller')
            ? 'seller'
            : 'buyer',
        emailVerified: true,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);

      toast.success('Successfully logged in!', { position: 'top-center' });
      return mockUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast at top center
      toast.success(
        'Registration successful! Please check your email to verify your account.',
        {
          position: 'top-center',
          duration: 5000, // Show for 5 seconds
        }
      );

      // Mock user data
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        token: 'mock-jwt-token',
        role: 'user',
      };

      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast at top center
      toast.success('Password reset link sent to your email', {
        position: 'top-center',
        duration: 5000,
      });

      // Show success toast at top center
      toast.success(
        'Registration successful! Please check your email to verify your account.',
        {
          position: 'top-center',
          duration: 5000, // Show for 5 seconds
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to send password reset link. Please try again.');
    }
  }, []);

  const logout = useCallback(() => {
    console.log('[Auth] Logging out user');
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    toast.success('Successfully logged out', { position: 'top-center' });
    console.log('[Auth] User logged out');
    navigate('/');
  }, [navigate]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user, // Ensure isAuthenticated is always a boolean
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
