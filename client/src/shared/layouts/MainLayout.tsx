import type { ReactNode } from 'react';
import { Header } from '@/shared/components/Header';
import { Navigation } from '@/shared/components/Navigation';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  actionButtons?: ReactNode;
}

export const MainLayout = ({ 
  children, 
  showNavigation = true,
  actionButtons
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Navigation and Actions Bar */}
      {showNavigation && (
        <div className="w-full bg-background border-b border-border">
          <div className="max-w-[700px] mx-auto py-4 flex items-center">
            <div className="flex-shrink-0">
              <Navigation />
            </div>
            <div className="flex-1" />
            <div className="flex-shrink-0 min-w-0">
              {actionButtons}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[700px] mx-auto">
        {children}
      </main>
    </div>
  );
};
