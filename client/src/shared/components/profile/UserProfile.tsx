import { useState, useRef, useEffect } from 'react';
import { UserProfileDropdown } from '@/shared/components/profile/UserProfileDropdown';

interface UserProfileProps {
  userAvatar?: string;
}

export const UserProfile = ({ userAvatar = "https://64.media.tumblr.com/173ab213a9eef16f7bcdccb3d930ff33/b34f75b17936aaa7-1b/s1280x1920/cfb626e0b20a53e5856752ad12659fa9338b66e1.jpg" }: UserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logout clicked');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
          <img src={userAvatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && <UserProfileDropdown onLogout={handleLogout} userAvatar={userAvatar} />}
    </div>
  );
};
