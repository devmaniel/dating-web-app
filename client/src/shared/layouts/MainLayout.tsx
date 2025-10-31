import { type ReactNode, memo } from 'react';
import { Header } from '@/shared/components/Header';
import { Navigation } from '@/shared/components/Navigation';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  actionButtons?: ReactNode;
}

// Header and navigation section
const LayoutHeader = memo(({ actionButtons }: { actionButtons?: ReactNode }) => (
  <>
    {/* Header */}
    <Header />

    {/* Navigation and Actions Bar */}
    <div className="w-full bg-background border-b border-border">
      <div className="max-w-[700px] mx-auto py-4 flex items-center">
        <div className="flex-shrink-0">
          <Navigation />
        </div>
        <div className="flex-1" />
        {actionButtons && (
          <div className="flex-shrink-0">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  </>
));

export const MainLayout = ({ 
  children, 
  showNavigation = true,
  actionButtons,
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/nav - updates when WebSocket events trigger store changes */}
      {showNavigation && <LayoutHeader actionButtons={actionButtons} />}

      {/* Main Content - only this re-renders */}
      <main className="max-w-[700px] mx-auto">
        {children}
      </main>
    </div>
  );
};
