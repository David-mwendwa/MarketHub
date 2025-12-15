import { authAPI } from '../lib/api';

export const authService = {
  login: async (email, password) => {
    try {
      return await authAPI.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      return await authAPI.register(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      return await authAPI.getMe();
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
