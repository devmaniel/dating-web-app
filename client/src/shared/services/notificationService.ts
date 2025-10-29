interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

// Browser-based push notification simulation service
class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private unreadCountListeners: Array<(count: number) => void> = [];
  
  constructor() {
    // Simulate initial notifications
    this.notifications = [
      {
        id: '1',
        title: 'New match!',
        description: 'You have a new match with Sarah.',
        time: '2 hours ago',
        isRead: false
      },
      {
        id: '2',
        title: 'Message received',
        description: 'John sent you a message.',
        time: '5 hours ago',
        isRead: true
      },
      {
        id: '3',
        title: 'Profile viewed',
        description: 'Your profile was viewed by 5 people.',
        time: '1 day ago',
        isRead: false
      }
    ];
    
    // Simulate receiving new notifications periodically
    this.simulateNewNotifications();
  }
  
  // Subscribe to notification updates
  public subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    // Send initial notifications
    listener(this.notifications);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Subscribe to unread count updates
  public subscribeToUnreadCount(listener: (count: number) => void) {
    this.unreadCountListeners.push(listener);
    // Send initial count
    listener(this.getUnreadCount());
    return () => {
      this.unreadCountListeners = this.unreadCountListeners.filter(l => l !== listener);
    };
  }
  
  // Get all notifications
  public getNotifications(): Notification[] {
    return [...this.notifications];
  }
  
  // Get unread count
  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
  
  // Mark a notification as read
  public markAsRead(id: string) {
    this.notifications = this.notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    this.notifyListeners();
    this.notifyUnreadCountListeners();
  }
  
  // Mark all notifications as read
  public markAllAsRead() {
    this.notifications = this.notifications.map(notification => ({ ...notification, isRead: true }));
    this.notifyListeners();
    this.notifyUnreadCountListeners();
  }
  
  // Add a new notification
  public addNotification(notification: Omit<Notification, 'isRead'>) {
    const newNotification: Notification = {
      ...notification,
      isRead: false
    };
    
    this.notifications = [newNotification, ...this.notifications];
    this.notifyListeners();
    this.notifyUnreadCountListeners();
    
    // Show browser notification if permission is granted
    this.showBrowserNotification(newNotification.title, newNotification.description);
  }
  
  // Show browser notification
  private showBrowserNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, { 
        body,
        icon: '/web_icon.svg' // You can customize this
      });
    }
  }
  
  // Request browser notification permission
  public requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }
  
  // Notify all listeners of notification updates
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getNotifications()));
  }
  
  // Notify all listeners of unread count updates
  private notifyUnreadCountListeners() {
    const count = this.getUnreadCount();
    this.unreadCountListeners.forEach(listener => listener(count));
  }
  
  // Simulate receiving new notifications
  private simulateNewNotifications() {
    // In a real app, this would be replaced with actual socket connections or API polling
    setInterval(() => {
      // Randomly decide whether to send a notification (20% chance every 30 seconds)
      if (Math.random() < 0.2) {
        const notifications = [
          {
            id: Date.now().toString(),
            title: 'New match!',
            description: `You have a new match with ${this.getRandomName()}.`,
            time: 'Just now'
          },
          {
            id: Date.now().toString(),
            title: 'Message received',
            description: `${this.getRandomName()} sent you a message.`,
            time: 'Just now'
          },
          {
            id: Date.now().toString(),
            title: 'Profile viewed',
            description: `Your profile was viewed by ${this.getRandomName()}.`,
            time: 'Just now'
          }
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        this.addNotification(randomNotification);
      }
    }, 30000); // Every 30 seconds
  }
  
  // Helper to generate random names for simulation
  private getRandomName(): string {
    const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Drew', 'Skyler', 'Jamie'];
    return names[Math.floor(Math.random() * names.length)];
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
