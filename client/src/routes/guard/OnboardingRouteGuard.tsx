import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/shared/stores/authStore';
import { isTokenValid } from '@/shared/utils/tokenManager';
import { checkProfileCompletion } from '@/api/auth';

/**
 * Route guard component for onboarding route
 * Checks:
 * 1. User is authenticated
 * 2. Token is valid
 * 3. Profile is not complete (redirects to /match if complete)
 */
export function OnboardingRouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout } = useAuthStore();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const hasLoggedOutRef = useRef(false);

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

    // Check if profile is complete
    const checkProfile = async () => {
      try {
        console.log('🔍 OnboardingRouteGuard: Checking profile completion...');
        setIsCheckingProfile(true);
        const response = await checkProfileCompletion();
        console.log('🔍 OnboardingRouteGuard: Profile check response:', response);

        if (response.success && response.data?.isProfileComplete) {
          // Profile is complete, redirect to /match
          console.log('✅ OnboardingRouteGuard: Profile is complete, redirecting to /match');
          navigate({ to: '/match' });
        } else {
          console.log('⏳ OnboardingRouteGuard: Profile not complete, staying on onboarding');
        }
      } catch (error) {
        console.error('❌ OnboardingRouteGuard: Error checking profile completion:', error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, isLoading, logout, navigate]);

  // Show nothing while checking auth or profile (silent redirect if profile complete)
  if (isLoading || isCheckingProfile) {
    return null;
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !isTokenValid()) {
    return null;
  }

  // Render onboarding content
  return <>{children}</>;
}
