import { useState, useRef, useEffect } from "react";
import { LuUndoDot } from "react-icons/lu";
import { VscSettings } from "react-icons/vsc";
import type { FilterSettings } from "../contexts/SwipeContext";

interface ActionButtonsProps {
  onUndo?: () => void;
  onFilterChange?: (filters: FilterSettings) => void;
}

export const ActionButtons = ({ onUndo, onFilterChange }: ActionButtonsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<FilterSettings>({
    genderPreferences: ['male', 'female', 'nonbinary'],
    purposes: ['study-buddy', 'date', 'bizz'],
    ageRange: { min: 18, max: 99 },
    maxDistance: 100
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleGenderPreference = (gender: 'male' | 'female' | 'nonbinary') => {
    // Prevent unchecking if it's the last selected option
    if (filters.genderPreferences.includes(gender) && filters.genderPreferences.length === 1) {
      return;
    }
    
    const newPreferences = filters.genderPreferences.includes(gender)
      ? filters.genderPreferences.filter(g => g !== gender)
      : [...filters.genderPreferences, gender];
    
    const newFilters = { ...filters, genderPreferences: newPreferences };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const togglePurpose = (purpose: 'study-buddy' | 'date' | 'bizz') => {
    // Prevent unchecking if it's the last selected option
    if (filters.purposes.includes(purpose) && filters.purposes.length === 1) {
      return;
    }
    
    const newPurposes = filters.purposes.includes(purpose)
      ? filters.purposes.filter(p => p !== purpose)
      : [...filters.purposes, purpose];
    
    const newFilters = { ...filters, purposes: newPurposes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const purposeLabels = {
    'study-buddy': 'Study Buddy',
    'date': 'Dating',
    'bizz': 'Networking'
  };

  const genderLabels = {
    'male': 'Male',
    'female': 'Female',
    'nonbinary': 'Nonbinary'
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button
        type="button"
        className="p-2 hover:bg-accent/10 rounded-full transition-colors"
        aria-label="Undo"
        onClick={onUndo}
      >
        <LuUndoDot className="w-5 h-5 text-foreground" />
      </button>
      
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          className="p-2 hover:bg-accent/10 rounded-full transition-colors"
          aria-label="Settings"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <VscSettings className="w-5 h-5 text-foreground" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-card rounded-xl shadow-xl border border-border z-50 p-5 animate-in fade-in duration-200">
            {/* Gender Preferences Section */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Show me</h3>
              <div className="space-y-1">
                {(['male', 'female', 'nonbinary'] as const).map((gender) => {
                  const isChecked = filters.genderPreferences.includes(gender);
                  const isDisabled = isChecked && filters.genderPreferences.length === 1;
                  
                  return (
                    <label
                      key={gender}
                      className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-all ${
                        isChecked 
                          ? 'bg-primary/10 hover:bg-primary/15' 
                          : 'hover:bg-accent/10'
                      } ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleGenderPreference(gender)}
                          disabled={isDisabled}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-primary border-primary' 
                            : 'border-border bg-background'
                        }`}>
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        isChecked ? 'text-primary' : 'text-foreground'
                      }`}>{genderLabels[gender]}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Age Range Section */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Age Range</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground w-12 flex-shrink-0">Min:</label>
                  <input
                    type="range"
                    min="18"
                    max="99"
                    value={filters.ageRange.min}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      const newFilters = {
                        ...filters,
                        ageRange: { ...filters.ageRange, min: Math.min(newMin, filters.ageRange.max) }
                      };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-10 flex-shrink-0 text-right">{filters.ageRange.min}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground w-12 flex-shrink-0">Max:</label>
                  <input
                    type="range"
                    min="18"
                    max="99"
                    value={filters.ageRange.max}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      const newFilters = {
                        ...filters,
                        ageRange: { ...filters.ageRange, max: Math.max(newMax, filters.ageRange.min) }
                      };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-10 flex-shrink-0 text-right">{filters.ageRange.max}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Distance Section */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Max Distance</h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.maxDistance}
                  onChange={(e) => {
                    const newFilters = { ...filters, maxDistance: parseInt(e.target.value) };
                    setFilters(newFilters);
                    onFilterChange?.(newFilters);
                  }}
                  className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm font-semibold text-primary w-20 flex-shrink-0 text-right">{filters.maxDistance} km</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Looking For Section */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Looking for</h3>
              <div className="space-y-1">
                {(['study-buddy', 'date', 'bizz'] as const).map((purpose) => {
                  const isChecked = filters.purposes.includes(purpose);
                  const isDisabled = isChecked && filters.purposes.length === 1;
                  
                  return (
                    <label
                      key={purpose}
                      className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-all ${
                        isChecked 
                          ? 'bg-primary/10 hover:bg-primary/15' 
                          : 'hover:bg-accent/10'
                      } ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePurpose(purpose)}
                          disabled={isDisabled}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-primary border-primary' 
                            : 'border-border bg-background'
                        }`}>
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        isChecked ? 'text-primary' : 'text-foreground'
                      }`}>{purposeLabels[purpose]}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
