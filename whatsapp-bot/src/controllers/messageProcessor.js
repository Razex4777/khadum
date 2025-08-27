import { whatsappService } from '../services/whatsappService.js';
import { geminiService } from '../services/geminiService.js';
import { supabaseService } from '../services/supabaseService.js';
import { myfatoorahService } from '../services/myfatoorahService.js';
import { logger } from '../utils/logger.js';

class MessageProcessor {
  constructor() {
    this.processingMessages = new Set(); // Prevent duplicate processing
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

      // Handle button responses first
      if (buttonId) {
        await this.handleButtonResponse(from, buttonId, text, name);
      } else {
        // Check for commands
        const command = geminiService.parseCommand(text);
        
        if (command) {
          await this.handleCommand(from, command);
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
   */
  async handleCommand(from, command) {
    try {
      switch (command.command) {
        case 'clear':
          await supabaseService.clearConversationHistory(from);
          await whatsappService.sendMessage(from, '🗑️ تم مسح محفوظات المحادثة بنجاح!\n🗑️ Conversation history cleared successfully!');
          break;

        case 'help':
          await whatsappService.sendMessage(from, geminiService.getHelpMessage());
          break;

        case 'info':
          const messageCount = await supabaseService.getMessageCount(from);
          const infoMessage = geminiService.getInfoMessage() + `\n\n📊 Your message count: ${messageCount}`;
          await whatsappService.sendMessage(from, infoMessage);
          break;

        default:
          await whatsappService.sendMessage(from, '❓ Unknown command. Send /help for available commands.');
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

      // Check for "accept" keyword to trigger payment flow
      if (message.toLowerCase().trim() === 'accept') {
        await this.handleAcceptPayment(from, name);
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

      // Generate AI response with complete data context
      logger.debug('🧠 Generating AI response with complete data context');
      const aiResponse = await geminiService.generateResponseWithAllData(
        message,
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
          'اختر أحد الخيارات أدناه 👇'
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
   * Handle client acceptance and payment flow
   * @param {string} from - Client WhatsApp phone number
   * @param {string} name - Client WhatsApp name
   */
  async handleAcceptPayment(from, name) {
    try {
      logger.info('💳 Client accepted freelancer, starting payment flow', { from, name });

      // Get the last recommended freelancer from conversation history
      // For now, we'll use a sample freelancer - in production, this should be extracted from conversation context
      const sampleFreelancer = {
        id: 'd0f55e6f-9cb7-49ca-b6c6-718c4ea698e3',
        full_name: 'فاطمة علي السعد',
        field: 'تطوير المواقع الإلكترونية',
        average_rating: 4.9
      };

      let paymentLinkData;
      let paymentMessage;

      try {
        // Try real MyFatoorah API first
        paymentLinkData = await myfatoorahService.generatePaymentLink({
          clientPhone: from,
          clientName: name,
          freelancerData: sampleFreelancer,
          amount: 300
        });

        if (paymentLinkData.success) {
          paymentMessage = myfatoorahService.formatPaymentMessage(paymentLinkData, sampleFreelancer);
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
          freelancerData: sampleFreelancer,
          amount: 300
        });

        paymentMessage = this.formatMockPaymentMessage(paymentLinkData, sampleFreelancer);
        logger.info('✅ Mock payment link generated', { invoiceId: paymentLinkData.invoiceId });
      }

      // Save payment record to database (if method exists)
      try {
        if (typeof supabaseService.createPaymentRecord === 'function') {
          await supabaseService.createPaymentRecord({
            clientPhone: from,
            clientName: name,
            freelancerData: sampleFreelancer,
            paymentLink: paymentLinkData.paymentUrl,
            invoiceId: paymentLinkData.invoiceId
          });
        }
      } catch (dbError) {
        logger.warn('⚠️ Failed to save payment record to database', { error: dbError.message });
      }

      // Send payment message
      await whatsappService.sendMessage(from, paymentMessage);

      // Save payment message to history
      await supabaseService.saveMessage(from, 'assistant', paymentMessage, name);

      logger.info('✅ Payment link sent successfully', { 
        from, 
        invoiceId: paymentLinkData.invoiceId,
        freelancer: sampleFreelancer.full_name 
      });

    } catch (error) {
      logger.error('❌ Error handling accept payment:', error);
      
      const errorMessage = 'عذراً، حدث خطأ في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.';
      await whatsappService.sendMessage(from, errorMessage);
    }
  }

  /**
   * Generate mock payment link for testing
   * @param {Object} paymentData - Payment information
   * @returns {Object} Mock payment link data
   */
  async generateMockPaymentLink(paymentData) {
    const { clientPhone, clientName, freelancerData, amount = 300 } = paymentData;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockInvoiceId = Math.floor(Math.random() * 1000000) + 2000000;
    
    return {
      success: true,
      invoiceId: mockInvoiceId,
      paymentUrl: `https://portal.myfatoorah.com/ar/KSA/PayInvoice/${mockInvoiceId}/${process.env.MYFATOORAH_API_KEY}`,
      invoiceReference: `KHADUM_MOCK_${Date.now()}`,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Format mock payment message
   * @param {Object} paymentLinkData - Payment link information
   * @param {Object} freelancerData - Freelancer information
   * @returns {string} Formatted payment message
   */
  formatMockPaymentMessage(paymentLinkData, freelancerData) {
    return `🎉 تم اختيار المستقل بنجاح!

👤 المستقل المختار: ${freelancerData.full_name}
⭐ التقييم: ${freelancerData.average_rating}/5
💼 التخصص: ${freelancerData.field}

💰 قيمة الخدمة: 300 ريال سعودي

🔗 رابط الدفع:
${paymentLinkData.paymentUrl}

⚠️ ملاحظة: هذا رابط تجريبي للاختبار
✅ في البيئة الحقيقية سيتم استخدام MyFatoorah API

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
}

export const messageProcessor = new MessageProcessor();
