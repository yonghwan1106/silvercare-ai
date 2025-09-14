import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, NotificationStore } from '@/types';
import { generateId } from '@/lib/utils';

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        // Auto-dismiss info notifications after 5 seconds
        if (notification.type === 'info' && typeof window !== 'undefined') {
          setTimeout(() => {
            const { dismissNotification } = get();
            dismissNotification(newNotification.id);
          }, 5000);
        }
      },

      markAsRead: (id: string) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) {
            return state;
          }

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        });
      },

      dismissNotification: (id: string) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: wasUnread
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },
    }),
    {
      name: 'silvercare-notification-store',
      partialize: (state) => ({
        notifications: state.notifications
          .filter((n) => n.type !== 'info') // Don't persist info notifications
          .slice(0, 20), // Keep only last 20 notifications
        // Don't persist unread count - recalculate on hydration
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.notifications) {
          // Convert timestamp strings back to Date objects and recalculate unread count
          state.notifications = state.notifications.map(notification => ({
            ...notification,
            timestamp: new Date(notification.timestamp),
          }));

          // Recalculate unread count
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      },
    }
  )
);

// Helper function to create common notification types
export const createNotification = {
  info: (title: string, message: string) => ({
    type: 'info' as const,
    title,
    message,
    actionRequired: false,
  }),

  warning: (title: string, message: string, actionRequired = false) => ({
    type: 'warning' as const,
    title,
    message,
    actionRequired,
  }),

  emergency: (title: string, message: string, metadata?: any) => ({
    type: 'emergency' as const,
    title,
    message,
    actionRequired: true,
    metadata,
  }),

  reminder: (title: string, message: string) => ({
    type: 'reminder' as const,
    title,
    message,
    actionRequired: false,
  }),
};