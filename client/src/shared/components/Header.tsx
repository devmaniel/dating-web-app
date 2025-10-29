import FlexLogoLight from '@/assets/svgs/flex-text-logo-light-mode.svg';
import FlexLogoDark from '@/assets/svgs/flex-text-logo-dark-mode.svg';
import FallbackLogo from '@/assets/image/icon.jpg';
import { UserProfile } from '@/shared/components/profile/UserProfile';
import { Notification } from '@/shared/components/notifications/Notification';
import { useTheme } from '@/shared/contexts/theme-context';

export const Header = () => {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === 'dark' ? FlexLogoDark : FlexLogoLight;

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-[700px] mx-auto py-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logoSrc} 
            alt="Flex Logo" 
            className="h-10 w-auto"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = FallbackLogo;
            }}
          />
        </div>

        {/* Right side: Theme Toggle, Notification, User */}
        <div className="flex items-center gap-3">
          <Notification />

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};
