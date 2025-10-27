import { Search } from 'lucide-react';
import { forwardRef } from 'react';

export interface SongSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SongSearchInput = forwardRef<HTMLInputElement, SongSearchInputProps>(
  ({ value, onChange, placeholder = 'Search for a song or artist...' }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pr-12 bg-secondary rounded-full border-2 border-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-gray-900 transition-all duration-200"
        />
        <Search 
          className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground" 
          size={20}
        />
      </div>
    );
  }
);

SongSearchInput.displayName = 'SongSearchInput';
