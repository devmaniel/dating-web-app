import { useState, useRef, useEffect, memo } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { NotificationDropdown } from '@/shared/components/notifications/NotificationDropdown';
import { notificationService } from '@/shared/services/notificationService';
import { useAuthStore } from '@/shared/stores/authStore';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export const Notification = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasActiveUnread, setHasActiveUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousUserIdRef = useRef<string | null>(null);
  
  // Get auth state
  const { token, isAuthenticated, user } = useAuthStore();
  const currentUserId = user?.id;

  // Initialize socket connection and notification service
  useEffect(() => {
    if (isAuthenticated && token && currentUserId) {
      // Check if user has changed (different user logged in)
      if (previousUserIdRef.current && previousUserIdRef.current !== currentUserId) {
        console.log('🔄 User changed, resetting notifications...', {
          previous: previousUserIdRef.current,
          current: currentUserId,
        });
        notificationService.reset();
        setNotifications([]);
        setUnreadCount(0);
        setHasActiveUnread(false);
      }
      
      // Update the tracked user ID
      previousUserIdRef.current = currentUserId;
      
      console.log('🔌 Initializing socket connection for notifications...', { userId: currentUserId });
      
      // Initialize socket connection with auth token and load notifications
      const initializeNotifications = async () => {
        try {
          await notificationService.initializeSocket(token);
          console.log('✅ Notification service initialized');
        } catch (error) {
          console.error('❌ Failed to initialize notification service:', error);
        }
      };
      
      initializeNotifications();
      
      // Subscribe to notifications from API/Socket
      const unsubscribe = notificationService.subscribe((newNotifications) => {
        console.log('📱 Notifications updated:', newNotifications.length, newNotifications);
        setNotifications(newNotifications);
      });
      
      // Subscribe to unread count
      const unsubscribeUnread = notificationService.subscribeToUnreadCount((count) => {
        console.log('🔔 Unread count updated:', count);
        setUnreadCount(count);
        // Update active status based on recent activity
        setHasActiveUnread(notificationService.hasActiveUnread());
      });
      
      return () => {
        unsubscribe();
        unsubscribeUnread();
      };
    } else {
      // User not authenticated, disconnect socket and reset service
      console.log('❌ User not authenticated, disconnecting socket and resetting...');
      notificationService.disconnectSocket();
      notificationService.reset();
      setNotifications([]);
      setUnreadCount(0);
      setHasActiveUnread(false);
      previousUserIdRef.current = null;
    }
  }, [isAuthenticated, token, currentUserId]);

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

  // Auto-mark notifications as read when dropdown opens
  const handleDropdownOpen = () => {
    const wasOpen = isOpen;
    setIsOpen(!isOpen);
    
    // If dropdown is being opened and there are unread notifications
    if (!wasOpen && unreadCount > 0) {
      // Mark all as read automatically
      notificationService.markAllAsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`p-2 hover:bg-gray-100 rounded-full transition-colors relative ${
          !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Notifications"
        onClick={handleDropdownOpen}
        disabled={!isAuthenticated}
        title={!isAuthenticated ? 'Please log in to view notifications' : 'Notifications'}
      >
        <IoNotificationsOutline className={`w-6 h-6 transition-colors ${
          hasActiveUnread ? 'text-accent' : 'text-foreground hover:text-black'
        }`} />
        {unreadCount > 0 && (
          <span className={`absolute top-0 right-0 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all ${
            hasActiveUnread ? 'bg-accent' : 'bg-accent/80'
          }`}>
            {unreadCount}
          </span>
        )}
        {hasActiveUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
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
});
