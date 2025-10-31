import { useState, useRef, useEffect, useCallback } from "react";
import { VscSettings } from "react-icons/vsc";
import { useUserProfileCached } from '@/shared/hooks/useUserProfileCached';
import { updateMatchingPrefs } from '@/api/profile';

interface FilterSettings {
  genderPreferences: Array<'male' | 'female' | 'nonbinary'>;
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
  ageRange: { min: number; max: number };
  distanceRange: { min: number; max: number };
}

interface ActionButtonsProps {
  onFilterChange?: (filters: FilterSettings) => void;
}

export const ActionButtons = ({ onFilterChange }: ActionButtonsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { profile, refetch: refetchProfile } = useUserProfileCached();
  
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
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Update filters when profile loads from database
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
    }
  }, [profile?.matching_prefs]);

  // Update filters: save to database AND refetch matches
  const updateFilters = useCallback(async (newFilters: FilterSettings) => {
    console.log('[ActionButtons] Updating filters:', newFilters);
    
    // Update local state
    setFilters(newFilters);
    
    // Save to database
    try {
      await updateMatchingPrefs({
        gender_preferences: newFilters.genderPreferences,
        purpose_preference: newFilters.purposes,
        distance_min_km: newFilters.distanceRange.min,
        distance_max_km: newFilters.distanceRange.max,
      });
      console.log('[ActionButtons] Preferences saved to database');
      
      // Refetch profile to update cache with new preferences
      await refetchProfile();
      console.log('[ActionButtons] Profile cache refreshed');
    } catch (error) {
      console.error('[ActionButtons] Failed to save preferences:', error);
    }
    
    // Trigger refetch with new filters
    onFilterChange?.(newFilters);
    
    // Close dropdown
    setIsDropdownOpen(false);
  }, [onFilterChange, refetchProfile]);

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
    
    setFilters({ ...filters, genderPreferences: newPreferences });
  };

  const togglePurpose = (purpose: 'study-buddy' | 'date' | 'bizz') => {
    // Prevent unchecking if it's the last selected option
    if (filters.purposes.includes(purpose) && filters.purposes.length === 1) {
      return;
    }
    
    const newPurposes = filters.purposes.includes(purpose)
      ? filters.purposes.filter(p => p !== purpose)
      : [...filters.purposes, purpose];
    
    setFilters({ ...filters, purposes: newPurposes });
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
                      setFilters({
                        ...filters,
                        ageRange: { ...filters.ageRange, min: Math.min(newMin, filters.ageRange.max) }
                      });
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
                      setFilters({
                        ...filters,
                        ageRange: { ...filters.ageRange, max: Math.max(newMax, filters.ageRange.min) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-10 flex-shrink-0 text-right">{filters.ageRange.max}</span>
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
                    value={filters.distanceRange.min}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      setFilters({
                        ...filters,
                        distanceRange: { ...filters.distanceRange, min: Math.min(newMin, filters.distanceRange.max) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-16 flex-shrink-0 text-right">{filters.distanceRange.min} km</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground w-12 flex-shrink-0">Max:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.distanceRange.max}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      setFilters({
                        ...filters,
                        distanceRange: { ...filters.distanceRange, max: Math.max(newMax, filters.distanceRange.min) }
                      });
                    }}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold text-primary w-16 flex-shrink-0 text-right">{filters.distanceRange.max} km</span>
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

            {/* Update Filters Button */}
            <div className="mt-5 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => updateFilters(filters)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Update Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
