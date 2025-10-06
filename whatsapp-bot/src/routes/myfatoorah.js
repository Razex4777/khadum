import express from 'express';
import { myfatoorahService } from '../services/myfatoorahService.js';
import { supabaseService } from '../services/supabaseService.js';
import { whatsappService } from '../services/whatsappService.js';
import { paymentExpirationService } from '../services/paymentExpirationService.js';
import { logger } from '../utils/logger.js';

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

    if (webhookResult.success && webhookResult.isPaid) {
      // Update payment status in database
      const paymentRecord = await supabaseService.updatePaymentStatus(
        webhookResult.invoiceId,
        webhookResult
      );

      if (paymentRecord) {
        // Clear user payment state first - allow bot to respond again
        await supabaseService.clearUserPaymentState(paymentRecord.client_id);

        // Send success message to client via WhatsApp
        const successMessage = myfatoorahService.formatSuccessMessage({
          paidAmount: webhookResult.paidAmount,
          paidDate: webhookResult.paidDate,
          invoiceId: webhookResult.invoiceId
        });

        await whatsappService.sendMessage(paymentRecord.client_id, successMessage);

        // Save success message to conversation history
        await supabaseService.saveMessage(
          paymentRecord.client_id, 
          'assistant', 
          successMessage, 
          paymentRecord.client_name
        );

        logger.info('🎉 Payment processed successfully', {
          invoiceId: webhookResult.invoiceId,
          clientPhone: paymentRecord.client_id,
          amount: webhookResult.paidAmount
        });

        res.status(200).json({ 
          success: true, 
          message: 'Payment processed successfully' 
        });
      } else {
        logger.error('❌ Payment record not found for invoice:', webhookResult.invoiceId);
        res.status(404).json({ 
          success: false, 
          message: 'Payment record not found' 
        });
      }
    } else {
      logger.warn('⚠️ Payment not confirmed in webhook', webhookResult);
      res.status(400).json({ 
        success: false, 
        message: 'Payment not confirmed' 
      });
    }

  } catch (error) {
    logger.error('❌ Error processing MyFatoorah callback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

/**
 * MyFatoorah payment error callback
 * Handles failed payment notifications
 */
router.post('/error', async (req, res) => {
  try {
    logger.warn('⚠️ MyFatoorah error callback received', req.body);

    // You can add logic here to handle payment failures
    // For example, notify the client about the failed payment

    res.status(200).json({ 
      success: true, 
      message: 'Error callback received' 
    });

  } catch (error) {
    logger.error('❌ Error processing MyFatoorah error callback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
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

        // Send success message to client
        const successMessage = myfatoorahService.formatSuccessMessage({
          paidAmount: verification.paidAmount,
          paidDate: verification.paidDate,
          invoiceId: invoiceId
        });

        await whatsappService.sendMessage(paymentRecord.client_id, successMessage);

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
 */
router.post('/check-expired', async (req, res) => {
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
 */
router.get('/expiration-status', (req, res) => {
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