import type { ReactNode } from 'react';
import { MainLayout } from './MainLayout';
import { ProtectedRouteGuard } from '@/routes/guard/ProtectedRouteGuard';

interface ProtectedLayoutProps {
  children: ReactNode;
  actionButtons?: ReactNode;
}

/**
 * Layout wrapper for protected routes
 * Combines ProtectedRouteGuard + MainLayout
 * Use this for all authenticated routes (match, liked_you, chats, profile, etc.)
 */
export function ProtectedLayout({ children, actionButtons }: ProtectedLayoutProps) {
  return (
    <ProtectedRouteGuard>
      <MainLayout actionButtons={actionButtons}>
        {children}
      </MainLayout>
    </ProtectedRouteGuard>
  );
}
