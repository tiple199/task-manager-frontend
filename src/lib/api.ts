import axios from 'axios';
import { getToken, setToken, clearToken } from './auth';
import 'dotenv/config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple concurrent refresh token requests
let isRefreshing = false;
// Queue of requests waiting for the token renewal
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token?.accessToken) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data part based on the contract
    // The contract expects some specific shapes, we can just return response.data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const currentToken = getToken();

      if (!currentToken?.refreshToken) {
        // No refresh token available, clear session and go to login
        clearToken();
        isRefreshing = false;
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/refresh-token`, {
          refreshToken: currentToken.refreshToken,
        });
        
        // Success shape: { success: true, data: { accessToken: string } }
        // We will keep the old refreshToken and update the accessToken
        const newAccessToken = res.data?.data?.accessToken;
        
        if (newAccessToken) {
          const newToken = {
            accessToken: newAccessToken,
            refreshToken: currentToken.refreshToken,
          };
          setToken(newToken);
          
          isRefreshing = false;
          onRefreshed(newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (err) {
        clearToken();
        isRefreshing = false;
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    // Normalize error if needed, but returning data directly helps
    return Promise.reject(error);
  }
);
