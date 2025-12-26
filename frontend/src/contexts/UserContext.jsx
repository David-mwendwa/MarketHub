import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { userService } from '../services/user';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to prevent initial flash
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return null;
    }

    try {
      setIsLoading(true);
      const userData = await userService.getMe();
      setProfile(userData);
      setError(null);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err.message || 'Failed to load profile');
      setIsAuthenticated(false);
      // Only clear token if it's an auth error
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const updatedProfile = await userService.updateProfile(userData);
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (passwordData) => {
    try {
      setIsLoading(true);
      await userService.updatePassword(passwordData);
      return true;
    } catch (err) {
      console.error('Failed to update password:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const data = await userService.refreshToken();
      return data;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      throw err;
    }
  }, []);

  // Update the useEffect to only fetch if we have a token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, [fetchProfile]);

  const value = {
    profile,
    isLoading,
    error,
    isAuthenticated,
    refreshProfile: fetchProfile,
    updateProfile,
    updatePassword,
    refreshToken,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
