import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

class SupabaseService {
  constructor() {
    // Use anon key for database operations
    this.supabase = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        persistSession: false
      }
    });
    this.tableName = 'chat_history'; // Using existing Khadum table
    this.freelancersTable = 'freelancers'; // Basic freelancer info
    this.profilesTable = 'profiles'; // Extended profile info
    this.projectsTable = 'projects'; // Portfolio projects
  }

  /**
   * Save a message to the conversation history
   * @param {string} userId - WhatsApp user ID
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {string} username - User's WhatsApp name
   */
  async saveMessage(userId, role, content, username = 'User') {
    try {
      // Get existing conversation or create new
      let { data: existingChat, error: fetchError } = await this.supabase
        .from(this.tableName)
        .select('conversation')
        .eq('whatsapp_phone', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
        logger.error('Error fetching existing chat:', fetchError);
      }

      // Get current conversation or start empty
      let conversation = existingChat?.conversation || [];
      
      // Add new message
      const newMessage = {
        role: role,
        content: content,
        timestamp: new Date().toISOString()
      };
      conversation.push(newMessage);

      // Keep only last 20 messages
      if (conversation.length > 20) {
        conversation = conversation.slice(-20);
      }

      // Upsert the conversation
      const { data, error } = await this.supabase
        .from(this.tableName)
        .upsert({
          user_id: userId,
          whatsapp_username: username,
          whatsapp_phone: userId,
          conversation: conversation
        }, {
          onConflict: 'whatsapp_phone'
        });

      if (error) {
        logger.error('Error saving message to Supabase:', error);
        throw error;
      }

      logger.debug('Message saved to Supabase', { userId, role });
      return data;
    } catch (error) {
      logger.error('Failed to save message:', error);
      throw error;
    }
  }

  /**
   * Get conversation history for a user (last 20 messages)
   * @param {string} userId - WhatsApp user ID
   * @returns {Array} Conversation history
   */
  async getConversationHistory(userId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('conversation')
        .eq('whatsapp_phone', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        logger.error('Error fetching conversation history:', error);
        throw error;
      }

      const history = data?.conversation || [];
      logger.debug(`Fetched ${history.length} messages for user ${userId}`);
      
      return history;
    } catch (error) {
      logger.error('Failed to fetch conversation history:', error);
      return [];
    }
  }

  /**
   * Clear conversation history for a user
   * @param {string} userId - WhatsApp user ID
   */
  async clearConversationHistory(userId) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .update({ conversation: [] })
        .eq('whatsapp_phone', userId);

      if (error) {
        logger.error('Error clearing conversation history:', error);
        throw error;
      }

      logger.info(`Cleared conversation history for user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Failed to clear conversation history:', error);
      return false;
    }
  }

  /**
   * Get message count for a user
   * @param {string} userId - WhatsApp user ID
   */
  async getMessageCount(userId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('conversation')
        .eq('whatsapp_phone', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error getting message count:', error);
        throw error;
      }

      const conversation = data?.conversation || [];
      return conversation.length;
    } catch (error) {
      logger.error('Failed to get message count:', error);
      return 0;
    }
  }

  /**
   * Search freelancers by service category with enhanced profile data
   * @param {string} serviceQuery - Service or category to search for
   * @param {number} limit - Maximum number of results
   * @returns {Array} Matching freelancers with profile and project data
   */
  async searchFreelancersByService(serviceQuery, limit = 5) {
    try {
      logger.debug('🔍 Searching freelancers for service:', serviceQuery);

      // Log the search query and Supabase connection
      logger.debugSupabase('Search query details', {
        serviceQuery,
        limit,
        supabaseUrl: config.supabase.url,
        freelancersTable: this.freelancersTable,
        profilesTable: this.profilesTable
      });

      // Search in freelancers.field, profiles.skills, and projects.tags
      const { data, error } = await this.supabase
        .from(this.freelancersTable)
        .select(`
          id,
          full_name,
          field,
          email,
          whatsapp_number,
          average_rating,
          total_projects,
          completed_projects,
          is_verified,
          created_at,
          profiles!inner (
            display_name,
            bio,
            title,
            location,
            hourly_rate,
            minimum_project_budget,
            availability_status,
            experience_level,
            skills,
            languages,
            response_time,
            revision_rounds,
            profile_completion_percentage,
            profile_views,
            is_featured,
            is_top_rated
          ),
          projects (
            id,
            title,
            description,
            tags,
            view_count,
            likes_count,
            created_at
          )
        `)
        .eq('is_verified', true)
        .or(`field.ilike.%${serviceQuery}%,profiles.skills.cs.["${serviceQuery}"]`)
        .order('average_rating', { ascending: false })
        .order('completed_projects', { ascending: false })
        .limit(limit);

      // Enhanced debugging
      if (error) {
        logger.error('❌ Supabase query error:', error);
        logger.debugSupabase('Query error details', {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      logger.debugSupabase('Supabase query successful', {
        query: 'searchFreelancersByService',
        serviceQuery,
        resultsCount: data?.length || 0,
        hasData: !!data
      });

      // Debug the raw results
      if (data) {
        logger.debugFreelancers('Raw freelancer search results', data);
      } else {
        logger.debugSupabase('No data returned from query', { serviceQuery });
      }

      // Also search by project tags
      const { data: projectMatches, error: projectError } = await this.supabase
        .from(this.projectsTable)
        .select(`
          freelancer_user_id,
          freelancers!inner (
            id,
            full_name,
            field,
            email,
            whatsapp_number,
            average_rating,
            total_projects,
            completed_projects,
            is_verified,
            created_at,
            profiles!inner (
              display_name,
              bio,
              title,
              location,
              hourly_rate,
              minimum_project_budget,
              availability_status,
              experience_level,
              skills,
              languages,
              response_time,
              revision_rounds,
              profile_completion_percentage,
              profile_views,
              is_featured,
              is_top_rated
            )
          )
        `)
        .contains('tags', [serviceQuery])
        .limit(limit);

      if (projectError) {
        logger.warn('⚠️ Error searching project tags:', projectError);
        logger.debugSupabase('Project search error details', {
          error: projectError.message,
          serviceQuery
        });
      } else if (projectMatches) {
        logger.debugSupabase('Project search results', {
          projectMatchesCount: projectMatches.length,
          serviceQuery
        });
      }

      // Combine results and remove duplicates
      let allMatches = [...(data || [])];
      
      if (projectMatches) {
        const projectFreelancers = projectMatches.map(pm => ({
          ...pm.freelancers,
          matchedByProject: true
        }));
        
        // Add project matches that aren't already included
        projectFreelancers.forEach(pf => {
          if (!allMatches.find(am => am.id === pf.id)) {
            allMatches.push(pf);
          }
        });
      }

      // Sort by relevance and rating
      allMatches = allMatches
        .sort((a, b) => {
          // Prioritize featured and top-rated freelancers
          if (a.profiles?.is_featured && !b.profiles?.is_featured) return -1;
          if (b.profiles?.is_featured && !a.profiles?.is_featured) return 1;
          if (a.profiles?.is_top_rated && !b.profiles?.is_top_rated) return -1;
          if (b.profiles?.is_top_rated && !a.profiles?.is_top_rated) return 1;
          
          // Then by rating
          if (b.average_rating !== a.average_rating) {
            return b.average_rating - a.average_rating;
          }
          
          // Then by completed projects
          return b.completed_projects - a.completed_projects;
        })
        .slice(0, limit);

      logger.debugSupabase('Final combined results', {
        totalMatches: allMatches.length,
        directMatches: data?.length || 0,
        projectMatches: projectMatches?.length || 0,
        serviceQuery,
        limit
      });

      logger.debugFreelancers('Final sorted freelancer results', allMatches);
      return allMatches;
    } catch (error) {
      logger.error('Failed to search freelancers:', error);
      return [];
    }
  }

  /**
   * Get all freelancers by main category with enhanced data
   * @param {string} mainCategory - Main service category
   * @param {number} limit - Maximum number of results
   * @returns {Array} Matching freelancers with profile data
   */
  async getFreelancersByCategory(mainCategory, limit = 10) {
    try {
      logger.debug('Getting freelancers for category:', mainCategory);

      const { data, error } = await this.supabase
        .from(this.freelancersTable)
        .select(`
          id,
          full_name,
          field,
          email,
          whatsapp_number,
          average_rating,
          total_projects,
          completed_projects,
          is_verified,
          created_at,
          profiles!inner (
            display_name,
            bio,
            title,
            location,
            hourly_rate,
            minimum_project_budget,
            availability_status,
            experience_level,
            skills,
            languages,
            response_time,
            revision_rounds,
            profile_completion_percentage,
            profile_views,
            is_featured,
            is_top_rated
          )
        `)
        .eq('is_verified', true)
        .eq('profiles.availability_status', 'available')
        .ilike('field', `${mainCategory}%`) // Starts with main category
        .order('average_rating', { ascending: false })
        .order('completed_projects', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error getting freelancers by category:', error);
        throw error;
      }

      logger.debug(`Found ${data?.length || 0} freelancers in category: ${mainCategory}`);
      return data || [];
    } catch (error) {
      logger.error('Failed to get freelancers by category:', error);
      return [];
    }
  }

  /**
   * Get comprehensive platform statistics for AI context
   * @returns {Object} Platform statistics
   */
  async getPlatformStats() {
    try {
      // Get freelancer stats
      const { data: freelancerData, error: freelancerError } = await this.supabase
        .from(this.freelancersTable)
        .select(`
          is_verified,
          field,
          average_rating,
          total_projects,
          completed_projects
        `);

      // Get profile stats
      const { data: profileData, error: profileError } = await this.supabase
        .from(this.profilesTable)
        .select(`
          availability_status,
          experience_level,
          skills,
          is_featured,
          is_top_rated,
          hourly_rate
        `);

      // Get project stats
      const { data: projectData, error: projectError } = await this.supabase
        .from(this.projectsTable)
        .select(`
          tags,
          view_count,
          likes_count
        `);

      if (freelancerError) {
        logger.error('Error getting freelancer stats:', freelancerError);
      }
      if (profileError) {
        logger.error('Error getting profile stats:', profileError);
      }
      if (projectError) {
        logger.error('Error getting project stats:', projectError);
      }

      const freelancers = freelancerData || [];
      const profiles = profileData || [];
      const projects = projectData || [];

      const stats = {
        totalFreelancers: freelancers.length,
        verifiedFreelancers: freelancers.filter(f => f.is_verified).length,
        availableFreelancers: profiles.filter(p => p.availability_status === 'available').length,
        featuredFreelancers: profiles.filter(p => p.is_featured).length,
        topRatedFreelancers: profiles.filter(p => p.is_top_rated).length,
        totalProjects: projects.length,
        totalProjectViews: projects.reduce((sum, p) => sum + (p.view_count || 0), 0),
        categories: {},
        experienceLevels: {},
        skillsCount: {},
        avgHourlyRate: 0
      };

      // Count by main categories
      freelancers.forEach(freelancer => {
        const mainCategory = freelancer.field.split(' - ')[0];
        stats.categories[mainCategory] = (stats.categories[mainCategory] || 0) + 1;
      });

      // Count by experience levels
      profiles.forEach(profile => {
        if (profile.experience_level) {
          stats.experienceLevels[profile.experience_level] = (stats.experienceLevels[profile.experience_level] || 0) + 1;
        }
      });

      // Count popular skills from profiles and projects
      profiles.forEach(profile => {
        if (profile.skills && Array.isArray(profile.skills)) {
          profile.skills.forEach(skill => {
            stats.skillsCount[skill] = (stats.skillsCount[skill] || 0) + 1;
          });
        }
      });

      projects.forEach(project => {
        if (project.tags && Array.isArray(project.tags)) {
          project.tags.forEach(tag => {
            stats.skillsCount[tag] = (stats.skillsCount[tag] || 0) + 1;
          });
        }
      });

      // Calculate average hourly rate
      const validRates = profiles.filter(p => p.hourly_rate && p.hourly_rate > 0);
      if (validRates.length > 0) {
        stats.avgHourlyRate = validRates.reduce((sum, p) => sum + parseFloat(p.hourly_rate), 0) / validRates.length;
      }

      logger.debug('Enhanced platform stats retrieved:', stats);
      return stats;
    } catch (error) {
      logger.error('Failed to get platform stats:', error);
      return {
        totalFreelancers: 0,
        verifiedFreelancers: 0,
        availableFreelancers: 0,
        categories: {},
        experienceLevels: {},
        skillsCount: {}
      };
    }
  }

  /**
   * Get detailed freelancer profile for AI recommendations
   * @param {string} freelancerId - Freelancer ID
   * @returns {Object} Complete freelancer profile
   */
  async getFreelancerDetails(freelancerId) {
    try {
      const { data, error } = await this.supabase
        .from(this.freelancersTable)
        .select(`
          *,
          profiles (*),
          projects (*)
        `)
        .eq('id', freelancerId)
        .single();

      if (error) {
        logger.error('Error getting freelancer details:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to get freelancer details:', error);
      return null;
    }
  }

  /**
   * Get ALL available data from all tables for Gemini AI context
   * This replaces search functionality - provides complete dataset to AI
   * @returns {Object} All available data from freelancers, profiles, projects tables
   */
  async getAllDataForAIContext() {
    try {
      logger.debug('🔄 Fetching ALL data for AI context...');

      // Get all freelancers
      const { data: freelancersData, error: freelancersError } = await this.supabase
        .from(this.freelancersTable)
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false });

      // Get all profiles
      const { data: profilesData, error: profilesError } = await this.supabase
        .from(this.profilesTable)
        .select('*')
        .order('profile_completion_percentage', { ascending: false });

      // Get all projects
      const { data: projectsData, error: projectsError } = await this.supabase
        .from(this.projectsTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (freelancersError) {
        logger.error('❌ Error fetching freelancers data:', freelancersError);
      }
      if (profilesError) {
        logger.error('❌ Error fetching profiles data:', profilesError);
      }
      if (projectsError) {
        logger.error('❌ Error fetching projects data:', projectsError);
      }

      // Combine the data by linking freelancers with their profiles and projects
      const combinedFreelancers = (freelancersData || []).map(freelancer => {
        // Find matching profile
        const profile = (profilesData || []).find(p => p.freelancer_user_id === freelancer.id);
        
        // Find matching projects
        const projects = (projectsData || []).filter(p => p.freelancer_user_id === freelancer.id);
        
        return {
          ...freelancer,
          profile: profile || null,
          projects: projects || []
        };
      });

      const allData = {
        freelancers: combinedFreelancers,
        profiles: profilesData || [],
        projects: projectsData || [],
        metadata: {
          totalFreelancers: combinedFreelancers.length,
          totalProfiles: (profilesData || []).length,
          totalProjects: (projectsData || []).length,
          fetchedAt: new Date().toISOString()
        }
      };

      logger.debugSupabase('✅ All data fetched for AI context', {
        freelancersCount: allData.freelancers.length,
        profilesCount: allData.profiles.length,
        projectsCount: allData.projects.length,
        combinedFreelancersWithProfiles: allData.freelancers.filter(f => f.profile).length,
        combinedFreelancersWithProjects: allData.freelancers.filter(f => f.projects.length > 0).length,
        totalRecords: allData.freelancers.length + allData.profiles.length + allData.projects.length
      });

      return allData;
    } catch (error) {
      logger.error('❌ Failed to fetch all data for AI context:', error);
      return {
        freelancers: [],
        profiles: [],
        projects: [],
        metadata: {
          totalFreelancers: 0,
          totalProfiles: 0,
          totalProjects: 0,
          fetchedAt: new Date().toISOString(),
          error: error.message
        }
      };
    }
  }

  /**
   * Set user payment state
   * @param {string} userId - WhatsApp user ID
   * @param {string} state - Payment state ('awaiting_payment', 'normal', etc.)
   * @param {Object} paymentData - Payment-related data
   * @returns {Boolean} Success status
   */
  async setUserPaymentState(userId, state, paymentData = null) {
    try {
      const updateData = {
        payment_state: state,
        payment_state_updated_at: new Date().toISOString()
      };

      if (paymentData) {
        updateData.pending_payment_data = paymentData;
      }

      const { error } = await this.supabase
        .from(this.tableName)
        .upsert({
          whatsapp_phone: userId,
          user_id: userId,
          ...updateData
        }, {
          onConflict: 'whatsapp_phone'
        });

      if (error) {
        logger.error('❌ Error setting user payment state:', error);
        throw error;
      }

      logger.debug('✅ User payment state updated', { userId, state });
      return true;
    } catch (error) {
      logger.error('❌ Failed to set user payment state:', error);
      return false;
    }
  }

  /**
   * Get user payment state
   * @param {string} userId - WhatsApp user ID
   * @returns {Object} User payment state data
   */
  async getUserPaymentState(userId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('payment_state, payment_state_updated_at, pending_payment_data')
        .eq('whatsapp_phone', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        logger.error('❌ Error getting user payment state:', error);
        throw error;
      }

      return {
        state: data?.payment_state || 'normal',
        updatedAt: data?.payment_state_updated_at,
        paymentData: data?.pending_payment_data
      };
    } catch (error) {
      logger.error('❌ Failed to get user payment state:', error);
      return { state: 'normal', updatedAt: null, paymentData: null };
    }
  }

  /**
   * Clear user payment state
   * @param {string} userId - WhatsApp user ID
   * @returns {Boolean} Success status
   */
  async clearUserPaymentState(userId) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .update({
          payment_state: 'normal',
          payment_state_updated_at: new Date().toISOString(),
          pending_payment_data: null
        })
        .eq('whatsapp_phone', userId);

      if (error) {
        logger.error('❌ Error clearing user payment state:', error);
        throw error;
      }

      logger.debug('✅ User payment state cleared', { userId });
      return true;
    } catch (error) {
      logger.error('❌ Failed to clear user payment state:', error);
      return false;
    }
  }

  /**
   * Get all users with expired payments
   * @returns {Array} Users with expired payments
   */
  async getExpiredPayments() {
    try {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('whatsapp_phone, whatsapp_username, payment_state_updated_at, pending_payment_data')
        .eq('payment_state', 'awaiting_payment')
        .lt('payment_state_updated_at', twelveHoursAgo);

      if (error) {
        logger.error('❌ Error getting expired payments:', error);
        throw error;
      }

      logger.debug(`🔍 Found ${data?.length || 0} expired payments`);
      return data || [];
    } catch (error) {
      logger.error('❌ Failed to get expired payments:', error);
      return [];
    }
  }

  /**
   * Delete specific message from conversation history
   * @param {string} userId - WhatsApp user ID
   * @param {string} messageContent - Content of message to delete
   * @returns {Boolean} Success status
   */
  async deleteMessageFromHistory(userId, messageContent) {
    try {
      const { data, error: fetchError } = await this.supabase
        .from(this.tableName)
        .select('conversation')
        .eq('whatsapp_phone', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        logger.error('❌ Error fetching conversation for deletion:', fetchError);
        throw fetchError;
      }

      if (!data?.conversation) {
        logger.warn('⚠️ No conversation found for user:', userId);
        return false;
      }

      // Filter out the message containing payment link
      const updatedConversation = data.conversation.filter(msg => 
        !msg.content.includes(messageContent) && 
        !msg.content.includes('🔗 رابط الدفع')
      );

      const { error: updateError } = await this.supabase
        .from(this.tableName)
        .update({ conversation: updatedConversation })
        .eq('whatsapp_phone', userId);

      if (updateError) {
        logger.error('❌ Error deleting message from history:', updateError);
        throw updateError;
      }

      logger.debug('✅ Message deleted from conversation history', { userId });
      return true;
    } catch (error) {
      logger.error('❌ Failed to delete message from history:', error);
      return false;
    }
  }

  /**
   * Create payment record for client
   * @param {Object} paymentData - Payment information
   * @returns {Object} Created payment record
   */
  async createPaymentRecord(paymentData) {
    try {
      const { clientPhone, clientName, freelancerData, paymentLink, invoiceId } = paymentData;
      
      logger.debug('💾 Creating payment record', { clientPhone, freelancerName: freelancerData.full_name });

      const { data, error } = await this.supabase
        .from('paid_users')
        .insert({
          client_id: clientPhone,
          client_name: clientName,
          paid_to_freelancers: [freelancerData], // Store freelancer data as JSONB array
          payment_amount: 300.00,
          currency: 'SAR',
          myfatoorah_payment_id: invoiceId,
          payment_status: 'pending',
          payment_link: paymentLink
        })
        .select()
        .single();

      if (error) {
        logger.error('❌ Error creating payment record:', error);
        throw error;
      }

      logger.info('✅ Payment record created successfully', { 
        recordId: data.id, 
        clientPhone,
        invoiceId 
      });
      
      return data;
    } catch (error) {
      logger.error('❌ Failed to create payment record:', error);
      throw error;
    }
  }

  /**
   * Update payment status after successful payment
   * @param {string} invoiceId - MyFatoorah invoice ID
   * @param {Object} paymentData - Payment confirmation data
   * @returns {Object} Updated payment record
   */
  async updatePaymentStatus(invoiceId, paymentData) {
    try {
      logger.debug('🔄 Updating payment status', { invoiceId, status: 'completed' });

      const { data, error } = await this.supabase
        .from('paid_users')
        .update({
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('myfatoorah_payment_id', invoiceId)
        .select()
        .single();

      if (error) {
        logger.error('❌ Error updating payment status:', error);
        throw error;
      }

      logger.info('✅ Payment status updated successfully', { 
        recordId: data.id,
        clientPhone: data.client_id,
        invoiceId 
      });
      
      return data;
    } catch (error) {
      logger.error('❌ Failed to update payment status:', error);
      throw error;
    }
  }

  /**
   * Check if client has paid for a specific freelancer
   * @param {string} clientPhone - Client WhatsApp phone
   * @param {string} freelancerId - Freelancer ID
   * @returns {Object} Payment status
   */
  async checkClientPayment(clientPhone, freelancerId) {
    try {
      const { data, error } = await this.supabase
        .from('paid_users')
        .select('*')
        .eq('client_id', clientPhone)
        .eq('payment_status', 'completed');

      if (error) {
        logger.error('❌ Error checking client payment:', error);
        return { hasPaid: false, error: error.message };
      }

      // Check if any payment record contains the freelancer
      const hasPaidForFreelancer = data.some(record => 
        record.paid_to_freelancers.some(freelancer => freelancer.id === freelancerId)
      );

      logger.debug('🔍 Client payment check result', { 
        clientPhone, 
        freelancerId, 
        hasPaid: hasPaidForFreelancer,
        totalPayments: data.length 
      });

      return {
        hasPaid: hasPaidForFreelancer,
        paymentRecords: data
      };
    } catch (error) {
      logger.error('❌ Failed to check client payment:', error);
      return { hasPaid: false, error: error.message };
    }
  }

  /**
   * Get payment record by invoice ID
   * @param {string} invoiceId - MyFatoorah invoice ID
   * @returns {Object} Payment record
   */
  async getPaymentByInvoiceId(invoiceId) {
    try {
      const { data, error } = await this.supabase
        .from('paid_users')
        .select('*')
        .eq('myfatoorah_payment_id', invoiceId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        logger.error('❌ Error getting payment by invoice ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('❌ Failed to get payment by invoice ID:', error);
      return null;
    }
  }

  /**
   * Add paid user record for development testing
   * @param {Object} userData - User payment data
   * @returns {Object} Created payment record
   */
  async addPaidUser(userData) {
    try {
      const {
        phone_number,
        whatsapp_name,
        freelancer_id,
        freelancer_name,
        payment_amount,
        invoice_id,
        payment_method,
        transaction_id
      } = userData;

      logger.debug('💾 Adding paid user record', { phone_number, freelancer_name, payment_amount });

      const { data, error } = await this.supabase
        .from('paid_users')
        .insert({
          client_id: phone_number,
          client_name: whatsapp_name,
          paid_to_freelancers: [{
            id: freelancer_id,
            full_name: freelancer_name
          }],
          payment_amount: payment_amount,
          currency: 'SAR',
          myfatoorah_payment_id: invoice_id,
          payment_status: 'completed',
          payment_method: payment_method,
          transaction_id: transaction_id,
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('❌ Error adding paid user:', error);
        throw error;
      }

      logger.info('✅ Paid user record created successfully', {
        recordId: data.id,
        clientPhone: phone_number,
        freelancerName: freelancer_name,
        amount: payment_amount
      });

      return data;
    } catch (error) {
      logger.error('❌ Failed to add paid user:', error);
      throw error;
    }
  }

  /**
   * Search freelancers by multiple criteria (skills, location, budget, etc.)
   * @param {Object} criteria - Search criteria
   * @returns {Array} Matching freelancers
   */
  async searchFreelancersByCriteria(criteria = {}) {
    try {
      const { skills = [], location, maxBudget, minRating, experienceLevel, availability } = criteria;
      
      let query = this.supabase
        .from(this.freelancersTable)
        .select(`
          *,
          profiles!inner (*)
        `)
        .eq('is_verified', true);

      // Add filters based on criteria
      if (location) {
        query = query.ilike('profiles.location', `%${location}%`);
      }

      if (maxBudget) {
        query = query.lte('profiles.hourly_rate', maxBudget);
      }

      if (minRating) {
        query = query.gte('average_rating', minRating);
      }

      if (experienceLevel) {
        query = query.eq('profiles.experience_level', experienceLevel);
      }

      if (availability) {
        query = query.eq('profiles.availability_status', availability);
      }

      // Search by skills if provided
      if (skills.length > 0) {
        query = query.or(
          skills.map(skill => `profiles.skills.cs.["${skill}"]`).join(',')
        );
      }

      const { data, error } = await query
        .order('average_rating', { ascending: false })
        .order('completed_projects', { ascending: false })
        .limit(10);

      if (error) {
        logger.error('Error in criteria search:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to search by criteria:', error);
      return [];
    }
  }
}

export const supabaseService = new SupabaseService();
