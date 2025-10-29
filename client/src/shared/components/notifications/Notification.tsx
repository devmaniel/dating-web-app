import { useState, useRef, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { NotificationDropdown } from '@/shared/components/notifications/NotificationDropdown';
import { notificationService } from '@/shared/services/notificationService';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize notification service and request permission
  useEffect(() => {
    // Request browser notification permission
    notificationService.requestPermission();
    
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });
    
    // Subscribe to unread count
    const unsubscribeUnread = notificationService.subscribeToUnreadCount((count) => {
      setUnreadCount(count);
    });
    
    return () => {
      unsubscribe();
      unsubscribeUnread();
    };
  }, []);

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

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoNotificationsOutline className="w-6 h-6 text-foreground hover:text-black" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-accent text-white  text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <NotificationDropdown 
          notifications={notifications} 
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
};
