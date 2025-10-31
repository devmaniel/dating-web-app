import * as notificationAPI from '@/api/notifications';
import { socketService } from './socketService';
import { useAuthStore } from '@/shared/stores/authStore';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

// Real-time notification service with API integration
class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private unreadCountListeners: Array<(count: number) => void> = [];
  private isInitialized = false;
  private operationQueue: Promise<void> = Promise.resolve();
  private pendingOperations = new Set<string>();
  
  // Performance optimization: Cache unread count to avoid recalculation
  private cachedUnreadCount = 0;
  private lastUpdateTimestamp = Date.now();
  
  constructor() {
    // Don't auto-initialize - wait for explicit initialization with auth token
  }

  // Queue operations to prevent race conditions
  private async queueOperation<T>(operationId: string, operation: () => Promise<T>): Promise<T> {
    // If operation is already pending, wait for it to complete
    if (this.pendingOperations.has(operationId)) {
      await this.operationQueue;
      return this.getNotifications() as any; // Return current state for pending operations
    }

    this.pendingOperations.add(operationId);
    
    this.operationQueue = this.operationQueue.then(async () => {
      try {
        await operation();
      } finally {
        this.pendingOperations.delete(operationId);
      }
    });

    await this.operationQueue;
    return this.getNotifications() as any;
  }

  // Performance-optimized count increment/decrement
  private updateUnreadCount(delta: number) {
    this.cachedUnreadCount = Math.max(0, this.cachedUnreadCount + delta);
    this.lastUpdateTimestamp = Date.now();
    console.log(`📊 Unread count updated: ${delta > 0 ? '+' : ''}${delta} → ${this.cachedUnreadCount}`);
  }

  // Recalculate and sync cached count with actual notifications
  private syncUnreadCount() {
    const actualCount = this.notifications.filter(n => !n.isRead).length;
    if (this.cachedUnreadCount !== actualCount) {
      console.log(`🔄 Syncing count: cached(${this.cachedUnreadCount}) → actual(${actualCount})`);
      this.cachedUnreadCount = actualCount;
    }
    this.lastUpdateTimestamp = Date.now();
  }

  // Synchronously update state and notify listeners
  private updateStateSync(newNotifications: Notification[]) {
    const previousCount = this.cachedUnreadCount;
    this.notifications = newNotifications;
    
    // Sync cached count with actual count
    this.syncUnreadCount();
    
    console.log(`🔄 State updated: ${previousCount} → ${this.cachedUnreadCount} unread notifications`);
    
    this.notifyListeners();
    this.notifyUnreadCountListeners();
  }

  // Get current pending operations (for debugging)
  public getPendingOperations(): string[] {
    return Array.from(this.pendingOperations);
  }

  // Load notifications from API
  private async loadNotifications() {
    return this.queueOperation('loadNotifications', async () => {
      try {
        const currentUserId = useAuthStore.getState().user?.id;
        console.log('🔄 Loading notifications from API for user:', currentUserId);
        const response = await notificationAPI.getNotifications({ limit: 50 });
        console.log('📡 API Response:', response);
        
        let newNotifications: Notification[] = [];
        if (response.success && response.data) {
          // Filter notifications to ensure they belong to current user (extra safety)
          const filteredData = currentUserId 
            ? response.data.filter(n => n.user_id === currentUserId)
            : response.data;
          
          if (filteredData.length !== response.data.length) {
            console.warn('⚠️ Filtered out notifications not for current user:', {
              total: response.data.length,
              filtered: filteredData.length,
            });
          }
          
          newNotifications = filteredData.map(this.transformNotification.bind(this));
          console.log('✅ Transformed notifications:', newNotifications);
        } else {
          console.warn('⚠️ API response not successful or no data:', response);
        }
        
        // Synchronously update state to prevent race conditions
        this.updateStateSync(newNotifications);
      } catch (error) {
        console.error('❌ Failed to load notifications:', error);
        // Log more details about the error
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        // Keep existing notifications on error to maintain consistency
        this.updateStateSync(this.notifications);
        throw error;
      }
    });
  }

  // Transform API notification to UI notification format
  private transformNotification(apiNotification: notificationAPI.Notification): Notification {
    return {
      id: apiNotification.id,
      title: apiNotification.title,
      description: apiNotification.message,
      time: this.formatTime(apiNotification.created_at),
      isRead: apiNotification.is_read,
    };
  }

  // Format timestamp to relative time
  private formatTime(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return notificationTime.toLocaleDateString();
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
  
  // Get unread count (performance optimized with caching)
  public getUnreadCount(): number {
    // Return cached count for better performance
    console.log(`📊 Current unread count: ${this.cachedUnreadCount} out of ${this.notifications.length} total notifications`);
    return this.cachedUnreadCount;
  }

  // Get last update timestamp for active status tracking
  public getLastUpdateTimestamp(): number {
    return this.lastUpdateTimestamp;
  }

  // Check if there are active unread notifications (updated recently)
  public hasActiveUnread(): boolean {
    const isRecent = Date.now() - this.lastUpdateTimestamp < 5000; // 5 seconds
    return this.cachedUnreadCount > 0 && isRecent;
  }
  
  // Mark a notification as read (performance optimized)
  public async markAsRead(id: string) {
    return this.queueOperation(`markAsRead-${id}`, async () => {
      // Find the notification to check if it's currently unread
      const notification = this.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.isRead;
      
      try {
        await notificationAPI.markAsRead(id);
        console.log(`✅ Marked notification ${id} as read via API`);
      } catch (error) {
        console.error('Failed to mark notification as read via API:', error);
        // Continue with local update for better UX
      }
      
      // Performance optimization: Use simple count decrement instead of full recalculation
      if (wasUnread) {
        this.updateUnreadCount(-1);
      }
      
      // Update local state
      const updatedNotifications = this.notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      this.notifications = updatedNotifications;
      
      // Notify listeners
      this.notifyListeners();
      this.notifyUnreadCountListeners();
    });
  }
  
  // Mark all notifications as read (performance optimized)
  public async markAllAsRead() {
    return this.queueOperation('markAllAsRead', async () => {
      try {
        await notificationAPI.markAllAsRead();
        console.log('✅ Marked all notifications as read via API');
      } catch (error) {
        console.error('Failed to mark all notifications as read via API:', error);
        // Continue with local update for better UX
      }
      
      // Performance optimization: Set count to 0 directly instead of recalculation
      this.cachedUnreadCount = 0;
      this.lastUpdateTimestamp = Date.now();
      
      // Update local state
      const updatedNotifications = this.notifications.map(notification => ({ ...notification, isRead: true }));
      this.notifications = updatedNotifications;
      
      console.log(`🔄 All notifications marked as read: count → 0`);
      
      // Notify listeners
      this.notifyListeners();
      this.notifyUnreadCountListeners();
    });
  }
  
  // Add a new notification (performance optimized for real-time updates)
  public addNotification(notification: Omit<Notification, 'isRead'>) {
    const newNotification: Notification = {
      ...notification,
      isRead: false
    };
    
    // Performance optimization: Increment count directly
    this.updateUnreadCount(+1);
    
    // Add to the beginning of the list
    this.notifications = [newNotification, ...this.notifications];
    
    console.log(`➕ New notification added: "${newNotification.title}"`);
    
    // Notify listeners
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
  
  // Refresh notifications from API
  public async refreshNotifications() {
    console.log('🔄 Refreshing notifications from API...');
    try {
      await this.loadNotifications();
      console.log('✅ Notifications refreshed successfully:', this.notifications.length);
    } catch (error) {
      console.error('❌ Failed to refresh notifications:', error);
      // loadNotifications already handles error state synchronously
    }
  }

  // Handle real-time notification from socket (performance optimized)
  public handleNewNotification(apiNotification: notificationAPI.Notification) {
    console.log('🔔 Handling new notification from socket:', apiNotification);
    
    // Verify notification belongs to current user
    const currentUserId = useAuthStore.getState().user?.id;
    if (currentUserId && apiNotification.user_id !== currentUserId) {
      console.warn('⚠️ Notification not for current user, ignoring:', {
        notificationUserId: apiNotification.user_id,
        currentUserId,
      });
      return;
    }
    
    // Check if notification already exists to prevent duplicates
    const existingNotification = this.notifications.find(n => n.id === apiNotification.id);
    if (existingNotification) {
      console.warn('⚠️ Duplicate notification detected, ignoring:', apiNotification.id);
      return;
    }
    
    const notification = this.transformNotification(apiNotification);
    console.log('✅ Adding new notification:', notification);
    
    // Performance optimization: Only increment count if notification is unread
    if (!notification.isRead) {
      this.updateUnreadCount(+1);
    }
    
    // Add notification to the beginning of the list
    this.notifications = [notification, ...this.notifications];
    
    // Notify listeners
    this.notifyListeners();
    this.notifyUnreadCountListeners();
    
    // Show browser notification if permission is granted
    this.showBrowserNotification(notification.title, notification.description);
  }

  // Handle notification read status update from socket (performance optimized)
  public handleNotificationRead(data: { notificationId?: string; allRead?: boolean }) {
    if (data.allRead) {
      // Performance optimization: Set count to 0 directly
      this.cachedUnreadCount = 0;
      this.lastUpdateTimestamp = Date.now();
      
      // Mark all as read
      this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      console.log(`🔄 All notifications marked as read via socket: count → 0`);
      
    } else if (data.notificationId) {
      // Find the notification to check if it's currently unread
      const notification = this.notifications.find(n => n.id === data.notificationId);
      const wasUnread = notification && !notification.isRead;
      
      // Performance optimization: Only decrement if notification was unread
      if (wasUnread) {
        this.updateUnreadCount(-1);
      }
      
      // Mark specific notification as read
      this.notifications = this.notifications.map(notification => 
        notification.id === data.notificationId ? { ...notification, isRead: true } : notification
      );
      console.log(`✅ Notification ${data.notificationId} marked as read via socket`);
      
    } else {
      // No valid data, keep current state
      return;
    }
    
    // Notify listeners
    this.notifyListeners();
    this.notifyUnreadCountListeners();
  }

  // Initialize socket connection for real-time notifications
  public async initializeSocket(token: string) {
    console.log('🔌 Initializing notification service with auth token...');
    
    // Connect to socket
    socketService.connect(token);
    
    // Load initial notifications from API
    if (!this.isInitialized) {
      try {
        await this.loadNotifications();
        this.isInitialized = true;
        console.log('✅ Notifications loaded successfully:', this.notifications.length);
      } catch (error) {
        console.error('❌ Failed to load initial notifications:', error);
        // Set empty state but still mark as initialized
        this.notifications = [];
        this.isInitialized = true;
        this.notifyListeners();
        this.notifyUnreadCountListeners();
      }
    }
  }

  // Disconnect socket
  public disconnectSocket() {
    socketService.disconnect();
  }

  // Reset notification service (clear all data)
  public reset() {
    console.log('🔄 Resetting notification service...');
    this.notifications = [];
    this.cachedUnreadCount = 0;
    this.isInitialized = false;
    this.pendingOperations.clear();
    this.notifyListeners();
    this.notifyUnreadCountListeners();
    console.log('✅ Notification service reset complete');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
