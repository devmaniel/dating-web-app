'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export interface BirthdateInputsProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Function to get the number of days in a month
const getDaysInMonth = (month: number, year: number): number => {
  if (month === 2) {
    // February - check for leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeapYear ? 29 : 28;
  }
  // Months with 30 days: April, June, September, November
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  // All other months have 31 days
  return 31;
};

interface DatePickerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: (string | number)[];
  onSelect: (item: string | number) => void;
  selectedValue: string;
  label: string;
}

const DatePickerMenu: React.FC<DatePickerMenuProps> = ({
  isOpen,
  onClose,
  items,
  onSelect,
  selectedValue,
  label,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [search, setSearch] = React.useState('');

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const searchLower = search.toLowerCase();
    
    if (label === 'Month') {
      return items.filter((item) => 
        MONTHS[Number(item) - 1].toLowerCase().includes(searchLower)
      );
    }
    return items.filter((item) => 
      String(item).includes(search)
    );
  }, [items, search, label]);

  React.useEffect(() => {
    if (isOpen && scrollContainerRef.current && selectedValue) {
      const selectedElement = scrollContainerRef.current.querySelector(
        `[data-value="${selectedValue}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center' });
      }
    }
    // Focus search input when menu opens
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Reset search when menu closes
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen, selectedValue]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredItems.length > 0) {
      onSelect(filteredItems[0]);
      onClose();
    }
  };

  if (!isOpen) return <div ref={menuRef} />;

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-lg z-50 max-h-64 overflow-hidden flex flex-col"
    >
      <div className="px-4 py-3 border-b border-border bg-muted">
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${label.toLowerCase()}...`}
          className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:border-black bg-background"
        />
      </div>
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto flex-1"
      >
        {filteredItems.length === 0 ? (
          <div className="px-4 py-3 text-sm text-muted-foreground text-center">
            No {label.toLowerCase()} found.
          </div>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item}
              data-value={item}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                String(item) === String(selectedValue)
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {label === 'Month' ? MONTHS[Number(item) - 1] : item}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export const BirthdateInputs = React.forwardRef<HTMLDivElement, BirthdateInputsProps>(
  ({ value, onChange, name }, ref) => {
    const [day, setDay] = React.useState<string>('');
    const [month, setMonth] = React.useState<string>('');
    const [year, setYear] = React.useState<string>('');

    const [openMenu, setOpenMenu] = React.useState<'day' | 'month' | 'year' | null>(null);

    // Initialize values from prop
    React.useEffect(() => {
      if (value) {
        try {
          const [y, m, d] = value.split('-');
          setYear(y);
          setMonth(m);
          setDay(d);
        } catch {
          // Invalid format, ignore
        }
      }
    }, [value]);

    // Update the parent form value when day, month, or year changes
    React.useEffect(() => {
      if (day && month && year) {
        const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        onChange?.(dateStr);
      } else {
        onChange?.('');
      }
    }, [day, month, year, onChange]);

    const getDisplayValue = (type: 'day' | 'month' | 'year') => {
      if (type === 'day') return day || 'Day';
      if (type === 'month') return month ? MONTHS[Number(month) - 1] : 'Month';
      return year || 'Year';
    };

    // Calculate available days based on selected month and year
    const getAvailableDays = (): number[] => {
      if (!month || !year) {
        return Array.from({ length: 31 }, (_, i) => i + 1);
      }
      const daysInMonth = getDaysInMonth(Number(month), Number(year));
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const availableDays = getAvailableDays();

    // Reset day if it exceeds the max days in the selected month
    React.useEffect(() => {
      if (day && month && year) {
        const daysInMonth = getDaysInMonth(Number(month), Number(year));
        if (Number(day) > daysInMonth) {
          setDay('');
        }
      }
    }, [month, year, day]);

    return (
      <div ref={ref}>
        <div className="grid grid-cols-3 gap-4">
          {/* Day Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'day' ? null : 'day')}
              className="w-full h-16 px-4 bg-secondary border border-black rounded-2xl text-foreground text-lg font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-all flex items-center justify-between"
            >
              <span>{getDisplayValue('day')}</span>
              <ChevronDown
                size={20}
                className={`text-muted-foreground transition-transform ${
                  openMenu === 'day' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <DatePickerMenu
              isOpen={openMenu === 'day'}
              onClose={() => setOpenMenu(null)}
              items={availableDays}
              onSelect={(item) => setDay(String(item))}
              selectedValue={day}
              label="Day"
            />
          </div>

          {/* Month Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'month' ? null : 'month')}
              className="w-full h-16 px-4 bg-secondary border border-black rounded-2xl text-foreground text-lg font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-all flex items-center justify-between"
            >
              <span>{getDisplayValue('month')}</span>
              <ChevronDown
                size={20}
                className={`text-muted-foreground transition-transform ${
                  openMenu === 'month' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <DatePickerMenu
              isOpen={openMenu === 'month'}
              onClose={() => setOpenMenu(null)}
              items={MONTHS.map((_, i) => i + 1)}
              onSelect={(item) => setMonth(String(item))}
              selectedValue={month}
              label="Month"
            />
          </div>

          {/* Year Input */}
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Year"
              value={year}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 4) {
                  setYear(value);
                }
              }}
              className="w-full h-16 px-4 bg-secondary border border-black rounded-2xl text-foreground text-lg font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>
        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={value || ''} />
      </div>
    );
  }
);

BirthdateInputs.displayName = 'BirthdateInputs';
