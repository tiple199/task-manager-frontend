import { apiClient } from '@/lib/api';
import { ApiResponse, AuthToken, User } from '@/types';

export const authApi = {
  sendOtp: async (email: string) => {
    const res = await apiClient.post<ApiResponse<null>>('/send-otp', { email });
    return res.data;
  },

  register: async (data: any) => {
    const res = await apiClient.post<ApiResponse<null>>('/register', data);
    return res.data;
  },

  login: async (data: any) => {
    const res = await apiClient.post<ApiResponse<{ accessToken: AuthToken }>>('/login', data);
    // login response data has specific shape: { data: { accessToken: { accessToken, refreshToken } } }
    return res.data;
  },

  googleLogin: async (idToken: string) => {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/google-login', { idToken });
    // Note: This response shape is different, it directly returns token string, not a nested object
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post<ApiResponse<{ email: string; expires: string }>>('/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token: string, data: any) => {
    const res = await apiClient.post<ApiResponse<null>>(`/reset-password/${token}`, data);
    return res.data;
  },

  logout: async (refreshToken: string) => {
    const res = await apiClient.post<ApiResponse<null>>('/logout', { refreshToken });
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/profile');
    return res.data;
  },
};
