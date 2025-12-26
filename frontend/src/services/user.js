import api from '../lib/api';

export const userService = {
  getMe: async () => {
    try {
      return await api.get('/me').then((res) => res.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      return await api.patch('/me/update', userData).then((res) => res.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  updatePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    try {
      const response = await api.patch(
        '/password/update',
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating password:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.config?.data,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      return await api
        .post('/password/forgot', { email })
        .then((res) => res.data);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      return await api
        .post(`/password/reset/${token}`, { newPassword })
        .then((res) => res.data);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      return await api.post('/refresh-token').then((res) => res.data);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },
};
