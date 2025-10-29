import { MdOutlineWbSunny } from 'react-icons/md';
import { IoMoonOutline } from 'react-icons/io5';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { cn } from '@/shared/utils/cn';
import { useTheme } from '@/shared/contexts/theme-context';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', icon: MdOutlineWbSunny, label: 'Light' },
  { value: 'dark', icon: IoMoonOutline, label: 'Dark' },
  { value: 'system', icon: HiOutlineComputerDesktop, label: 'System' },
];

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative inline-flex items-center bg-primary/10 rounded-full p-0.5 gap-0.5">
      {themeOptions.map(({ value, icon: Icon, label }) => {
        const isSelected = theme === value;
        
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              'relative z-10 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary/50',
              isSelected
                ? 'text-white'
                : 'text-primary/60 hover:text-primary'
            )}
            aria-label={label}
            aria-pressed={isSelected}
          >
            {/* Background circle */}
            {isSelected && (
              <span 
                className="absolute inset-0 bg-primary rounded-full shadow-sm"
                aria-hidden="true"
              />
            )}
            
            {/* Icon */}
            <Icon className={cn(
              'relative z-10 w-4 h-4 transition-transform duration-200',
              isSelected && 'scale-110'
            )} />
          </button>
        );
      })}
    </div>
  );
};

