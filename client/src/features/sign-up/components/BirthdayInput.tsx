import { forwardRef, useState, useEffect } from 'react';
import { Calendar } from '@/shared/components/ui/calendar-rac';
import { DateField, DateInput } from '@/shared/components/ui/datefield-rac';
import { CalendarIcon } from 'lucide-react';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import type { DateValue } from 'react-aria-components';

type BirthdayInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const BirthdayInput = forwardRef<HTMLInputElement, BirthdayInputProps>(
  ({ value, onChange, onBlur, name, id, hasError, ...props }, ref) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
    const [inputValue, setInputValue] = useState(value as string || '');

    useEffect(() => {
      if (value && typeof value === 'string' && value !== inputValue) {
        setInputValue(value);
        try {
          setSelectedDate(parseDate(value));
        } catch {
          setSelectedDate(null);
        }
      }
    }, [value, inputValue]);

    const handleDateChange = (date: DateValue | null) => {
      setSelectedDate(date);
      if (date) {
        const dateString = date.toString();
        setInputValue(dateString);
        // Trigger react-hook-form onChange
        if (onChange) {
          const event = {
            target: {
              name: name || '',
              value: dateString,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
      }
      setShowCalendar(false);
    };

    const maxDate = today(getLocalTimeZone()).subtract({ years: 18 });
    const minDate = today(getLocalTimeZone()).subtract({ years: 100 });

    return (
      <div className="relative">
        <input
          ref={ref}
          type="hidden"
          name={name}
          id={id}
          className='text-background'
          value={inputValue}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        <div className={`relative flex items-center bg-gray-200 border rounded-md transition-colors h-12 ${
          hasError 
            ? 'border-destructive bg-red-50 hover:border-destructive focus-within:border-destructive' 
            : 'border-transparent hover:bg-white hover:border-gray-900 focus-within:bg-white focus-within:border-gray-900'
        }`}>
          <div className="flex-1 px-3">
            <DateField
              value={selectedDate}
              onChange={handleDateChange}
              maxValue={maxDate}
              minValue={minDate}
              className="w-full"
            >
              <DateInput
                unstyled
                className="w-full h-12 text-background bg-transparent text-gray-600 text-sm focus:outline-none flex items-center"
                segmentClassName="data-placeholder:text-background data-focused:data-placeholder:text-background data-invalid:data-placeholder:text-background data-invalid:data-focused:data-placeholder:text-background"
              />
            </DateField>
          </div>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="mr-3 text-foreground hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Toggle calendar"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>

        {showCalendar && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowCalendar(false)}
            />
            <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              <Calendar
                value={selectedDate}
                onChange={handleDateChange}
                maxValue={maxDate}
                minValue={minDate}
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

BirthdayInput.displayName = 'BirthdayInput';
