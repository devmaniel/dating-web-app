import * as React from 'react';
import { Check, ChevronsUpDown, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface LocationInputProps {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

interface GeocodingResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const LocationInput = React.forwardRef<HTMLDivElement, LocationInputProps>(
  ({ value, onChange, id }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [geocodingResults, setGeocodingResults] = React.useState<GeocodingResult[]>([]);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

    // Fetch geocoding results from Nominatim
    const fetchGeocodingResults = React.useCallback(async (query: string) => {
      if (query.length < 3) {
        setGeocodingResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)},Philippines&` +
          `format=json&` +
          `limit=10&` +
          `addressdetails=1`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGeocodingResults(data);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setGeocodingResults([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    // Debounced search
    React.useEffect(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (search.length >= 3) {
        debounceTimerRef.current = setTimeout(() => {
          fetchGeocodingResults(search);
        }, 500);
      } else {
        setGeocodingResults([]);
      }

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, [search, fetchGeocodingResults]);

    // Map geocoding results to display options
    const displayOptions = React.useMemo(() => {
      return geocodingResults.map((result) => ({
        value: result.display_name,
        label: result.display_name,
      }));
    }, [geocodingResults]);

    const selectedLabel = React.useMemo(() => {
      if (value) return value;
      return '';
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
          className="relative flex items-center justify-between w-full h-12 px-3 pl-10 bg-secondary border border-black rounded-md hover:bg-background hover:border-black focus:bg-background focus:border-black focus:outline-none transition-colors"
        >
          <div className="absolute left-3 pointer-events-none">
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className={cn('text-base truncate', value ? 'text-foreground' : 'text-muted-foreground')}>
            {selectedLabel || 'Select location...'}
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
                placeholder="Type to search (e.g., Makati, BGC, Quezon City)..."
                className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:border-black bg-background"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {isLoading ? (
                <div className="px-3 py-4 flex items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching locations...
                </div>
              ) : search.length < 3 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  Search...
                </div>
              ) : displayOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  No locations found.
                </div>
              ) : (
                displayOptions.map((option) => (
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

LocationInput.displayName = 'LocationInput';
