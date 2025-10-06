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

      // Check payment state FIRST - block ALL messages during payment process
      const paymentState = await supabaseService.getUserPaymentState(from);
      
      logger.info(`💳 Payment state check for ${from}:`, {
        state: paymentState.state,
        updatedAt: paymentState.updatedAt,
        hasPaymentData: !!paymentState.paymentData
      });
      
      if (paymentState.state === 'awaiting_payment') {
        logger.info('💳 User has pending payment - BLOCKING AI response and sending fixed message', { from });
        await this.sendPaymentPendingMessage(from);
        return; // Stop processing - don't handle any other message types
      }
      
      logger.info('🚀 No pending payment - proceeding with normal message processing', { from });

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

      // Development testing: simulate payment completion when "salman47" is sent
      if (message.toLowerCase().trim() === 'salman47') {
        await this.handleDevelopmentPaymentTest(from, name);
        return;
      }

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

      let paymentLinkData;
      let paymentMessage;

      try {
        // Try real MyFatoorah API first
        paymentLinkData = await myfatoorahService.generatePaymentLink({
          clientPhone: from,
          clientName: name,
          freelancerData: recommendedFreelancer,
          amount: 300
        });

        if (paymentLinkData.success) {
          paymentMessage = myfatoorahService.formatPaymentMessage(paymentLinkData, recommendedFreelancer);
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
          freelancerData: recommendedFreelancer,
          amount: 300
        });

        paymentMessage = this.formatMockPaymentMessage(paymentLinkData, recommendedFreelancer);
        logger.info('✅ Mock payment link generated', { invoiceId: paymentLinkData.invoiceId });
      }

      // Create client-freelancer notification BEFORE payment
      try {
        await this.createFreelancerNotification({
          freelancerId: recommendedFreelancer.id,
          clientPhone: from,
          clientName: name,
          projectContext: projectContext,
          paymentAmount: 300,
          invoiceId: paymentLinkData.invoiceId
        });
        logger.info('✅ Freelancer notification created successfully');
      } catch (notificationError) {
        logger.error('❌ Failed to create freelancer notification:', notificationError);
        // Continue with payment flow even if notification fails
      }

      // Save payment record to database (if method exists)
      try {
        if (typeof supabaseService.createPaymentRecord === 'function') {
          await supabaseService.createPaymentRecord({
            clientPhone: from,
            clientName: name,
            freelancerData: recommendedFreelancer,
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

      // Set user state to awaiting payment
      await supabaseService.setUserPaymentState(from, 'awaiting_payment', {
        invoiceId: paymentLinkData.invoiceId,
        paymentUrl: paymentLinkData.paymentUrl,
        freelancerData: recommendedFreelancer,
        expiryDate: paymentLinkData.expiryDate,
        messageContent: paymentMessage
      });

      logger.info('✅ Payment link sent successfully', { 
        from, 
        invoiceId: paymentLinkData.invoiceId,
        freelancer: recommendedFreelancer.full_name,
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
        // No pending payment - first create a mock payment, then complete it
        await this.createMockPaymentAndComplete(from, name);
      } else {
        // User has pending payment - just complete it
        await this.completeMockPayment(from, name, paymentState.paymentData);
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
  async createMockPaymentAndComplete(from, name) {
    logger.info('🧪 Creating mock payment and completing immediately', { from });

    // Sample freelancer data for testing
    const sampleFreelancer = {
      id: 'd0f55e6f-9cb7-49ca-b6c6-718c4ea698e3',
      full_name: 'فاطمة علي السعد',
      field: 'تطوير المواقع الإلكترونية', 
      average_rating: 4.9
    };

    // Generate mock payment data
    const mockInvoiceId = Math.floor(Math.random() * 1000000) + 2000000;
    const mockPaymentData = {
      invoiceId: mockInvoiceId,
      paymentUrl: `https://portal.myfatoorah.com/ar/KSA/PayInvoice/${mockInvoiceId}/TEST`,
      freelancerData: sampleFreelancer,
      expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      messageContent: 'Mock payment for development testing'
    };

    // Set payment state first
    await supabaseService.setUserPaymentState(from, 'awaiting_payment', mockPaymentData);
    logger.info('✅ Mock payment state set', { invoiceId: mockInvoiceId });

    // Wait a moment then complete the payment
    setTimeout(async () => {
      await this.completeMockPayment(from, name, mockPaymentData);
    }, 1000);

    // Send initial message about payment creation and completion
    await whatsappService.sendMessage(from, 
      `🧪 اختبار تطويري - دفع وهمي\n✅ تم إنشاء وإكمال الدفع تلقائياً\n📋 رقم الفاتورة: ${mockInvoiceId}\n⚡ جاري معالجة البيانات...`
    );
  }

  /**
   * Complete mock payment and update all related data
   * @param {string} from - User phone number  
   * @param {string} name - User's WhatsApp name
   * @param {Object} paymentData - Payment data to complete
   */
  async completeMockPayment(from, name, paymentData) {
    try {
      logger.info('🧪 Completing mock payment', { from, invoiceId: paymentData?.invoiceId });

      const freelancerData = paymentData?.freelancerData || {
        id: 'd0f55e6f-9cb7-49ca-b6c6-718c4ea698e3',
        full_name: 'فاطمة علي السعد',
        field: 'تطوير المواقع الإلكترونية',
        average_rating: 4.9
      };

      // 1. Add user to paid_users table
      await supabaseService.addPaidUser({
        phone_number: from,
        whatsapp_name: name,
        freelancer_id: freelancerData.id,
        freelancer_name: freelancerData.full_name,
        payment_amount: 300,
        invoice_id: paymentData?.invoiceId || `MOCK_${Date.now()}`,
        payment_method: 'mock_test',
        transaction_id: `TXN_MOCK_${Date.now()}`
      });
      logger.info('✅ Added user to paid_users table', { from });

      // 2. Reset payment state to normal
      await supabaseService.setUserPaymentState(from, 'normal', null);
      logger.info('✅ Reset payment state to normal', { from });

      // 3. Send success message
      const successMessage = `🎉 تم الدفع بنجاح! (اختبار تطويري)\n\n✅ تم إضافتك لقاعدة البيانات\n👤 المستقل: ${freelancerData.full_name}\n💰 المبلغ: 300 ريال\n📋 رقم الفاتورة: ${paymentData?.invoiceId}\n\n🤖 يمكنك الآن التحدث معي بشكل طبيعي!`;
      
      await whatsappService.sendMessage(from, successMessage);

      // 4. Save success message to conversation history
      await supabaseService.saveMessage(from, 'assistant', successMessage, name);

      logger.info('🎉 Mock payment completed successfully!', {
        from,
        freelancer: freelancerData.full_name,
        invoiceId: paymentData?.invoiceId,
        userState: 'normal'
      });

    } catch (error) {
      logger.error('❌ Error completing mock payment:', error);
      throw error;
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
      expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
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

      // Use Gemini AI to analyze and extract project requirements
      const analysisPrompt = `تحليل متطلبات المشروع من المحادثة التالية:

${userMessages}

استخرج المعلومات التالية بشكل موجز وواضح:
1. وصف المشروع (جملتين-3)
2. المتطلبات المحددة
3. الميزانية المتوقعة
4. الجدول الزمني
5. أي تفاصيل إضافية مهمة

أجب بهذا التنسيق بالعربية:`;

      const aiAnalysis = await geminiService.generateResponse(analysisPrompt);
      
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
   * Get the last recommended freelancer from conversation
   * @param {string} clientPhone - Client phone number
   * @param {Array} conversationHistory - Conversation history
   * @returns {Object|null} Freelancer data or null
   */
  async getLastRecommendedFreelancer(clientPhone, conversationHistory) {
    try {
      // Look for the last AI response that recommended a freelancer
      const aiMessages = conversationHistory
        .filter(msg => msg.role === 'assistant')
        .reverse(); // Start from most recent
      
      // For now, return sample freelancer data
      // In production, this should extract freelancer info from the AI response
      const sampleFreelancers = [
        {
          id: 'd0f55e6f-9cb7-49ca-b6c6-718c4ea698e3',
          full_name: 'فاطمة علي السعد',
          field: 'تطوير المواقع الإلكترونية',
          average_rating: 4.9,
          email: 'fatma.alsaad@example.com'
        },
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          full_name: 'محمد أحمد العتيبي',
          field: 'تصميم جرافيك وشعارات',
          average_rating: 4.7,
          email: 'mohammed.alotaibi@example.com'
        }
      ];
      
      // Return a random freelancer for demo purposes
      const randomIndex = Math.floor(Math.random() * sampleFreelancers.length);
      return sampleFreelancers[randomIndex];
      
    } catch (error) {
      logger.error('Error getting recommended freelancer:', error);
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
      const whyChosenPrompt = `بناءً على متطلبات المشروع التالية: ${projectContext.description}

وضح في 2-3 جمل لماذا تم اختيار هذا المستقل بشكل شخصي ومحترف:`;
      
      const whyChosen = await geminiService.generateResponse(whyChosenPrompt) || 
        'تم اختيارك بناءً على خبرتك وتقييماتك الممتازة';

      // Create notification record in database
      const { data, error } = await supabaseService.supabase
        .from('client_freelancer_notifications')
        .insert({
          freelancer_id: freelancerId,
          client_whatsapp_phone: clientPhone,
          client_name: clientName,
          client_email: null, // Could be extracted from profile if available
          project_description: projectContext.description,
          project_requirements: projectContext.requirements,
          estimated_budget: projectContext.estimatedBudget,
          timeline_expectation: 'غير محدد', // Could be extracted from conversation
          why_chosen: whyChosen,
          conversation_summary: projectContext.conversationSummary,
          ai_recommendation_reason: 'تم الاختيار بناءً على تحليل ذكي لمتطلبات العميل',
          payment_amount: paymentAmount,
          payment_status: 'pending',
          myfatoorah_invoice_id: invoiceId,
          selection_date: new Date().toISOString(),
          is_read: false,
          is_archived: false
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating freelancer notification:', error);
        throw error;
      }

      logger.info('✅ Freelancer notification created successfully', {
        notificationId: data.id,
        freelancerId,
        clientPhone,
        projectType: projectContext.description.substring(0, 50)
      });

      return data;
      
    } catch (error) {
      logger.error('❌ Failed to create freelancer notification:', error);
      throw error;
    }
  }
}

export const messageProcessor = new MessageProcessor();
