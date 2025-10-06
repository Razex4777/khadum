import { supabase } from './supabase';

// Types for the notification system
export interface ClientFreelancerNotification {
  id: string;
  freelancer_id: string;
  client_whatsapp_phone: string;
  client_name: string;
  client_email?: string;
  
  // Project Information
  project_description: string;
  project_requirements?: string;
  estimated_budget?: number;
  timeline_expectation?: string;
  
  // Selection Context
  why_chosen?: string;
  conversation_summary?: string;
  ai_recommendation_reason?: string;
  
  // Metadata
  selection_date: string;
  payment_amount?: number;
  payment_status: string;
  myfatoorah_invoice_id?: string;
  
  // Notification State
  is_read: boolean;
  is_archived: boolean;
  freelancer_response?: string;
  response_date?: string;
  
  created_at: string;
  updated_at: string;
}

export interface NotificationListItem {
  id: string;
  client_name: string;
  project_description: string;
  selection_date: string;
  payment_amount?: number;
  payment_status: string;
  is_read: boolean;
  is_archived: boolean;
  priority: 'normal' | 'high' | 'urgent';
  estimated_budget?: number;
  why_chosen?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  this_week: number;
  pending_payment: number;
  completed_payment: number;
}

export class NotificationService {
  /**
   * Get all notifications for a freelancer
   */
  static async getNotifications(
    freelancerId: string,
    options: {
      status?: 'all' | 'unread' | 'read' | 'archived';
      payment_status?: string;
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<NotificationListItem[]> {
    try {
      let query = supabase
        .from('client_freelancer_notifications')
        .select(`
          id,
          client_name,
          project_description,
          selection_date,
          payment_amount,
          payment_status,
          is_read,
          is_archived,
          estimated_budget,
          why_chosen
        `)
        .eq('freelancer_id', freelancerId)
        .order('selection_date', { ascending: false });

      // Apply filters
      if (options.status && options.status !== 'all') {
        switch (options.status) {
          case 'unread':
            query = query.eq('is_read', false).eq('is_archived', false);
            break;
          case 'read':
            query = query.eq('is_read', true).eq('is_archived', false);
            break;
          case 'archived':
            query = query.eq('is_archived', true);
            break;
        }
      }

      if (options.payment_status) {
        query = query.eq('payment_status', options.payment_status);
      }

      if (options.search) {
        query = query.or(`client_name.ilike.%${options.search}%,project_description.ilike.%${options.search}%`);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []).map(notification => ({
        ...notification,
        priority: this.calculatePriority(notification)
      }));
    } catch (error) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  }

  /**
   * Get a single notification by ID
   */
  static async getNotification(notificationId: string): Promise<ClientFreelancerNotification | null> {
    try {
      const { data, error } = await supabase
        .from('client_freelancer_notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (error) {
        console.error('Error fetching notification:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getNotification:', error);
      return null;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  /**
   * Mark multiple notifications as read
   */
  static async markMultipleAsRead(notificationIds: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .in('id', notificationIds);

      if (error) {
        console.error('Error marking notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markMultipleAsRead:', error);
      return false;
    }
  }

  /**
   * Archive notification
   */
  static async archiveNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .update({ 
          is_archived: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error archiving notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in archiveNotification:', error);
      return false;
    }
  }

  /**
   * Unarchive notification
   */
  static async unarchiveNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .update({ 
          is_archived: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error unarchiving notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in unarchiveNotification:', error);
      return false;
    }
  }

  /**
   * Add freelancer response to notification
   */
  static async respondToNotification(
    notificationId: string, 
    response: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .update({ 
          freelancer_response: response,
          response_date: new Date().toISOString(),
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error responding to notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in respondToNotification:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(freelancerId: string): Promise<NotificationStats> {
    try {
      const { data, error } = await supabase
        .from('client_freelancer_notifications')
        .select('selection_date, is_read, payment_status')
        .eq('freelancer_id', freelancerId)
        .eq('is_archived', false);

      if (error) {
        console.error('Error fetching notification stats:', error);
        return {
          total: 0,
          unread: 0,
          today: 0,
          this_week: 0,
          pending_payment: 0,
          completed_payment: 0
        };
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = data.reduce((acc, notification) => {
        const notificationDate = new Date(notification.selection_date);
        
        acc.total++;
        
        if (!notification.is_read) {
          acc.unread++;
        }
        
        if (notificationDate >= today) {
          acc.today++;
        }
        
        if (notificationDate >= thisWeek) {
          acc.this_week++;
        }
        
        if (notification.payment_status === 'pending') {
          acc.pending_payment++;
        } else if (notification.payment_status === 'completed') {
          acc.completed_payment++;
        }
        
        return acc;
      }, {
        total: 0,
        unread: 0,
        today: 0,
        this_week: 0,
        pending_payment: 0,
        completed_payment: 0
      });

      return stats;
    } catch (error) {
      console.error('Error in getNotificationStats:', error);
      return {
        total: 0,
        unread: 0,
        today: 0,
        this_week: 0,
        pending_payment: 0,
        completed_payment: 0
      };
    }
  }

  /**
   * Search notifications
   */
  static async searchNotifications(
    freelancerId: string,
    query: string,
    filters: {
      payment_status?: string;
      date_from?: string;
      date_to?: string;
      is_read?: boolean;
    } = {}
  ): Promise<NotificationListItem[]> {
    try {
      let dbQuery = supabase
        .from('client_freelancer_notifications')
        .select(`
          id,
          client_name,
          project_description,
          selection_date,
          payment_amount,
          payment_status,
          is_read,
          is_archived,
          estimated_budget,
          why_chosen
        `)
        .eq('freelancer_id', freelancerId);

      // Add search conditions
      if (query) {
        dbQuery = dbQuery.or(`
          client_name.ilike.%${query}%,
          project_description.ilike.%${query}%,
          project_requirements.ilike.%${query}%,
          why_chosen.ilike.%${query}%
        `);
      }

      // Add filters
      if (filters.payment_status) {
        dbQuery = dbQuery.eq('payment_status', filters.payment_status);
      }

      if (filters.is_read !== undefined) {
        dbQuery = dbQuery.eq('is_read', filters.is_read);
      }

      if (filters.date_from) {
        dbQuery = dbQuery.gte('selection_date', filters.date_from);
      }

      if (filters.date_to) {
        dbQuery = dbQuery.lte('selection_date', filters.date_to);
      }

      dbQuery = dbQuery.order('selection_date', { ascending: false });

      const { data, error } = await dbQuery;

      if (error) {
        console.error('Error searching notifications:', error);
        return [];
      }

      return (data || []).map(notification => ({
        ...notification,
        priority: this.calculatePriority(notification)
      }));
    } catch (error) {
      console.error('Error in searchNotifications:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time notification updates
   */
  static subscribeToNotifications(
    freelancerId: string,
    onUpdate: (payload: any) => void
  ) {
    return supabase
      .channel('freelancer-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_freelancer_notifications',
          filter: `freelancer_id=eq.${freelancerId}`
        },
        onUpdate
      )
      .subscribe();
  }

  /**
   * Calculate notification priority based on various factors
   */
  private static calculatePriority(notification: any): 'normal' | 'high' | 'urgent' {
    const selectionDate = new Date(notification.selection_date);
    const now = new Date();
    const hoursAgo = (now.getTime() - selectionDate.getTime()) / (1000 * 60 * 60);
    
    // High priority if notification is recent (less than 2 hours)
    if (hoursAgo < 2) {
      return 'urgent';
    }
    
    // High priority if payment is pending and notification is less than 24 hours old
    if (notification.payment_status === 'pending' && hoursAgo < 24) {
      return 'high';
    }
    
    // High priority if budget is significant (over 1000 SAR)
    if (notification.estimated_budget && notification.estimated_budget > 1000) {
      return 'high';
    }
    
    return 'normal';
  }

  /**
   * Get recent notifications for dashboard widgets
   */
  static async getRecentNotifications(
    freelancerId: string,
    limit: number = 5
  ): Promise<NotificationListItem[]> {
    try {
      const { data, error } = await supabase
        .from('client_freelancer_notifications')
        .select(`
          id,
          client_name,
          project_description,
          selection_date,
          payment_amount,
          payment_status,
          is_read,
          is_archived,
          estimated_budget,
          why_chosen
        `)
        .eq('freelancer_id', freelancerId)
        .eq('is_archived', false)
        .order('selection_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent notifications:', error);
        return [];
      }

      return (data || []).map(notification => ({
        ...notification,
        priority: this.calculatePriority(notification)
      }));
    } catch (error) {
      console.error('Error in getRecentNotifications:', error);
      return [];
    }
  }

  /**
   * Update notification payment status
   */
  static async updatePaymentStatus(
    notificationId: string,
    paymentStatus: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('client_freelancer_notifications')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error updating payment status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      return false;
    }
  }
}

export default NotificationService;