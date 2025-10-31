import { IoNotificationsOutline } from 'react-icons/io5';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

// Helper function to check if notification is recent (within 30 seconds)
const isRecentNotification = (timeString: string): boolean => {
  // Parse relative time strings
  if (timeString === 'Just now') return true;
  if (timeString.includes('minutes ago')) {
    const minutes = parseInt(timeString.split(' ')[0]);
    return minutes < 1; // Less than 1 minute
  }
  
  return false;
};

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown = ({ 
  notifications
}: NotificationDropdownProps) => {

  return (
    <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl py-2 z-50 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground">Notifications</h3>
        {notifications.length > 0 && (
          <span className="bg-accent/10 text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {notifications.length} total
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <IoNotificationsOutline className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => {
              const isRecent = isRecentNotification(notification.time);
              const isUnreadAndRecent = !notification.isRead && isRecent;
              
              return (
                <li 
                  key={notification.id}
                  className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-accent/10 transition-all ${
                    !notification.isRead ? 'bg-accent/5' : ''
                  } ${isUnreadAndRecent ? 'border-l-4 border-l-accent' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-medium text-card-foreground ${
                      isUnreadAndRecent ? 'text-accent' : ''
                    }`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {isUnreadAndRecent && (
                        <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                      {!notification.isRead && (
                        <span className={`w-2 h-2 rounded-full ${
                          isRecent ? 'bg-accent' : 'bg-accent'
                        }`}></span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                  <p className={`text-xs mt-2 ${
                    isUnreadAndRecent ? 'text-accent font-medium' : 'text-muted-foreground'
                  }`}>
                    {notification.time}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          {notifications.length > 5 && 'Scroll to see all notifications'}
        </p>
      </div>
    </div>
  );
};
