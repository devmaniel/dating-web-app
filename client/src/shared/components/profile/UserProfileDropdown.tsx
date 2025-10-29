import { FiLogOut } from 'react-icons/fi';
import { Settings, Palette } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';

interface UserProfileDropdownProps {
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export const UserProfileDropdown = ({ 
  onLogout, 
  userName = "Jean Doe",
  userEmail = "j.doe@gmail.com",
  userAvatar = "https://64.media.tumblr.com/173ab213a9eef16f7bcdccb3d930ff33/b34f75b17936aaa7-1b/s1280x1920/cfb626e0b20a53e5856752ad12659fa9338b66e1.jpg"
}: UserProfileDropdownProps) => {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-xl py-2 z-50 border border-border">
      {/* User Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold overflow-hidden">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span>{userName.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-card-foreground text-sm font-medium truncate">{userName}</p>
          <p className="text-muted-foreground text-xs truncate">{userEmail}</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="py-1">
        <a 
          href="/account-settings" 
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent/10 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </a>
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
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent/10 transition-colors w-full text-left"
          onClick={onLogout}
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
