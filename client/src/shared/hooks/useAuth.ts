import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getToken, getTimeUntilExpiry } from '../utils/tokenManager';
import { initializeSocket, disconnectSocket } from '../services/socket';

interface User {
  id: string;
  email: string;
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  clearAuthState: () => void;
}

/**
 * useAuth Hook
 * Manages authentication state and token refresh
 * Automatically refreshes token 2 seconds before expiration (58s)
 */
export function useAuth(): UseAuthReturn {
  const authStore = useAuthStore();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Start token refresh timer
   * Refreshes token 2 seconds before expiry (at 58 seconds)
   */
  const startRefreshTimer = () => {
    const token = getToken();
    if (!token) return;

    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const timeUntilExpiry = getTimeUntilExpiry(token);
    // Refresh 2 seconds before expiry (58 seconds for 60s token)
    const refreshTime = Math.max(0, (timeUntilExpiry - 2) * 1000);

    console.log(`Token refresh scheduled in ${refreshTime / 1000}s`);

    refreshTimerRef.current = setTimeout(() => {
      console.log('Token refresh timer triggered');
      // Token refresh would be called here
      // For now, we just log it
      // In a real app, you'd call a refresh endpoint
    }, refreshTime);
  };

  /**
   * Stop token refresh timer
   */
  const stopRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  /**
   * Auth is initialized synchronously in authStore when it's created
   * No need to call initializeAuth() here
   */

  /**
   * Start/restart refresh timer when token changes
   */
  useEffect(() => {
    if (authStore.isAuthenticated && authStore.token) {
      startRefreshTimer();
    } else {
      stopRefreshTimer();
    }

    return () => {
      stopRefreshTimer();
    };
  }, [authStore.isAuthenticated, authStore.token]);

  /**
   * Initialize Socket.IO when user is authenticated
   */
  useEffect(() => {
    if (authStore.isAuthenticated && authStore.token) {
      console.log('🔌 Initializing Socket.IO connection...');
      initializeSocket(authStore.token);
    } else {
      console.log('🔌 Disconnecting Socket.IO...');
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [authStore.isAuthenticated, authStore.token]);

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    setAuth: authStore.setAuth,
    logout: authStore.logout,
    clearAuthState: authStore.clearAuthState,
  };
}
