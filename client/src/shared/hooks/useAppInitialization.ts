import { useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useUserProfileCached } from '@/shared/hooks/useUserProfileCached';
import { useLikedYouCount } from '@/shared/hooks/useLikedYouCount';

/**
 * App-level initialization hook
 * Runs once on app startup to pre-fetch and cache critical data
 * Prevents flickering in Header, Logo, and Navigation components
 * 
 * This hook should be called in App.tsx to initialize stores before rendering
 * 
 * IMPORTANT: Auth must be initialized first (via useAuth in __root.tsx)
 * before these hooks can fetch data. Both hooks check isAuthenticated
 * before making API calls to prevent "missing_token" errors.
 */
export function useAppInitialization() {
  const { isAuthenticated } = useAuthStore();
  
  // These hooks will automatically fetch and cache data ONLY when authenticated
  // They use Zustand stores to prevent re-fetching on component re-renders
  // Both hooks check isAuthenticated before making API calls
  useUserProfileCached();
  useLikedYouCount();

  // Log when initialization is complete
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ App initialization complete - user profile and liked you count cached');
    }
  }, [isAuthenticated]);
}
