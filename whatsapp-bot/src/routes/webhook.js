import express from 'express';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { whatsappService } from '../services/whatsappService.js';
import { messageProcessor } from '../controllers/messageProcessor.js';
import { mediaHandler } from '../services/mediaHandler.js';

const router = express.Router();

/**
 * GET /webhook - Webhook verification endpoint
 * Used by WhatsApp to verify the webhook URL
 */
router.get('/', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    logger.info('Webhook verification request received', { mode, token, challenge });

    if (mode && token) {
      if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
        logger.info('✅ Webhook verified successfully');
        res.status(200).send(challenge);
      } else {
        logger.warn('❌ Webhook verification failed - invalid token');
        res.sendStatus(403);
      }
    } else {
      logger.warn('❌ Webhook verification failed - missing parameters');
      res.sendStatus(400);
    }
  } catch (error) {
    logger.error('Error in webhook verification:', error);
    res.sendStatus(500);
  }
});

/**
 * POST /webhook - Receive messages from WhatsApp
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    
    // Log the incoming webhook
    logger.debug('Webhook received', { 
      object: body.object,
      entryCount: body.entry?.length 
    });

    // Validate webhook payload
    if (body.object !== 'whatsapp_business_account') {
      logger.warn('Invalid webhook object type', { object: body.object });
      return res.sendStatus(404);
    }

    // Process each entry
    if (body.entry && body.entry.length > 0) {
      for (const entry of body.entry) {
        // Process changes
        if (entry.changes && entry.changes.length > 0) {
          for (const change of entry.changes) {
            await processWebhookChange(change);
          }
        }
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    res.sendStatus(200);
  } catch (error) {
    logger.error('Error processing webhook:', error);
    // Still return 200 to prevent WhatsApp from retrying
    res.sendStatus(200);
  }
});

/**
 * Process individual webhook change
 * @param {Object} change - Webhook change object
 */
async function processWebhookChange(change) {
  try {
    if (change.field !== 'messages') {
      logger.debug('Ignoring non-message change', { field: change.field });
      return;
    }

    const value = change.value;

    // Handle message status updates
    if (value.statuses && value.statuses.length > 0) {
      await messageProcessor.processStatusUpdate({ entry: [{ changes: [change] }] });
      return;
    }

    // Handle incoming messages
    if (value.messages && value.messages.length > 0) {
      for (const message of value.messages) {
        // Handle different message types
        if (message.type === 'text' || message.type === 'interactive') {
          // Process text and interactive messages
          const messageData = whatsappService.extractMessageData({ 
            entry: [{ 
              changes: [{ 
                value: { 
                  messages: [message], 
                  contacts: value.contacts 
                } 
              }] 
            }] 
          });

          if (messageData) {
            await messageProcessor.processMessage(messageData);
          }
        } else if (['image', 'video', 'audio', 'document', 'sticker'].includes(message.type)) {
          // Process media messages
          await processMediaMessage(message, value.contacts);
        } else {
          logger.info(`Ignoring unsupported message type: ${message.type}`);
          await whatsappService.sendMessage(
            message.from,
            '📝 عذراً، نوع الرسالة غير مدعوم حالياً. يرجى إرسال رسالة نصية أو ملف مدعوم!'
          );
        }
      }
    }
  } catch (error) {
    logger.error('Error processing webhook change:', error);
  }
}

/**
 * Process media message
 * @param {Object} message - WhatsApp message object
 * @param {Array} contacts - Contact information
 */
async function processMediaMessage(message, contacts) {
  try {
    const contact = contacts?.[0];
    const name = contact?.profile?.name || 'User';
    
    logger.info(`📎 Processing ${message.type} from ${name} (${message.from})`);

    // Extract media data
    const mediaData = mediaHandler.extractMediaData(message);
    if (!mediaData) {
      logger.warn('Could not extract media data from message', { messageId: message.id });
      return;
    }

    // Create message data object
    const messageData = {
      messageId: message.id,
      from: message.from,
      name: name,
      type: message.type,
      mediaType: mediaData.mediaType,
      mediaId: mediaData.mediaId,
      mimeType: mediaData.mimeType,
      caption: mediaData.caption,
      timestamp: message.timestamp
    };

    // Process the media message
    await mediaHandler.processMediaMessage(messageData);

  } catch (error) {
    logger.error('Error processing media message:', error);
    await whatsappService.sendMessage(
      message.from,
      '❌ حدث خطأ في معالجة الملف\n❌ Error processing media file'
    );
  }
}

export { router as webhookRouter };
