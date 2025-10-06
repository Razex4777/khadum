import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationService, NotificationStats } from '@/lib/notificationService';
import { toast } from '@/components/ui/use-toast';

interface NotificationContextType {
  stats: NotificationStats;
  unreadCount: number;
  loading: boolean;
  refreshStats: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  freelancerId: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  freelancerId
}) => {
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    today: 0,
    this_week: 0,
    pending_payment: 0,
    completed_payment: 0
  });
  const [loading, setLoading] = useState(true);

  // Load notification stats
  const refreshStats = async () => {
    try {
      setLoading(true);
      const newStats = await NotificationService.getNotificationStats(freelancerId);
      setStats(newStats);
    } catch (error) {
      console.error('Error loading notification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const success = await NotificationService.markAsRead(notificationId);
      if (success) {
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      }
      return success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Get all unread notification IDs
      const notifications = await NotificationService.getNotifications(freelancerId, {
        status: 'unread'
      });
      
      const unreadIds = notifications.map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const success = await NotificationService.markMultipleAsRead(unreadIds);
      if (success) {
        setStats(prev => ({
          ...prev,
          unread: 0
        }));
        
        toast({
          title: "تم تحديد جميع الإشعارات كمقروءة",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "خطأ في تحديث الإشعارات",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!freelancerId) return;

    // Initial load
    refreshStats();

    // Set up real-time subscription
    const subscription = NotificationService.subscribeToNotifications(
      freelancerId,
      (payload) => {
        console.log('Real-time notification update in context:', payload);
        
        if (payload.eventType === 'INSERT') {
          // New notification received
          setStats(prev => ({
            ...prev,
            total: prev.total + 1,
            unread: prev.unread + 1,
            today: prev.today + 1,
            this_week: prev.this_week + 1,
            pending_payment: payload.new.payment_status === 'pending' 
              ? prev.pending_payment + 1 
              : prev.pending_payment,
            completed_payment: payload.new.payment_status === 'completed' 
              ? prev.completed_payment + 1 
              : prev.completed_payment
          }));
          
          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('إشعار جديد من خدوم', {
              body: `طلب جديد من ${payload.new.client_name}`,
              icon: '/favicon.ico',
              tag: 'khadum-notification'
            });
          }
          
          // Show toast notification
          toast({
            title: "إشعار جديد",
            description: `طلب جديد من ${payload.new.client_name}`,
            variant: "default"
          });
          
        } else if (payload.eventType === 'UPDATE') {
          // Notification updated (e.g., marked as read)
          const wasUnread = payload.old.is_read === false;
          const isNowRead = payload.new.is_read === true;
          
          if (wasUnread && isNowRead) {
            setStats(prev => ({
              ...prev,
              unread: Math.max(0, prev.unread - 1)
            }));
          }
          
          // Update payment status counts if changed
          if (payload.old.payment_status !== payload.new.payment_status) {
            setStats(prev => {
              let newStats = { ...prev };
              
              // Remove from old status count
              if (payload.old.payment_status === 'pending') {
                newStats.pending_payment = Math.max(0, newStats.pending_payment - 1);
              } else if (payload.old.payment_status === 'completed') {
                newStats.completed_payment = Math.max(0, newStats.completed_payment - 1);
              }
              
              // Add to new status count
              if (payload.new.payment_status === 'pending') {
                newStats.pending_payment = newStats.pending_payment + 1;
              } else if (payload.new.payment_status === 'completed') {
                newStats.completed_payment = newStats.completed_payment + 1;
              }
              
              return newStats;
            });
          }
          
        } else if (payload.eventType === 'DELETE') {
          // Notification deleted/archived
          setStats(prev => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
            unread: payload.old.is_read ? prev.unread : Math.max(0, prev.unread - 1),
            pending_payment: payload.old.payment_status === 'pending' 
              ? Math.max(0, prev.pending_payment - 1) 
              : prev.pending_payment,
            completed_payment: payload.old.payment_status === 'completed' 
              ? Math.max(0, prev.completed_payment - 1) 
              : prev.completed_payment
          }));
        }
      }
    );

    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [freelancerId]);

  const value: NotificationContextType = {
    stats,
    unreadCount: stats.unread,
    loading,
    refreshStats,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;