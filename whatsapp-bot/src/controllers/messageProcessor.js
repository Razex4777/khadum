import { whatsappService } from '../services/whatsappService.js';
import { geminiService } from '../services/geminiservice/index.js';
import { supabaseService } from '../services/supabaseservice/index.js';
import { myfatoorahService } from '../services/myfatoorahService.js';
import { logger } from '../utils/logger.js';
import { InputSanitizer } from '../utils/inputSanitizer.js';
import { MockPaymentUtil } from '../utils/mockPaymentUtil.js';
import { config } from '../config/config.js';
import { bridgeModeService } from '../services/bridgeModeService.js';
import { CommandRegistry } from '../commands/index.js';

class MessageProcessor {
  constructor() {
    this.processingMessages = new Set(); // Prevent duplicate processing
    
    // Initialize services
    const services = {
      supabaseService,
      whatsappService,
      geminiService,
      bridgeModeService,
      myfatoorahService
    };
    
    // Initialize command registry in geminiService
    geminiService.initializeCommandRegistry(services);
    
    // Use the command registry from geminiService
    this.commandRegistry = geminiService.commandRegistry;
  }

  /**
   * Process incoming WhatsApp message
   * @param {Object} messageData - Extracted message data
   */
  async processMessage(messageData) {
    const { messageId, from, text, name, buttonId } = messageData;

    // Prevent duplicate processing
    if (this.processingMessages.has(messageId)) {
      logger.debug('Message already being processed', { messageId });
      return;
    }

    this.processingMessages.add(messageId);

    try {
      logger.info(`Processing message from ${name} (${from}): ${text}`);

      // Mark message as read
      await whatsappService.markAsRead(messageId);

      // Send typing indicator
      await whatsappService.sendTypingIndicator(from);

      // Check payment state FIRST - block ALL messages during payment process (except slash commands)
      const paymentState = await supabaseService.getUserPaymentState(from);
      
      logger.info(`💳 Payment state check for ${from}:`, {
        state: paymentState.state,
        updatedAt: paymentState.updatedAt,
        hasPaymentData: !!paymentState.paymentData
      });
      
      // Allow slash commands to bypass payment blocking
      const isSlashCommand = text.startsWith('/');
      
      if (paymentState.state === 'awaiting_payment' && !isSlashCommand) {
        logger.info('💳 User has pending payment - BLOCKING AI response and sending fixed message', { from });
        await this.sendPaymentPendingMessage(from);
        return; // Stop processing - don't handle any other message types
      }
      
      logger.info('🚀 No pending payment or slash command - proceeding with normal message processing', { from });

      // Check if user is in bridge mode FIRST - bypass ALL other processing
      const bridgeSession = await bridgeModeService.getActiveBridgeSession(from);
      if (bridgeSession) {
        logger.info('🌉 User is in bridge mode - forwarding message directly', { 
          from, 
          targetPhone: bridgeSession.target_phone 
        });
        
        // Forward message through bridge and exit
        const handled = await bridgeModeService.handleBridgeMessage(from, text, name);
        if (handled) {
          logger.debug('🌉 Message successfully forwarded in bridge mode', { from });
          return; // Message forwarded, stop all processing
        } else {
          // HARD BLOCK: Do NOT fall back to AI while bridge mode is active
          logger.warn('⚠️ Failed to forward bridge message - hard blocking AI while in bridge mode', { from });
          await whatsappService.sendMessage(from, 
            '⚠️ تعذر إرسال رسالتك عبر وضع الجسر.\n+\nسبب شائع: رقم المستلم غير مسموح به في إعدادات واتساب (Recipient list).\n\nلا يمكنني الرد بالذكاء الاصطناعي أثناء تفعيل وضع الجسر.\n\nرجاءً أضف رقم المستلم لقائمة المستلمين المسموح بهم ثم أعد الإرسال، أو اكتب /end_bridge_mode لإيقاف وضع الجسر.'
          );
          return; // Stop further processing entirely
        }
      }

      // Handle button responses first
      if (buttonId) {
        await this.handleButtonResponse(from, buttonId, text, name);
      } else {
        // Check for commands
        const command = this.commandRegistry.parseCommand(text);
        
        if (command) {
          await this.handleCommand(from, command, text, name);
        } else {
          await this.handleAIResponse(from, text, name);
        }
      }

    } catch (error) {
      logger.error('Error processing message:', error);
      await this.sendErrorMessage(from);
    } finally {
      // Remove from processing set after delay
      setTimeout(() => {
        this.processingMessages.delete(messageId);
      }, 5000);
    }
  }

  /**
   * Handle button responses
   * @param {string} from - User phone number
   * @param {string} buttonId - Button ID that was clicked
   * @param {string} buttonText - Button text
   * @param {string} name - User's WhatsApp name
   */
  async handleButtonResponse(from, buttonId, buttonText, name) {
    try {
      logger.info(`Button clicked: ${buttonId} (${buttonText}) by ${name} (${from})`);

      // Save button response to history
      await supabaseService.saveMessage(from, 'user', buttonText, name);

      switch (buttonId) {
        case 'accept_freelancer':
          await this.handleAcceptPayment(from, name);
          break;

        case 'reject_freelancer':
          await whatsappService.sendMessage(from, 
            '👍 تمام، لا مشكلة!\n\n🔍 هل تريد البحث عن مستقل آخر؟ أو أخبرني بتفاصيل أكثر عن مشروعك لأجد لك الأنسب.'
          );
          break;

        case 'search_more':
          await whatsappService.sendMessage(from, 
            '🔍 ممتاز! أخبرني بتفاصيل أكثر عن مشروعك:\n\n• ما نوع الخدمة بالضبط؟\n• ما الميزانية المتوقعة؟\n• متى تريد التسليم؟\n\nوسأجد لك أفضل المستقلين المناسبين! 🚀'
          );
          break;

        default:
          await whatsappService.sendMessage(from, 
            '🤖 عذراً، لم أفهم اختيارك. يرجى المحاولة مرة أخرى.'
          );
      }

    } catch (error) {
      logger.error('Error handling button response:', error);
      await this.sendErrorMessage(from);
    }
  }

  /**
   * Handle command messages
   * @param {string} from - User phone number
   * @param {Object} command - Command details
   * @param {string} message - Full message text (for commands that need parameters)
   * @param {string} name - User's WhatsApp name
   */
  async handleCommand(from, command, message, name) {
    try {
      // Execute command using CommandRegistry
      const result = await this.commandRegistry.executeCommand(
        command.command,
        from,
        message,
        name
      );

      if (!result.success) {
        logger.warn(`Command execution failed: ${command.command}`, {
          from,
          error: result.error
        });
      }
    } catch (error) {
      logger.error('Error handling command:', error);
      await this.sendErrorMessage(from);
    }
  }



  /**
   * Handle AI-powered responses with ALL available data context
   * @param {string} from - User phone number
   * @param {string} message - User message
   * @param {string} name - User's WhatsApp name
   */
  async handleAIResponse(from, message, name = 'User') {
    try {
      logger.debug('🤖 Starting AI response generation', { from, message, name });

      // Check for special commands that aren't traditional slash commands
      const specialCommand = this.commandRegistry.parseCommand(message);
      if (specialCommand) {
        await this.handleCommand(from, specialCommand, message, name);
        return;
      }

      // Save user message to history
      await supabaseService.saveMessage(from, 'user', message, name);
      logger.debugSupabase('User message saved to history', { from, messageLength: message.length });

      // Get conversation history
      const history = await supabaseService.getConversationHistory(from);
      logger.debugSupabase('Conversation history retrieved', { historyCount: history.length });

      // Get ALL available data from Supabase for AI context
      logger.debug('📊 Fetching ALL data for AI context...');
      const allData = await supabaseService.getAllDataForAIContext();
      
      logger.debugSupabase('All data fetched for AI context', {
        freelancersCount: allData.freelancers.length,
        profilesCount: allData.profiles.length,
        projectsCount: allData.projects.length,
        totalRecords: allData.freelancers.length + allData.profiles.length + allData.projects.length
      });

      // Sanitize user message before sending to AI
      const sanitizedMessage = InputSanitizer.sanitizeForAI(message);
      
      // Generate AI response with complete data context
      logger.debug('🧠 Generating AI response with complete data context');
      const aiResponse = await geminiService.generateResponseWithAllData(
        sanitizedMessage,
        history,
        allData,
        name
      );
      logger.debug('✅ AI response generated', { responseLength: aiResponse.length });

      // Check if response should include buttons
      if (aiResponse.includes('[SHOW_BUTTONS]')) {
        // Remove the button tag from the message
        const cleanResponse = aiResponse.replace('[SHOW_BUTTONS]', '').trim();
        
        // Save clean response to history
        await supabaseService.saveMessage(from, 'assistant', cleanResponse, name);
        
        // Send message with interactive buttons
        await whatsappService.sendInteractiveButtons(
          from,
          cleanResponse,
          [
            { id: 'accept_freelancer', title: '✅ قبول المستقل' },
            { id: 'reject_freelancer', title: '❌ رفض والبحث عن آخر' }
          ],
          null,
          'اختر其中一个 الخيارات أدناه 👇'
        );
        
        logger.info(`🎉 AI response with buttons sent to ${from}`);
      } else {
        // Save AI response to history
        await supabaseService.saveMessage(from, 'assistant', aiResponse, name);
        logger.debugSupabase('AI response saved to history', { from });

        // Send regular response to user
        await whatsappService.sendMessage(from, aiResponse);
        logger.info(`🎉 AI response sent to ${from}`);
      }

    } catch (error) {
      logger.error('❌ Error generating AI response:', error);
      logger.debugSupabase('AI response error details', {
        error: error.message,
        stack: error.stack,
        from
      });
      await this.sendErrorMessage(from);
    }
  }

  /**
   * Send payment pending message (fixed response when user has pending payment)
   * @param {string} to - User phone number
   */
  async sendPaymentPendingMessage(to) {
    try {
      logger.info(`💫 SENDING FIXED PAYMENT MESSAGE (NOT AI) to ${to}`);
      
      const pendingMessage = `❌ لا يمكنني الرد عليك حالياً

💳 لديك عملية دفع معلقة
⏰ يرجى إكمال الدفع أو انتظار انتهاء الصلاحية (12 ساعة)

🔄 بعدها يمكنني الرد على رسائلك مرة أخرى`;
      
      logger.info('💫 Fixed message content:', { message: pendingMessage });
      
      await whatsappService.sendMessage(to, pendingMessage);
      
      // Also save this fixed message to conversation history
      await supabaseService.saveMessage(to, 'assistant', pendingMessage, 'Bot');
      
      logger.info(`✅ FIXED payment message sent successfully to ${to} - NO AI INVOLVED`);
      
    } catch (error) {
      logger.error('❌ Error sending payment pending message:', error);
    }
  }

  /**
   * Handle client acceptance and payment flow
   * @param {string} from - Client WhatsApp phone number
   * @param {string} name - Client WhatsApp name
   */
  async handleAcceptPayment(from, name) {
    try {
      logger.info('💳 Client accepted freelancer, starting payment flow', { from, name });

      // Get conversation history to extract project context
      const conversationHistory = await supabaseService.getConversationHistory(from);
      
      // Extract project requirements from conversation
      const projectContext = await this.extractProjectRequirements(conversationHistory);
      
      // Get the last recommended freelancer from conversation history
      const recommendedFreelancer = await this.getLastRecommendedFreelancer(from, conversationHistory);
      
      if (!recommendedFreelancer) {
        logger.warn('No recommended freelancer found in conversation history');
        await whatsappService.sendMessage(from, 
          'عذراً، لم أتمكن من العثور على بيانات المستقل. يرجى إعادة البحث عن مستقل.');
        return;
      }

      // Ensure the freelancer object has the required fields
      const freelancerData = {
        id: recommendedFreelancer.id,
        full_name: recommendedFreelancer.full_name || 'مستقل',
        whatsapp_number: recommendedFreelancer.whatsapp_number || recommendedFreelancer.phone || null,
        field: recommendedFreelancer.field || 'غير محدد',
        average_rating: recommendedFreelancer.average_rating || 0,
        total_projects: recommendedFreelancer.total_projects || 0,
        completed_projects: recommendedFreelancer.completed_projects || 0,
        is_verified: recommendedFreelancer.is_verified || false,
        email: recommendedFreelancer.email || null
      };

      let paymentLinkData;
      let paymentMessage;

      try {
        // Try real MyFatoorah API first
        paymentLinkData = await myfatoorahService.generatePaymentLink({
          clientPhone: from,
          clientName: name,
          freelancerData: freelancerData,
          amount: 300
        });

        if (paymentLinkData.success) {
          paymentMessage = myfatoorahService.formatPaymentMessage(paymentLinkData, freelancerData);
          logger.info('✅ Real MyFatoorah payment link generated', { invoiceId: paymentLinkData.invoiceId });
        } else {
          throw new Error('Real MyFatoorah failed');
        }

      } catch (realApiError) {
        logger.warn('⚠️ Real MyFatoorah failed, using mock payment system', { error: realApiError.message });
        
        // Fallback to mock payment system
        paymentLinkData = await this.generateMockPaymentLink({
          clientPhone: from,
          clientName: name,
          freelancerData: freelancerData,
          amount: 300
        });

        paymentMessage = this.formatMockPaymentMessage(paymentLinkData, freelancerData);
        logger.info('✅ Mock payment link generated', { invoiceId: paymentLinkData.invoiceId });
      }

      // Send payment message
      await whatsappService.sendMessage(from, paymentMessage);

      // Save payment message to history with metadata
      await supabaseService.saveMessage(from, 'assistant', paymentMessage, name, {
        type: 'payment',
        isPayment: true,
        invoiceId: paymentLinkData.invoiceId,
        paymentUrl: paymentLinkData.paymentUrl
      });

      // Set user state to awaiting payment
      await supabaseService.setUserPaymentState(from, 'awaiting_payment', {
        invoiceId: paymentLinkData.invoiceId,
        paymentUrl: paymentLinkData.paymentUrl,
        freelancerData: freelancerData,
        expiryDate: paymentLinkData.expiryDate,
        messageContent: paymentMessage
      });

      logger.info('✅ Payment link sent successfully', { 
        from, 
        invoiceId: paymentLinkData.invoiceId,
        freelancer: freelancerData.full_name,
        userState: 'awaiting_payment'
      });

    } catch (error) {
      logger.error('❌ Error handling accept payment:', error);
      
      const errorMessage = 'عذراً، حدث خطأ في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.';
      await whatsappService.sendMessage(from, errorMessage);
    }
  }

  /**
   * Handle development payment testing - simulate payment completion
   * @param {string} from - User phone number
   * @param {string} name - User's WhatsApp name
   */
  async handleDevelopmentPaymentTest(from, name) {
    try {
      logger.info('🧪 DEVELOPMENT TEST: Simulating payment completion', { from, name });

      // Check if user currently has pending payment
      const paymentState = await supabaseService.getUserPaymentState(from);
      
      if (paymentState.state !== 'awaiting_payment') {
        // No pending payment - create and complete mock payment
        await this.handleMockPaymentFlow(from, name);
      } else {
        // User has pending payment - just complete it
        await this.handleMockPaymentCompletion(from, name, paymentState.paymentData);
      }

    } catch (error) {
      logger.error('❌ Error in development payment test:', error);
      await whatsappService.sendMessage(from, 
        '🧪 خطأ في اختبار الدفع التطويري\n❌ Development payment test failed'
      );
    }
  }

  /**
   * Create mock payment and immediately complete it
   * @param {string} from - User phone number
   * @param {string} name - User's WhatsApp name
   */
  async handleMockPaymentFlow(from, name) {
    try {
      // Get a random freelancer from database for testing
      const freelancers = await supabaseService.supabase
        .from('freelancers')
        .select('*')
        .limit(1)
        .single();

      // Check for query failure first
      if (freelancers.error) {
        logger.error('❌ Database query failed:', freelancers.error);
        throw new Error(`Database query failed: ${freelancers.error.message || freelancers.error.details || 'Unknown error'}`);
      }

      // Then check for empty result
      if (!freelancers.data) {
        throw new Error('No freelancers found in database');
      }

      const freelancerData = freelancers.data;
      logger.info('✅ Using freelancer from database for mock payment', {
        freelancerId: freelancerData.id,
        freelancerName: freelancerData.full_name
      });

      // Check if mock payments are enabled (environment guard)
      if (!MockPaymentUtil.isEnabled()) {
        logger.warn('🚫 Mock payments disabled - not allowed in production');
        await whatsappService.sendMessage(from,
          '🧪 اختبار الدفع غير متاح\n❌ Mock payment testing is disabled'
        );
        return;
      }

      // Use mock payment utility
      const dependencies = { supabaseService, whatsappService, bridgeModeService }; // Add bridgeModeService
      const params = { clientPhone: from, clientName: name, freelancerData };

      await MockPaymentUtil.createAndCompleteMockPayment(dependencies, params);
      
    } catch (error) {
      logger.error('❌ Error in mock payment flow:', error);
      throw error;
    }
  }

  /**
   * Complete mock payment and update all related data
   * @param {string} from - User phone number  
   * @param {string} name - User's WhatsApp name
   * @param {Object} paymentData - Payment data to complete
   */
  async handleMockPaymentCompletion(from, name, paymentData) {
    try {
      const dependencies = { supabaseService, whatsappService, bridgeModeService }; // Add bridgeModeService
      const params = { clientPhone: from, clientName: name, paymentData };
      
      await MockPaymentUtil.completeMockPayment(dependencies, params);
      
    } catch (error) {
      logger.error('❌ Error in mock payment completion:', error);
      throw error;
    }
  }

  /**
   * Generate mock payment link for testing
   * @param {Object} paymentData - Payment information
   * @returns {Object} Mock payment link data
   */
  async generateMockPaymentLink(paymentData) {
    return await MockPaymentUtil.generateMockPaymentLink(paymentData);
  }

  /**
   * Format mock payment message
   * @param {Object} paymentLinkData - Payment link information
   * @param {Object} freelancerData - Freelancer information
   * @returns {string} Formatted payment message
   */
  formatMockPaymentMessage(paymentLinkData, freelancerData) {
    return MockPaymentUtil.formatMockPaymentMessage(paymentLinkData, freelancerData);
  }

  /**
   * Legacy method for compatibility - delegates to utility
   */
  formatMockPaymentMessageLegacy(paymentLinkData, freelancerData) {
    return `🎉 تم اختيار المستقل بنجاح!

👤 المستقل المختار: ${freelancerData.full_name}
⭐ التقييم: ${freelancerData.average_rating}/5
💼 التخصص: ${freelancerData.field}

💰 قيمة الخدمة: 300 ريال سعودي

🔗 رابط الدفع:
${paymentLinkData.paymentUrl}

⏰ صالح حتى: ${new Date(paymentLinkData.expiryDate).toLocaleString('ar-SA')}

📋 تعليمات مهمة:
• لا تغير اسم المستخدم في الواتساب
• لا تغير رقم الهاتف
• هذا ضروري للتحقق من الدفع

بعد الدفع سيتم إشعارك تلقائياً 🚀`;
  }



  /**
   * Send error message to user
   * @param {string} to - User phone number
   */
  async sendErrorMessage(to) {
    try {
      await whatsappService.sendMessage(
        to,
        '❌ Sorry, I encountered an error processing your message. Please try again later.'
      );
    } catch (error) {
      logger.error('Failed to send error message:', error);
    }
  }

  /**
   * Process status updates (delivery, read receipts)
   * @param {Object} statusData - Status update data
   */
  async processStatusUpdate(statusData) {
    try {
      const status = statusData.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
      
      if (status) {
        logger.debug('Status update received', {
          messageId: status.id,
          status: status.status,
          recipient: status.recipient_id
        });
      }
    } catch (error) {
      logger.error('Error processing status update:', error);
    }
  }

  /**
   * Extract project requirements from conversation history
   * @param {Array} conversationHistory - Array of conversation messages
   * @returns {Object} Extracted project context
   */
  async extractProjectRequirements(conversationHistory) {
    try {
      // Combine all user messages to understand project requirements
      const userMessages = conversationHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');

      // Sanitize user messages before sending to AI
      const sanitizedUserMessages = InputSanitizer.sanitizeForAI(userMessages);
      
      // Use Gemini AI to analyze and extract project requirements
      const contextPrompt = `تحليل متطلبات المشروع من المحادثة التالية:

استخرج المعلومات التالية بشكل موجز وواضح:
1. وصف المشروع (جملتين-3)
2. المتطلبات المحددة
3. الميزانية المتوقعة
4. الجدول الزمني
5. أي تفاصيل إضافية مهمة

أجب بهذا التنسيق بالعربية:`;

      const safePrompt = InputSanitizer.createSafePrompt(sanitizedUserMessages, contextPrompt);
      const aiAnalysis = await geminiService.generateResponse(safePrompt);
      
      // Extract estimated budget if mentioned
      const budgetMatch = userMessages.match(/\d+/);
      const estimatedBudget = budgetMatch ? parseFloat(budgetMatch[0]) : null;
      
      return {
        description: aiAnalysis || 'مشروع جديد من عميل عبر واتساب',
        requirements: userMessages.substring(0, 500) || 'لم يتم توضيح متطلبات محددة',
        estimatedBudget: estimatedBudget,
        conversationSummary: aiAnalysis,
        clientExperience: userMessages.length > 100 ? 'عميل متفاعل' : 'عميل جديد'
      };
    } catch (error) {
      logger.error('Error extracting project requirements:', error);
      return {
        description: 'مشروع جديد من عميل',
        requirements: 'لم يتم استخراج المتطلبات',
        estimatedBudget: null,
        conversationSummary: 'غير متاح',
        clientExperience: 'غير محدد'
      };
    }
  }

  /**
   * Extract service type from conversation history
   * @param {Array} conversationHistory - Conversation messages
   * @returns {string|null} Service type or null
   */
  extractServiceFromConversation(conversationHistory) {
    try {
      const userMessages = conversationHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ')
        .toLowerCase();

      // Service keywords mapping - aligned with Gemini system prompt categories
      const serviceKeywords = {
        'الأعمال': ['بيانات', 'تخطيط', 'استشارات', 'تجارة', 'قانوني', 'محاسبة', 'أبحاث', 'مساعد', 'عملاء', 'موارد', 'إداري'],
        'تطوير': ['web dev', 'website', 'موقع', 'تطوير', 'برمجة', 'development', 'html', 'css', 'php', 'wordpress', 'java', 'python', 'android', 'ios', 'متجر'],
        'تصميم': ['design', 'تصميم', 'شعار', 'logo', 'ui', 'ux', 'جرافيك', 'بنر', 'فلاير', 'بطاقة', 'عرض', 'صور', 'رسوم'],
        'تسويق': ['تسويق', 'marketing', 'إعلان', 'social media', 'انستقرام', 'فيسبوك', 'سناب', 'تويتر', 'يوتيوب', 'seo', 'sem'],
        'كتابة': ['كتابة', 'محتوى', 'content', 'writing', 'مقال', 'سيناريو', 'نصوص', 'سيرة', 'تفريغ'],
        'ترجمة': ['ترجمة', 'translate', 'translation', 'تدقيق', 'تلخيص'],
        'فيديو': ['مونتاج', 'فيديو', 'video', 'موشن', 'أنيميشن', 'مقدمات', 'صوت', 'بودكاست', 'موسيقى'],
        'تدريب': ['تدريب', 'دورات', 'تعليم', 'استشارات', 'حقائب']
      };

      // Search for matching keywords
      for (const [service, keywords] of Object.entries(serviceKeywords)) {
        for (const keyword of keywords) {
          if (userMessages.includes(keyword)) {
            return service;
          }
        }
      }

      return null;
    } catch (error) {
      logger.error('Error extracting service from conversation:', error);
      return null;
    }
  }

  /**
   * Get the last recommended freelancer from conversation
   * @param {string} clientPhone - Client phone number
   * @param {Array} conversationHistory - Conversation history
   * @returns {Object|null} Freelancer data or null
   */
  async getLastRecommendedFreelancer(clientPhone, conversationHistory) {
    try {
      // First, try to get actual freelancers from database
      // Extract service type from conversation or use generic search
      const serviceQuery = this.extractServiceFromConversation(conversationHistory) || 'تطوير';
      const freelancers = await supabaseService.searchFreelancersByService(serviceQuery, 5);
      
      if (freelancers && freelancers.length > 0) {
        // Return a random freelancer from actual database results
        const randomIndex = Math.floor(Math.random() * freelancers.length);
        const selectedFreelancer = freelancers[randomIndex];
        
        logger.info('✅ Selected freelancer from database', {
          freelancerId: selectedFreelancer.id,
          freelancerName: selectedFreelancer.full_name,
          field: selectedFreelancer.field
        });
        
        return selectedFreelancer;
      }
      
      // If no freelancers found in database, get any available freelancer as fallback
      logger.warn('❌ No freelancers found with specific search, trying generic search', {
        query: serviceQuery
      });
      
      // Try a more generic search for any available freelancer
      const { data: allFreelancers, error: allFreelancersError } = await supabaseService.supabase
        .from('freelancers')
        .select(`
          *,
          profiles!inner (*)
        `)
        .eq('is_verified', true)
        .limit(1);
      
      if (allFreelancersError) {
        logger.error('❌ Error getting any freelancer:', allFreelancersError);
      } else if (allFreelancers && allFreelancers.length > 0) {
        const freelancer = allFreelancers[0];
        logger.info('✅ Using fallback freelancer', {
          freelancerId: freelancer.id,
          freelancerName: freelancer.full_name
        });
        return freelancer;
      }
      
      // If no freelancers found in database, return null
      logger.error('❌ No freelancers found in database', {
        query: serviceQuery,
        reason: 'Database is empty or no matching freelancers'
      });

      return null;
      
    } catch (error) {
      logger.error('Error getting recommended freelancer:', error);

      // Return null instead of hardcoded fallback
      return null;
    }
  }

  /**
   * Create notification for freelancer when client selects them
   * @param {Object} notificationData - Notification information
   */
  async createFreelancerNotification(notificationData) {
    try {
      const {
        freelancerId,
        clientPhone,
        clientName,
        projectContext,
        paymentAmount,
        invoiceId
      } = notificationData;

      // Generate AI explanation of why this freelancer was chosen
      const sanitizedDescription = InputSanitizer.sanitizeForAI(projectContext.description || 'مشروع جديد');
      const contextPrompt = `وضح في 2-3 جمل لماذا تم اختيار هذا المستقل بشكل شخصي ومحترف:`;
      const safePrompt = InputSanitizer.createSafePrompt(
        `بناءً على متطلبات المشروع التالية: ${sanitizedDescription}`,
        contextPrompt
      );
      
      const whyChosen = await geminiService.generateResponse(safePrompt) || 
        'تم اختيارك بناءً على خبرتك وتقييماتك الممتازة';

      // Log the selection for debugging purposes
      logger.info('✅ Freelancer selected successfully', {
        freelancerId,
        clientPhone,
        projectType: projectContext.description.substring(0, 50)
      });

      // Return a simple success object instead of creating a notification
      return {
        success: true,
        freelancerId,
        clientPhone,
        projectDescription: projectContext.description
      };
      
    } catch (error) {
      logger.error('❌ Failed to process freelancer selection:', error);
      throw error;
    }
  }
}

export const messageProcessor = new MessageProcessor();
