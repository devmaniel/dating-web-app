import { useState } from 'react';
import { MdOutlineWbSunny } from 'react-icons/md';
import { IoMoonOutline } from 'react-icons/io5';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { cn } from '@/shared/utils/cn';

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
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');

  return (
    <div className="relative inline-flex items-center bg-primary/10 rounded-full p-1 gap-1">
      {themeOptions.map(({ value, icon: Icon, label }) => {
        const isSelected = selectedTheme === value;
        
        return (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedTheme(value)}
            className={cn(
              'relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50',
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
                className="absolute inset-0 bg-primary rounded-full shadow-md"
                aria-hidden="true"
              />
            )}
            
            {/* Icon */}
            <Icon className={cn(
              'relative z-10 w-5 h-5 transition-transform duration-200',
              isSelected && 'scale-110'
            )} />
          </button>
        );
      })}
    </div>
  );
};

