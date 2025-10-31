import { LogOut } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { useLogout } from '@/features/auth/hooks';
import logoSvg from '@/assets/svgs/flex-text-logo-light-mode.svg';

export const OnboardingHeader = () => {
  const { logout, isLoading } = useLogout();

  return (
    <div className="flex mt-12 items-center justify-between mb-12">
      <div className="flex items-center">
        <img src={logoSvg} alt="Chemistry Logo" className="h-10 object-contain" />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={logout}
          disabled={isLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
