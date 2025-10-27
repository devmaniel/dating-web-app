import { forwardRef } from 'react';

export interface LookingForInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LookingForInput = forwardRef<HTMLInputElement, LookingForInputProps>(
  ({ value, onChange, placeholder = 'Study buddie and LOML' }, ref) => {
    return (
      <div className="w-full p-4 bg-secondary rounded-2xl">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-background rounded-xl border-2 border-transparent text-base text-foreground text-center placeholder:text-center placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-gray-900 transition-all duration-200"
        />
      </div>
    );
  }
);

LookingForInput.displayName = 'LookingForInput';
