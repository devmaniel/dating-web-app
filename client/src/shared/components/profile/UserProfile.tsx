import { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { UserProfileDropdown } from '@/shared/components/profile/UserProfileDropdown';
import { UserAvatar } from '@/shared/components/profile/UserAvatar';
import { useUserProfileStore } from '@/shared/stores/userProfileStore';
import { shallow } from 'zustand/shallow';

// Make component completely self-contained and persistent - never rerenders unnecessarily
const UserProfileComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use shallow comparison to prevent rerenders when store object reference changes
  // Only rerenders if actual profile data or loading state changes
  const { profile, profileLoading } = useUserProfileStore(
    state => ({
      profile: state.profile,
      profileLoading: state.isLoading
    }),
    shallow
  );

  // Component is now optimized with minimal re-renders

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = useCallback(() => {
    console.log('Logout clicked');
    setIsOpen(false);
  }, []);

  // Memoize avatar URL to prevent unnecessary recalculations
  const avatarUrl = useMemo(() => 
    profile?.profile_picture_url || undefined,
    [profile?.profile_picture_url]
  );
  
  // Memoize user name to prevent recalculation
  const userName = useMemo(() => 
    profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : undefined,
    [profile?.first_name, profile?.last_name]
  );

  // Avatar loading is now handled by UserAvatar component

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserAvatar 
          avatarUrl={avatarUrl}
          isLoading={profileLoading}
          size="md"
        />
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <UserProfileDropdown 
          userName={userName}
          userEmail={profile?.email}
          userAvatar={avatarUrl}
          onLogout={handleLogout}
          isLoading={profileLoading}
        />
      )}
    </div>
  );
};

// Wrap with memo to prevent rerenders from parent components
// Component is now completely persistent in layout
export const UserProfile = memo(UserProfileComponent);
UserProfile.displayName = 'UserProfile';
