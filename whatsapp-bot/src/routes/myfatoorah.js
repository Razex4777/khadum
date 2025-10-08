import express from 'express';
import { myfatoorahService } from '../services/myfatoorahService.js';
import { supabaseService } from '../services/supabaseservice/index.js';
import { whatsappService } from '../services/whatsappService.js';
import { conversationService } from '../services/conversationService.js';
import { paymentExpirationService } from '../services/paymentExpirationService.js';
import { bridgeModeService } from '../services/bridgeModeService.js';
import { logger } from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * MyFatoorah payment callback webhook
 * Handles successful payment notifications
 */
router.post('/callback', async (req, res) => {
  try {
    logger.info('📨 MyFatoorah callback received', req.body);

    // Process the webhook
    const webhookResult = await myfatoorahService.processWebhook(req.body);
    const { invoiceId } = webhookResult;

    if (webhookResult.success && webhookResult.isPaid) {
      // Update payment status in database
      const paymentRecord = await supabaseService.updatePaymentStatus(
        invoiceId,
        webhookResult
      );

      if (paymentRecord) {
        // Clear user payment state first - allow bot to respond again
        await supabaseService.clearUserPaymentState(paymentRecord.client_id);

        // Extract freelancer data for notification purposes only
        const freelancerData = paymentRecord.paid_to_freelancers?.[0] || null;

        // Defer sending success message until after activating bridge mode (to consolidate notices)

        // Save success message to conversation history with metadata
        await supabaseService.saveMessage(
          paymentRecord.client_id,
          'assistant',
          successMessage,
          paymentRecord.client_name,
          {
            type: 'payment_success',
            isPayment: true,
            invoiceId: webhookResult.invoiceId,
            amount: webhookResult.paidAmount
          }
        );

        // Create conversation for the payment
        try {
          const conversationResult = await conversationService.createConversationForPayment(
            paymentRecord,
            webhookResult
          );

          if (conversationResult.success) {
            logger.info('✅ Payment webhook: Conversation created/updated', {
              conversationId: conversationResult.conversationId,
              existed: conversationResult.existed
            });
          }
        } catch (conversationError) {
          logger.error('❌ Payment webhook: Failed to create conversation, continuing:', conversationError);
          // Don't fail the entire payment process if conversation creation fails
        }

        // Automatically activate bridge mode between client and freelancer
        try {
          if (freelancerData && freelancerData.whatsapp_number) {
            // Get freelancer phone and ISO country code from database
            const { data: freelancerRecord, error: freelancerError } = await supabaseService.supabase
              .from('freelancers')
              .select('whatsapp_number, country_code, phone_dial_code')
              .eq('id', freelancerData.id)
              .single();

            if (!freelancerError && freelancerRecord) {
              // Determine dial code: prefer stored phone_dial_code, else map from ISO
              const ISO_TO_DIAL = { SA:'966', DZ:'213', AE:'971', EG:'20', MA:'212', TN:'216', JO:'962', LB:'961', KW:'965', QA:'974', BH:'973', OM:'968', IQ:'964', SY:'963', YE:'967', LY:'218', SD:'249' };
              const full = String(freelancerRecord.whatsapp_number || '').replace(/\D/g, '');
              const dialCode = (freelancerRecord.phone_dial_code || '').replace(/\D/g, '') || ISO_TO_DIAL[freelancerRecord.country_code] || '';
              const localPhone = dialCode && full.startsWith(dialCode) ? full.substring(dialCode.length) : full;

              // Activate bridge mode between client and freelancer using correct dial code
              const bridgeResult = await bridgeModeService.startBridgeMode(
                paymentRecord.client_id, // Client phone
                dialCode || '966',
                localPhone
              );

              if (bridgeResult.success) {
                logger.info('🌉 Bridge mode automatically activated after payment', {
                  client: paymentRecord.client_id,
                  freelancer: freelancerRecord.whatsapp_number,
                  bridgeResult
                });

                // Send single consolidated message to client (payment success + bridge notice)
                const consolidatedMessage = myfatoorahService.formatSuccessMessage({
                  paidAmount: webhookResult.paidAmount,
                  paidDate: webhookResult.paidDate,
                  invoiceId: webhookResult.invoiceId
                }, freelancerData, paymentRecord.client_name, { includeBridgeNotice: true });

                await whatsappService.sendMessage(paymentRecord.client_id, consolidatedMessage);

                // Notify freelancer briefly
                const freelancerNotice = `🌉 تم تفعيل وضع الجسر التلقائي مع ${paymentRecord.client_name}. سيتم توجيه الرسائل عبر النظام.`;
                await whatsappService.sendMessage(freelancerRecord.whatsapp_number, freelancerNotice);
              } else {
                logger.warn('⚠️ Failed to activate bridge mode automatically', {
                  error: bridgeResult.error,
                  client: paymentRecord.client_id,
                  freelancer: freelancerData.id
                });
              }
            } else {
              logger.warn('⚠️ Could not find freelancer record for bridge mode activation', {
                freelancerId: freelancerData.id,
                error: freelancerError?.message
              });
            }
          }
        } catch (bridgeError) {
          logger.error('❌ Error activating bridge mode after payment:', bridgeError);
          // Don't fail the entire payment process if bridge mode activation fails
        }

        logger.info('✅ Payment webhook processed successfully', { invoiceId });
        return res.status(200).json({ status: 'success' });

      } else {
        logger.error('❌ Payment record not found for invoice:', invoiceId);
        return res.status(404).json({ status: 'error', reason: 'Payment record not found' });
      }
    } else {
      logger.warn('⚠️ Payment not confirmed in webhook', webhookResult);
      return res.status(400).json({ status: 'error', reason: 'Payment not confirmed' });
    }

  } catch (error) {
    logger.error('❌ Error processing MyFatoorah callback:', error);
    res.status(500).json({ status: 'error', reason: 'Internal server error' });
  }
});

/**
 * MyFatoorah payment error callback
 * Handles failed payment notifications
 */
router.post('/error', async (req, res) => {
  try {
    logger.warn('⚠️ MyFatoorah error callback received', req.body);

    // Process the webhook
    const webhookResult = await myfatoorahService.processWebhook(req.body);
    const { invoiceId } = webhookResult;

    // Create conversation for the payment
    try {
      const conversationResult = await conversationService.createConversationForPayment(
        paymentRecord,
        webhookResult
      );

      if (conversationResult.success) {
        logger.info('✅ Payment error webhook: Conversation created/updated', {
          conversationId: conversationResult.conversationId,
          existed: conversationResult.existed
        });
      }
    } catch (conversationError) {
      logger.error('❌ Payment error webhook: Failed to create conversation, continuing:', conversationError);
      // Don't fail the entire payment process if conversation creation fails
    }

    // REMOVED: Conversation bridge activation

    logger.info('✅ Payment error webhook processed successfully', { invoiceId });
    return res.status(200).json({ status: 'success' });

  } catch (error) {
    logger.error('❌ Error processing MyFatoorah error callback:', error);
    res.status(500).json({ status: 'error', reason: 'Internal server error' });
  }
});

/**
 * Manual payment verification endpoint
 * For testing or manual verification
 */
router.post('/verify/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    logger.info('🔍 Manual payment verification requested', { invoiceId });

    const verification = await myfatoorahService.verifyPayment(invoiceId);

    if (verification.success && verification.isPaid) {
      // Update payment status
      const paymentRecord = await supabaseService.updatePaymentStatus(invoiceId, verification);

      if (paymentRecord) {
        // Clear user payment state - allow bot to respond again
        await supabaseService.clearUserPaymentState(paymentRecord.client_id);

        // Extract freelancer data for notification purposes only
        const freelancerData = paymentRecord.paid_to_freelancers?.[0] || null;

        // Send success message to client
        const successMessage = myfatoorahService.formatSuccessMessage({
          paidAmount: verification.paidAmount,
          paidDate: verification.paidDate,
          invoiceId: invoiceId
        }, freelancerData, paymentRecord.client_name);

        await whatsappService.sendMessage(paymentRecord.client_id, successMessage);

        // Create conversation for the payment
        try {
          const conversationResult = await conversationService.createConversationForPayment(
            paymentRecord,
            verification
          );

          if (conversationResult.success) {
            logger.info('✅ Conversation created/updated for payment verification', {
              conversationId: conversationResult.conversationId,
              existed: conversationResult.existed
            });
          }
        } catch (conversationError) {
          logger.error('❌ Failed to create conversation during verification, continuing:', conversationError);
          // Don't fail the entire verification process if conversation creation fails
        }

        res.status(200).json({
          success: true,
          message: 'Payment verified and processed',
          paymentData: verification
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Payment record not found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not confirmed',
        verification
      });
    }

  } catch (error) {
    logger.error('❌ Error in manual payment verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Manual payment expiration check endpoint
 * For testing and manual cleanup
 * Protected by authentication
 */
router.post('/check-expired', requireAuth, async (req, res) => {
  try {
    logger.info('🔧 Manual payment expiration check requested');
    
    await paymentExpirationService.manualCheck();
    
    res.status(200).json({
      success: true,
      message: 'Expired payments check completed'
    });
    
  } catch (error) {
    logger.error('❌ Error in manual expiration check:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get payment expiration service status
 * Protected by authentication
 */
router.get('/expiration-status', requireAuth, (req, res) => {
  try {
    const status = paymentExpirationService.getStatus();
    
    res.status(200).json({
      success: true,
      ...status
    });
    
  } catch (error) {
    logger.error('❌ Error getting expiration service status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export { router as myfatoorahRouter };