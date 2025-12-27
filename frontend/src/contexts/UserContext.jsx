import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { userService } from '../services/user';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    isAuthenticated,
    user: authUser,
    isLoading: isAuthLoading,
  } = useAuth();
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
      return null;
    }
    try {
      setIsLoading(true);
      const userData = await userService.getMe();
      setProfile(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        fetchProfile();
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, isAuthLoading, fetchProfile]);

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

  const value = {
    profile,
    isLoading: isLoading || isAuthLoading,
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
