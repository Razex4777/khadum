import { useState, useEffect, useCallback } from 'react';
import { ConversationService, ConversationListItem, Conversation } from '@/lib/conversationService';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface UseConversationsReturn {
  conversations: ConversationListItem[];
  stats: {
    total: number;
    active: number;
    archived: number;
    unread: number;
    high_priority: number;
  };
  loading: boolean;
  error: string | null;
  refreshConversations: () => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

export const useConversations = (
  freelancerId: string | null,
  filters: {
    search?: string;
    status?: string;
    priority?: string;
  } = {}
): UseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    unread: 0,
    high_priority: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!freelancerId) return;

    try {
      setLoading(true);
      setError(null);

      const conversationsData = await ConversationService.getConversations(
        freelancerId,
        {
          status: filters.status !== 'all' ? filters.status : undefined,
          search: filters.search || undefined,
          limit: 50
        }
      );

      setConversations(conversationsData);

      // Load statistics
      const statsData = await ConversationService.getConversationStats(freelancerId);
      setStats(statsData);

    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('فشل في تحميل المحادثات');
      toast({
        title: "خطأ في تحميل المحادثات",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [freelancerId, filters.status, filters.search]);

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      const success = await ConversationService.markAsRead(conversationId, 'freelancer');
      
      if (success) {
        // Update local state to reflect the read status
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, unread_count_freelancer: 0 }
              : conv
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة القراءة",
        variant: "destructive"
      });
    }
  }, []);

  const archiveConversation = useCallback(async (conversationId: string) => {
    try {
      const success = await ConversationService.updateConversation(conversationId, {
        status: 'archived'
      });
      
      if (success) {
        // Remove from current list or update status based on current filter
        if (filters.status === 'active' || filters.status === undefined) {
          setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        } else {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === conversationId 
                ? { ...conv, status: 'archived' }
                : conv
            )
          );
        }
        
        // Update stats
        setStats(prev => ({
          ...prev,
          active: Math.max(0, prev.active - 1),
          archived: prev.archived + 1
        }));
        
        toast({
          title: "تم أرشفة المحادثة",
          description: "تم أرشفة المحادثة بنجاح"
        });
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast({
        title: "خطأ",
        description: "فشل في أرشفة المحادثة",
        variant: "destructive"
      });
    }
  }, [filters.status]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const success = await ConversationService.deleteConversation(conversationId);
      
      if (success) {
        // Remove from list
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1)
        }));
        
        toast({
          title: "تم حذف المحادثة",
          description: "تم حذف المحادثة بنجاح"
        });
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المحادثة",
        variant: "destructive"
      });
    }
  }, []);

  // Load conversations when dependencies change
  useEffect(() => {
    if (freelancerId) {
      loadConversations();
    }
  }, [freelancerId, loadConversations]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!freelancerId) return;

    const subscription = ConversationService.subscribeToConversations(
      freelancerId,
      (payload) => {
        console.log('Real-time conversation update:', payload);
        
        // Refresh conversations when there's an update
        loadConversations();
        
        // Show toast for new messages
        if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedConversation = payload.new;
          const currentConv = conversations.find(c => c.id === updatedConversation.id);
          
          // Check if there's a new message (unread count increased)
          if (currentConv && updatedConversation.unread_count_freelancer > currentConv.unread_count_freelancer) {
            toast({
              title: "رسالة جديدة",
              description: `رسالة جديدة من ${updatedConversation.client_name}`,
              duration: 3000
            });
            
            // Play notification sound if available
            try {
              const audio = new Audio('/notification-sound.mp3');
              audio.volume = 0.3;
              audio.play().catch(() => {
                // Ignore audio play errors (user interaction required)
              });
            } catch (error) {
              // Ignore audio errors
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [freelancerId, loadConversations, conversations]);

  return {
    conversations,
    stats,
    loading,
    error,
    refreshConversations: loadConversations,
    markAsRead,
    archiveConversation,
    deleteConversation
  };
};