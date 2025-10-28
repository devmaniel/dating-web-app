import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { philippineSchools } from '../../schemas/onboardingStepTwoSchema';

export interface SchoolInputProps {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const SchoolInput = React.forwardRef<HTMLDivElement, SchoolInputProps>(
  ({ value, onChange, id }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    const filteredOptions = React.useMemo(() => {
      if (!search) return philippineSchools;
      const searchLower = search.toLowerCase();
      return philippineSchools.filter((option) =>
        option.label.toLowerCase().includes(searchLower)
      );
    }, [search]);

    const selectedLabel = React.useMemo(() => {
      const selected = philippineSchools.find((option) => option.value === value);
      return selected?.label || '';
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open]);

    const handleSelect = (selectedValue: string) => {
      onChange?.(selectedValue);
      setOpen(false);
      setSearch('');
    };

    return (
      <div ref={containerRef} className="relative">
        <button
          ref={ref as React.RefObject<HTMLButtonElement>}
          id={id}
          type="button"
          onClick={() => setOpen(!open)}
          className="relative flex items-center justify-between w-full h-12 px-3 bg-secondary border border-black rounded-md hover:bg-background hover:border-black focus:bg-background focus:border-black focus:outline-none transition-colors"
        >
          <span className={cn('text-base truncate', value ? 'text-foreground' : 'text-muted-foreground')}>
            {selectedLabel || ''}
          </span>
          <ChevronsUpDown className="w-4 h-4 ml-2 text-muted-foreground flex-shrink-0" />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-card border border-black rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search school..."
                className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:border-black bg-background"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  No schools found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-muted transition-colors',
                      value === option.value && 'bg-muted'
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SchoolInput.displayName = 'SchoolInput';
