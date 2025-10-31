import { create } from 'zustand';
import {
  storeToken,
  getToken,
  storeUser,
  getUser,
  clearAuth,
  isTokenValid,
} from '../utils/tokenManager';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  clearAuthState: () => void;
  initializeAuth: () => void;
  logout: () => void;
}

// Initialize auth state from localStorage immediately
const initializeAuthState = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated' | 'isLoading'> => {
  const token = getToken();
  const user = getUser();

  if (token && user && isTokenValid()) {
    return {
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    };
  } else {
    // Clear invalid/expired auth data
    clearAuth();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  // Initialize with auth state from localStorage
  ...initializeAuthState(),

  /**
   * Set authentication state (called after sign-up/sign-in)
   */
  setAuth: (user: User, token: string) => {
    storeToken(token);
    storeUser(user);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * Clear authentication state
   */
  clearAuthState: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  /**
   * Initialize auth state from localStorage
   * Called on app startup
   */
  initializeAuth: () => {
    const token = getToken();
    const user = getUser();

    if (token && user && isTokenValid()) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      // Clear invalid/expired auth data
      clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
