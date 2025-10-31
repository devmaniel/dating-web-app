import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '@/shared/stores/authStore';
import { isTokenValid } from '@/shared/utils/tokenManager';
import { checkProfileCompletion } from '@/api/auth';

/**
 * Route guard component for protected routes
 * Checks:
 * 1. User is authenticated and token is valid
 * 2. If profile is incomplete, redirects to /onboarding
 * 3. If not authenticated, redirects to /sign_in
 * 
 * IMPORTANT: This guard ALWAYS renders children immediately
 * Auth/profile checks happen in background, redirects are silent
 * This prevents flickering and allows MainLayout to render instantly
 */
export function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, logout } = useAuthStore();
  const hasLoggedOutRef = useRef(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Skip check while loading auth
    if (isLoading) return;

    // Check if user is authenticated and token is valid
    if (!isAuthenticated || !isTokenValid()) {
      // Only logout once to prevent infinite loops
      if (!hasLoggedOutRef.current) {
        console.log('Token expired or user not authenticated, logging out...');
        hasLoggedOutRef.current = true;
        logout();
        navigate({ to: '/sign_in' });
      }
      return;
    }

    // Reset ref when user is authenticated
    hasLoggedOutRef.current = false;

    // Check if profile is complete (only if not already on onboarding page)
    if (location.pathname !== '/onboarding') {
      const checkProfile = async () => {
        try {
          const response = await checkProfileCompletion();

          if (response.success && !response.data?.isProfileComplete) {
            // Profile is incomplete, redirect to onboarding
            if (!hasRedirectedRef.current) {
              console.log('Profile incomplete, redirecting to /onboarding');
              hasRedirectedRef.current = true;
              navigate({ to: '/onboarding' });
            }
          } else {
            // Profile is complete or check passed, allow access
            hasRedirectedRef.current = false;
          }
        } catch (error) {
          console.error('Error checking profile completion:', error);
          // On error, allow access (don't block user)
          hasRedirectedRef.current = false;
        }
      };

      checkProfile();
    } else {
      // On onboarding page, no need to check profile
      hasRedirectedRef.current = false;
    }
  }, [isAuthenticated, isLoading, logout, navigate, location.pathname]);

  // ALWAYS render children immediately
  // No loading states, no blocking - just silent background checks and redirects
  return <>{children}</>;
}
