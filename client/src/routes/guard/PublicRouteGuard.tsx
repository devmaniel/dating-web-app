import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/shared/stores/authStore';
import { isTokenValid } from '@/shared/utils/tokenManager';

/**
 * Public route guard for sign-in and sign-up pages
 * Redirects to /match if user is already authenticated
 * Allows access if user is not authenticated
 */
export function PublicRouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Skip check while loading
    if (isLoading) return;

    // Redirect to match if already authenticated (only once)
    if (isAuthenticated && isTokenValid()) {
      if (!hasRedirectedRef.current) {
        console.log('User already authenticated, redirecting to /match');
        hasRedirectedRef.current = true;
        navigate({ to: '/match' });
      }
    } else {
      // Reset ref when user logs out
      hasRedirectedRef.current = false;
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated && isTokenValid()) {
    return null;
  }

  // Render public content
  return <>{children}</>;
}
