import axios from 'axios';
import { getToken } from '../shared/utils/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to Authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token expiration
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || '';
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.log('🔴 401 Error intercepted for URL:', requestUrl);
      
      // For sign-in/sign-up requests, let the error propagate normally
      // The API layer will handle the error response
      if (requestUrl.includes('/auth/sign-in') || requestUrl.includes('/auth/sign-up')) {
        console.log('✅ Auth endpoint error - letting it propagate to API layer');
        return Promise.reject(error);
      }
      
      // For other 401 errors (token expiration on protected routes)
      // Clear auth and redirect to login
      console.log('🔄 Token expired - clearing auth and redirecting to /sign_in');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/sign_in';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;