import { useState, useEffect, memo } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Settings, Palette } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { useLogout } from '@/features/auth/hooks';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { AccountSettingsDialog } from '@/shared/components/account-settings';

interface UserProfileDropdownProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
  isLoading?: boolean;
}

const UserProfileDropdownComponent = ({ 
  userName,
  userEmail,
  userAvatar,
  onLogout,
  isLoading: profileLoading
}: UserProfileDropdownProps) => {
  const { logout, isLoading } = useLogout();
  const [imageLoading, setImageLoading] = useState(true);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  
  // Reset loading state when avatar URL changes
  useEffect(() => {
    if (userAvatar) {
      setImageLoading(true);
    }
  }, [userAvatar]);
  return (
    <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-xl py-2 z-50 border border-border">
      {/* User Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {!userAvatar ? (
            <Skeleton className="w-full h-full rounded-full" />
          ) : (
            <>
              {imageLoading && <Skeleton className="w-full h-full rounded-full" />}
              <img 
                src={userAvatar} 
                alt={userName} 
                className={`w-full h-full object-cover ${imageLoading ? 'hidden' : ''}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {profileLoading || !userName ? (
            <Skeleton className="h-4 w-24 mb-1" />
          ) : (
            <p className="text-card-foreground text-sm font-medium truncate">{userName}</p>
          )}
          {profileLoading || !userEmail ? (
            <Skeleton className="h-3 w-32" />
          ) : (
            <p className="text-muted-foreground text-xs truncate">{userEmail}</p>
          )}
        </div>
      </div>

      {/* Menu Options */}
      <div className="py-1">
        <button 
          onClick={() => setAccountSettingsOpen(true)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent/10 transition-colors w-full text-left"
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-card-foreground" />
            <span className="text-sm text-card-foreground">Theme</span>
          </div>
          <div className="bg-background rounded-full p-0.5">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-border pt-1">
        <button 
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent/10 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            onLogout?.();
            logout();
          }}
          disabled={isLoading}
        >
          <FiLogOut className="w-4 h-4" />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      <AccountSettingsDialog 
        open={accountSettingsOpen} 
        onOpenChange={setAccountSettingsOpen} 
      />
    </div>
  );
};

export const UserProfileDropdown = memo(UserProfileDropdownComponent, (prevProps, nextProps) => {
  // Return true if props are equal (don't re-render)
  return (
    prevProps.userName === nextProps.userName &&
    prevProps.userEmail === nextProps.userEmail &&
    prevProps.userAvatar === nextProps.userAvatar &&
    prevProps.isLoading === nextProps.isLoading
  );
});

UserProfileDropdown.displayName = 'UserProfileDropdown';
