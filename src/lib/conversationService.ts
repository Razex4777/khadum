import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Types for the conversation system
export interface ConversationMessage {
  id: string;
  content: string;
  sender_type: 'freelancer' | 'client';
  sender_name: string;
  sender_avatar?: string;
  message_type: 'text' | 'image' | 'file' | 'audio' | 'voice_note';
  attachments?: ConversationAttachment[];
  timestamp: string;
  edited_at?: string;
  is_edited?: boolean;
  reply_to?: string; // Message ID being replied to
  reactions?: MessageReaction[];
  read_by?: string[]; // Array of user IDs who have read this message
}

export interface ConversationAttachment {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  thumbnail_url?: string;
  duration?: number; // For audio/video files
  width?: number; // For images
  height?: number; // For images
}

export interface MessageReaction {
  emoji: string;
  user_id: string;
  user_name: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  freelancer_id: string;
  client_id: string;
  client_name: string;
  client_avatar_url?: string;
  title: string;
  status: 'active' | 'archived' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  messages: ConversationMessage[];
  project_context?: string;
  conversation_summary?: string;
  tags?: string[];
  last_message_at: string;
  last_message_by?: string;
  unread_count_freelancer: number;
  unread_count_client: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationListItem {
  id: string;
  client_name: string;
  client_avatar_url?: string;
  title: string;
  status: string;
  priority: string;
  last_message_preview: string;
  last_message_at: string;
  last_message_by?: string;
  unread_count_freelancer: number;
  tags?: string[];
}

export class ConversationService {
  private static readonly BUCKET_NAME = 'conversation-attachments';
  
  /**
   * Get all conversations for a freelancer
   */
  static async getConversations(
    freelancerId: string,
    options: {
      status?: string;
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<ConversationListItem[]> {
    try {
      let query = supabase
        .from('conversations')
        .select(`
          id,
          client_name,
          client_avatar_url,
          title,
          status,
          priority,
          last_message_at,
          last_message_by,
          unread_count_freelancer,
          tags,
          messages
        `)
        .eq('freelancer_id', freelancerId)
        .order('last_message_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,client_name.ilike.%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      // Transform data to include last message preview
      return (data || []).map(conv => {
        const messages = conv.messages as ConversationMessage[];
        const lastMessage = messages && messages.length > 0 
          ? messages[messages.length - 1] 
          : null;
        
        return {
          id: conv.id,
          client_name: conv.client_name,
          client_avatar_url: conv.client_avatar_url,
          title: conv.title,
          status: conv.status,
          priority: conv.priority,
          last_message_preview: lastMessage 
            ? lastMessage.message_type === 'text' 
              ? lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '')
              : `📎 ${lastMessage.message_type === 'image' ? 'Image' : lastMessage.message_type === 'file' ? 'File' : 'Voice note'}`
            : 'No messages yet',
          last_message_at: conv.last_message_at,
          last_message_by: conv.last_message_by,
          unread_count_freelancer: conv.unread_count_freelancer,
          tags: conv.tags
        };
      });
    } catch (error) {
      console.error('Error in getConversations:', error);
      return [];
    }
  }

  /**
   * Get a single conversation with all messages
   */
  static async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getConversation:', error);
      return null;
    }
  }

  /**
   * Create a new conversation
   */
  static async createConversation(conversationData: {
    freelancer_id: string;
    client_id: string;
    client_name: string;
    client_avatar_url?: string;
    title: string;
    project_context?: string;
    tags?: string[];
  }): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([conversationData])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createConversation:', error);
      return null;
    }
  }

  /**
   * Send a message in a conversation
   */
  static async sendMessage(
    conversationId: string,
    messageData: {
      content: string;
      sender_type: 'freelancer' | 'client';
      sender_name: string;
      sender_avatar?: string;
      message_type: 'text' | 'image' | 'file' | 'audio' | 'voice_note';
      attachments?: Omit<ConversationAttachment, 'id'>[];
      reply_to?: string;
    }
  ): Promise<ConversationMessage | null> {
    try {
      // Prepare message object
      const message: ConversationMessage = {
        id: uuidv4(),
        content: messageData.content,
        sender_type: messageData.sender_type,
        sender_name: messageData.sender_name,
        sender_avatar: messageData.sender_avatar,
        message_type: messageData.message_type,
        attachments: messageData.attachments?.map(att => ({
          ...att,
          id: uuidv4()
        })),
        timestamp: new Date().toISOString(),
        reply_to: messageData.reply_to,
        reactions: [],
        read_by: []
      };

      // Use the database function to add the message
      const { data, error } = await supabase.rpc('add_message_to_conversation', {
        conversation_id: conversationId,
        message_data: message
      });

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      return message;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }

  /**
   * Upload file to conversation attachments bucket
   */
  static async uploadAttachment(
    freelancerId: string,
    conversationId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ConversationAttachment | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${freelancerId}/${conversationId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      // Generate thumbnail for images
      let thumbnailUrl: string | undefined;
      if (file.type.startsWith('image/')) {
        thumbnailUrl = urlData.publicUrl; // For now, use the same URL
        // TODO: Implement actual thumbnail generation
      }

      const attachment: ConversationAttachment = {
        id: uuidv4(),
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        width: undefined, // TODO: Get image dimensions
        height: undefined, // TODO: Get image dimensions
        duration: undefined // TODO: Get audio/video duration
      };

      return attachment;
    } catch (error) {
      console.error('Error in uploadAttachment:', error);
      return null;
    }
  }

  /**
   * Delete an attachment
   */
  static async deleteAttachment(
    freelancerId: string,
    conversationId: string,
    fileName: string
  ): Promise<boolean> {
    try {
      const filePath = `${freelancerId}/${conversationId}/${fileName}`;
      
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting attachment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteAttachment:', error);
      return false;
    }
  }

  /**
   * Mark conversation as read
   */
  static async markAsRead(conversationId: string, readerType: 'freelancer' | 'client'): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('mark_conversation_as_read', {
        conversation_id: conversationId,
        reader_type: readerType
      });

      if (error) {
        console.error('Error marking conversation as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  /**
   * Update conversation status or metadata
   */
  static async updateConversation(
    conversationId: string,
    updates: {
      title?: string;
      status?: 'active' | 'archived' | 'closed';
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      tags?: string[];
      conversation_summary?: string;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateConversation:', error);
      return false;
    }
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  }

  /**
   * Search conversations
   */
  static async searchConversations(
    freelancerId: string,
    query: string,
    filters: {
      status?: string;
      priority?: string;
      tags?: string[];
      dateFrom?: string;
      dateTo?: string;
    } = {}
  ): Promise<ConversationListItem[]> {
    try {
      let dbQuery = supabase
        .from('conversations')
        .select(`
          id,
          client_name,
          client_avatar_url,
          title,
          status,
          priority,
          last_message_at,
          last_message_by,
          unread_count_freelancer,
          tags,
          messages
        `)
        .eq('freelancer_id', freelancerId);

      // Add search conditions
      if (query) {
        dbQuery = dbQuery.or(`
          title.ilike.%${query}%,
          client_name.ilike.%${query}%,
          conversation_summary.ilike.%${query}%
        `);
      }

      // Add filters
      if (filters.status) {
        dbQuery = dbQuery.eq('status', filters.status);
      }

      if (filters.priority) {
        dbQuery = dbQuery.eq('priority', filters.priority);
      }

      if (filters.tags && filters.tags.length > 0) {
        dbQuery = dbQuery.overlaps('tags', filters.tags);
      }

      if (filters.dateFrom) {
        dbQuery = dbQuery.gte('last_message_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        dbQuery = dbQuery.lte('last_message_at', filters.dateTo);
      }

      dbQuery = dbQuery.order('last_message_at', { ascending: false });

      const { data, error } = await dbQuery;

      if (error) {
        console.error('Error searching conversations:', error);
        return [];
      }

      // Transform data
      return (data || []).map(conv => {
        const messages = conv.messages as ConversationMessage[];
        const lastMessage = messages && messages.length > 0 
          ? messages[messages.length - 1] 
          : null;
        
        return {
          id: conv.id,
          client_name: conv.client_name,
          client_avatar_url: conv.client_avatar_url,
          title: conv.title,
          status: conv.status,
          priority: conv.priority,
          last_message_preview: lastMessage 
            ? lastMessage.message_type === 'text' 
              ? lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '')
              : `📎 ${lastMessage.message_type === 'image' ? 'Image' : lastMessage.message_type === 'file' ? 'File' : 'Voice note'}`
            : 'No messages yet',
          last_message_at: conv.last_message_at,
          last_message_by: conv.last_message_by,
          unread_count_freelancer: conv.unread_count_freelancer,
          tags: conv.tags
        };
      });
    } catch (error) {
      console.error('Error in searchConversations:', error);
      return [];
    }
  }

  /**
   * Get conversation statistics
   */
  static async getConversationStats(freelancerId: string): Promise<{
    total: number;
    active: number;
    archived: number;
    unread: number;
    high_priority: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('status, priority, unread_count_freelancer')
        .eq('freelancer_id', freelancerId);

      if (error) {
        console.error('Error fetching conversation stats:', error);
        return {
          total: 0,
          active: 0,
          archived: 0,
          unread: 0,
          high_priority: 0
        };
      }

      const stats = {
        total: data.length,
        active: data.filter(c => c.status === 'active').length,
        archived: data.filter(c => c.status === 'archived').length,
        unread: data.filter(c => c.unread_count_freelancer > 0).length,
        high_priority: data.filter(c => c.priority === 'high' || c.priority === 'urgent').length
      };

      return stats;
    } catch (error) {
      console.error('Error in getConversationStats:', error);
      return {
        total: 0,
        active: 0,
        archived: 0,
        unread: 0,
        high_priority: 0
      };
    }
  }

  /**
   * Subscribe to real-time conversation updates
   */
  static subscribeToConversations(
    freelancerId: string,
    onUpdate: (payload: any) => void
  ) {
    return supabase
      .channel('conversation-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `freelancer_id=eq.${freelancerId}`
        },
        onUpdate
      )
      .subscribe();
  }

  /**
   * Record audio/voice note
   */
  static async recordVoiceNote(
    freelancerId: string,
    conversationId: string,
    audioBlob: Blob,
    duration: number
  ): Promise<ConversationAttachment | null> {
    try {
      // Convert blob to file
      const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
        type: 'audio/webm'
      });

      const attachment = await this.uploadAttachment(freelancerId, conversationId, file);
      
      if (attachment) {
        attachment.duration = duration;
        attachment.file_type = 'audio/webm';
      }

      return attachment;
    } catch (error) {
      console.error('Error recording voice note:', error);
      return null;
    }
  }
}

export default ConversationService;