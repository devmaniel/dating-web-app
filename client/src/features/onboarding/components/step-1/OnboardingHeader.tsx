import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import logoSvg from '@/assets/svgs/flex-text-logo-light-mode.svg';

export const OnboardingHeader = () => {
  return (
    <div className="flex mt-12 items-center justify-between mb-12">
      <div className="flex items-center">
        <img src={logoSvg} alt="Chemistry Logo" className="h-10 object-contain" />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </div>
  );
};
