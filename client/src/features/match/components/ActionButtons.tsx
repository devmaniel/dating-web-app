import { useState, useRef, useEffect, useCallback } from "react";
import { VscSettings } from "react-icons/vsc";
import type { FilterSettings } from "../contexts/SwipeContext";
import { useUserProfileCached } from '@/shared/hooks/useUserProfileCached';
import { updateMatchingPrefs } from '@/api/profile';

interface ActionButtonsProps {
  onFilterChange?: (filters: FilterSettings) => void;
}

export const ActionButtons = ({ onFilterChange }: ActionButtonsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { profile } = useUserProfileCached();
  
  // Initialize filters from user's saved preferences or use defaults
  const [filters, setFilters] = useState<FilterSettings>(() => {
    const matchingPrefs = profile?.matching_prefs;
    return {
      genderPreferences: matchingPrefs?.gender_preferences || ['male', 'female', 'nonbinary'],
      purposes: matchingPrefs?.purpose_preference || ['study-buddy', 'date', 'bizz'],
      ageRange: { min: 18, max: 25 },
      distanceRange: { 
        min: matchingPrefs?.distance_min_km ?? 0, 
        max: matchingPrefs?.distance_max_km ?? 100 
      }
    };
  });
  
  // Temporary filters while dropdown is open (not applied yet)
  const [tempFilters, setTempFilters] = useState<FilterSettings>(filters);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Update filters when profile loads
  useEffect(() => {
    const matchingPrefs = profile?.matching_prefs;
    if (matchingPrefs) {
      const newFilters = {
        genderPreferences: matchingPrefs.gender_preferences || ['male', 'female', 'nonbinary'],
        purposes: matchingPrefs.purpose_preference || ['study-buddy', 'date', 'bizz'],
        ageRange: { min: 18, max: 25 },
        distanceRange: { 
          min: matchingPrefs.distance_min_km ?? 0, 
          max: matchingPrefs.distance_max_km ?? 100 
        }
      };
      setFilters(newFilters);
      setTempFilters(newFilters);
      onFilterChange?.(newFilters);
    }
  }, [profile?.matching_prefs, onFilterChange]);

  // Apply filters and close dropdown
  const applyFilters = useCallback(() => {
    console.log('[ActionButtons] Applying filters:', tempFilters);
    setFilters(tempFilters);
    onFilterChange?.(tempFilters);
    savePreferences(tempFilters);
    setIsDropdownOpen(false);
  }, [tempFilters, onFilterChange, savePreferences]);

  // Close dropdown when clicking outside (apply filters on close)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        applyFilters();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, applyFilters]);

  // Save preferences to database
  const savePreferences = useCallback(async (newFilters: FilterSettings) => {
    try {
      await updateMatchingPrefs({
        gender_preferences: newFilters.genderPreferences,
        purpose_preference: newFilters.purposes,
        distance_min_km: newFilters.distanceRange.min,
        distance_max_km: newFilters.distanceRange.max,
      });
      console.log('[ActionButtons] Preferences saved to database');
    } catch (error) {
      console.error('[ActionButtons] Failed to save preferences:', error);
    }
  }, []);

  const toggleGenderPreference = (gender: 'male' | 'female' | 'nonbinary') => {
    // Prevent unchecking if it's the last selected option
    if (tempFilters.genderPreferences.includes(gender) && tempFilters.genderPreferences.length === 1) {
      return;
    }
    
    const newPreferences = tempFilters.genderPreferences.includes(gender)
      ? tempFilters.genderPreferences.filter(g => g !== gender)
      : [...tempFilters.genderPreferences, gender];
    
    setTempFilters({ ...tempFilters, genderPreferences: newPreferences });
  };

  const togglePurpose = (purpose: 'study-buddy' | 'date' | 'bizz') => {
    // Prevent unchecking if it's the last selected option
    if (tempFilters.purposes.includes(purpose) && tempFilters.purposes.length === 1) {
      return;
    }
    
    const newPurposes = tempFilters.purposes.includes(purpose)
      ? tempFilters.purposes.filter(p => p !== purpose)
      : [...tempFilters.purposes, purpose];
    
    setTempFilters({ ...tempFilters, purposes: newPurposes });
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
                  const isChecked = tempFilters.genderPreferences.includes(gender);
                  const isDisabled = isChecked && tempFilters.genderPreferences.length === 1;
                  
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
                    value={tempFilters.ageRange.min}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      setTempFilters({
                        ...tempFilters,
                        ageRange: { ...tempFilters.ageRange, min: Math.min(newMin, tempFilters.ageRange.max) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-10 flex-shrink-0 text-right">{tempFilters.ageRange.min}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground w-12 flex-shrink-0">Max:</label>
                  <input
                    type="range"
                    min="18"
                    max="99"
                    value={tempFilters.ageRange.max}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      setTempFilters({
                        ...tempFilters,
                        ageRange: { ...tempFilters.ageRange, max: Math.max(newMax, tempFilters.ageRange.min) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-10 flex-shrink-0 text-right">{tempFilters.ageRange.max}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Distance Range Section */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Distance Range</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground w-12 flex-shrink-0">Min:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempFilters.distanceRange.min}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      setTempFilters({
                        ...tempFilters,
                        distanceRange: { ...tempFilters.distanceRange, min: Math.min(newMin, tempFilters.distanceRange.max) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-16 flex-shrink-0 text-right">{tempFilters.distanceRange.min} km</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground w-12 flex-shrink-0">Max:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempFilters.distanceRange.max}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      setTempFilters({
                        ...tempFilters,
                        distanceRange: { ...tempFilters.distanceRange, max: Math.max(newMax, tempFilters.distanceRange.min) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-16 flex-shrink-0 text-right">{tempFilters.distanceRange.max} km</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Looking For Section */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Looking for</h3>
              <div className="space-y-1">
                {(['study-buddy', 'date', 'bizz'] as const).map((purpose) => {
                  const isChecked = tempFilters.purposes.includes(purpose);
                  const isDisabled = isChecked && tempFilters.purposes.length === 1;
                  
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

            {/* Apply Button */}
            <div className="mt-5 pt-4 border-t border-border">
              <button
                type="button"
                onClick={applyFilters}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
