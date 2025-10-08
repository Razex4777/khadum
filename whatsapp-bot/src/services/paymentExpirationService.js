import { supabaseService } from './supabaseservice/index.js';
import { whatsappService } from './whatsappService.js';
import { logger } from '../utils/logger.js';

/**
 * Payment Expiration Service
 * Handles automatic cleanup of expired payments and user state management
 */
class PaymentExpirationService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkIntervalMs = 60 * 60 * 1000; // Check every hour
  }

  /**
   * Start the automatic expiration checker
   */
  start() {
    if (this.isRunning) {
      logger.warn('⚠️ Payment expiration service is already running');
      return;
    }

    logger.info('🚀 Starting payment expiration service');
    this.isRunning = true;

    // Run initial check
    this.checkExpiredPayments();

    // Set up periodic checks
    this.intervalId = setInterval(() => {
      this.checkExpiredPayments();
    }, this.checkIntervalMs);

    logger.info(`✅ Payment expiration service started (checking every ${this.checkIntervalMs / 1000 / 60} minutes)`);
  }

  /**
   * Stop the automatic expiration checker
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('⚠️ Payment expiration service is not running');
      return;
    }

    logger.info('🛑 Stopping payment expiration service');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    logger.info('✅ Payment expiration service stopped');
  }

  /**
   * Check for expired payments and handle cleanup
   */
  async checkExpiredPayments() {
    try {
      logger.debug('🔍 Checking for expired payments...');

      const expiredPayments = await supabaseService.getExpiredPayments();

      if (expiredPayments.length === 0) {
        logger.debug('✅ No expired payments found');
        return;
      }

      logger.info(`🔄 Processing ${expiredPayments.length} expired payments`);

      for (const expiredPayment of expiredPayments) {
        await this.processExpiredPayment(expiredPayment);
      }

      logger.info(`✅ Completed processing ${expiredPayments.length} expired payments`);

    } catch (error) {
      logger.error('❌ Error checking expired payments:', error);
    }
  }

  /**
   * Process a single expired payment
   * @param {Object} expiredPayment - Expired payment data
   */
  async processExpiredPayment(expiredPayment) {
    try {
      const { whatsapp_phone: userId, whatsapp_username: username, pending_payment_data } = expiredPayment;

      logger.info(`🔄 Processing expired payment for user: ${userId}`);

      // 1. Clear user payment state (allow bot to respond again)
      const stateCleared = await supabaseService.clearUserPaymentState(userId);
      
      if (stateCleared) {
        logger.debug(`✅ Payment state cleared for user: ${userId}`);
      } else {
        logger.error(`❌ Failed to clear payment state for user: ${userId}`);
        return;
      }

      // 2. Send expiration notification to user
      await this.sendExpirationNotification(userId, username);

      // 3. Delete payment message from conversation history if available
      if (pending_payment_data && pending_payment_data.messageContent) {
        const messageDeleted = await supabaseService.deleteMessageFromHistory(
          userId, 
          pending_payment_data.messageContent
        );
        
        if (messageDeleted) {
          logger.debug(`✅ Payment message deleted from history for user: ${userId}`);
        } else {
          logger.warn(`⚠️ Could not delete payment message from history for user: ${userId}`);
        }
      }

      logger.info(`✅ Successfully processed expired payment for user: ${userId}`);

    } catch (error) {
      logger.error(`❌ Error processing expired payment for user ${expiredPayment.whatsapp_phone}:`, error);
    }
  }

  /**
   * Send expiration notification to user
   * @param {string} userId - User ID (WhatsApp phone)
   * @param {string} username - WhatsApp username
   */
  async sendExpirationNotification(userId, username) {
    try {
      const expirationMessage = this.createExpirationMessage(username);

      // Send WhatsApp message
      await whatsappService.sendMessage(userId, expirationMessage);

      // Save to conversation history
      await supabaseService.saveMessage(userId, 'assistant', expirationMessage, username);

      logger.debug(`✅ Expiration notification sent to user: ${userId}`);

    } catch (error) {
      logger.error(`❌ Failed to send expiration notification to user ${userId}:`, error);
    }
  }

  /**
   * Create expiration notification message
   * @param {string} username - WhatsApp username
   * @returns {string} Formatted expiration message
   */
  createExpirationMessage(username) {
    return `⏰ انتهت صلاحية رابط الدفع

مرحباً ${username || 'عزيزي العميل'} 👋

لقد انتهت صلاحية رابط الدفع الخاص بك (12 ساعة).

🔄 ماذا تريد أن تفعل الآن؟
• يمكنك طلب مستقل جديد
• أو البحث عن خدمة أخرى
• أو طرح أي سؤال تريده

🤖 الآن يمكنني الرد على رسائلك مرة أخرى!`;
  }

  /**
   * Manually check and process expired payments (for testing)
   */
  async manualCheck() {
    logger.info('🔧 Manual expired payments check requested');
    await this.checkExpiredPayments();
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkIntervalMs,
      nextCheck: this.isRunning
        ? 'Unknown (depends on interval start time)'
        : null
    };
  }
}

export const paymentExpirationService = new PaymentExpirationService();