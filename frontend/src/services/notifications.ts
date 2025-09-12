import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiClient } from './api';

// Configure how notifications are handled when the app is running
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationService {
  requestPermissions: () => Promise<boolean>;
  registerDeviceToken: () => Promise<string | null>;
  scheduleLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  getAllNotifications: () => Promise<any[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
  getPreferences: () => Promise<any>;
}

class NotificationServiceImpl implements NotificationService {
  
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async registerDeviceToken(): Promise<string | null> {
    try {
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        return null;
      }

      // Get the device push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      // Register token with backend
      try {
        await apiClient.post('/notifications/register-token', {
          token,
          platform: Platform.OS,
        });
        console.log('Device token registered successfully');
      } catch (error) {
        console.log('Failed to register token with backend (offline mode):', error.message);
        // In offline mode, just return the token
      }

      return token;
    } catch (error) {
      console.error('Error registering device token:', error);
      return null;
    }
  }

  async scheduleLocalNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  }

  async getAllNotifications(): Promise<any[]> {
    try {
      const response = await apiClient.get('/notifications/my');
      return response.data;
    } catch (error) {
      console.log('Failed to fetch notifications (offline mode):', error.message);
      // Return mock notifications for offline mode
      return [
        {
          id: 'offline-1',
          title: 'Welcome to Leemaz!',
          body: 'Start exploring products from Syrian women entrepreneurs',
          read: false,
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.post(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.log('Failed to mark notification as read (offline mode):', error.message);
    }
  }

  async updatePreferences(preferences: any): Promise<void> {
    try {
      await apiClient.put('/notifications/preferences', preferences);
    } catch (error) {
      console.log('Failed to update notification preferences (offline mode):', error.message);
    }
  }

  async getPreferences(): Promise<any> {
    try {
      const response = await apiClient.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.log('Failed to get notification preferences (offline mode):', error.message);
      // Return default preferences for offline mode
      return {
        order_updates: true,
        new_products: true,
        shop_updates: true,
        chat_messages: true,
      };
    }
  }
}

export const notificationService = new NotificationServiceImpl();

// Notification listeners
export const addNotificationReceivedListener = (listener: (notification: Notifications.Notification) => void) => {
  return Notifications.addNotificationReceivedListener(listener);
};

export const addNotificationResponseReceivedListener = (listener: (response: Notifications.NotificationResponse) => void) => {
  return Notifications.addNotificationResponseReceivedListener(listener);
};