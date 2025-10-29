import { IoNotificationsOutline } from 'react-icons/io5';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown = ({ 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationDropdownProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl py-2 z-50 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-accent/10 text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
          <button 
            onClick={onMarkAllAsRead}
            className="text-xs text-accent hover:text-accent-foreground"
          >
            Mark all as read
          </button>
        </div>
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
            {notifications.map((notification) => (
              <li 
                key={notification.id}
                className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-accent/10 ${!notification.isRead ? 'bg-accent/5' : ''}`}
              >
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-card-foreground">{notification.title}</h4>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                {!notification.isRead && (
                  <button 
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-xs text-accent hover:text-accent-foreground mt-2"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))
          }
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">Scroll to see all notifications</p>
      </div>
    </div>
  );
};
