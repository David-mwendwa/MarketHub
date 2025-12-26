import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { userService } from '../services/user';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getMe();
      setProfile(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err.message || 'Failed to load profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const updatedProfile = await userService.updateProfile(userData);
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      await userService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
      return true;
    } catch (err) {
      console.error('Failed to update password:', err);
      toast.error(err.message || 'Failed to update password');
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

  useEffect(() => {
    fetchProfile().catch(console.error);
  }, [fetchProfile]);

  const value = {
    profile,
    isLoading,
    error,
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
