import axios from 'axios';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

class WhatsAppService {
  constructor() {
    this.baseUrl = `${config.whatsapp.apiUrl}/${config.whatsapp.phoneId}/messages`;
    this.accessToken = config.whatsapp.accessToken;
  }

  /**
   * Send a text message to WhatsApp user
   * @param {string} to - Recipient phone number
   * @param {string} message - Message content
   */
  async sendMessage(to, message) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: message
        }
      };

      const response = await axios.post(
        this.baseUrl,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.debug('WhatsApp message sent', { to, messageId: response.data.messages[0].id });
      return response.data;
    } catch (error) {
      logger.error('Failed to send WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Mark message as read
   * @param {string} messageId - WhatsApp message ID
   */
  async markAsRead(messageId) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      };

      await axios.post(
        this.baseUrl,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.debug('Message marked as read', { messageId });
    } catch (error) {
      logger.error('Failed to mark message as read:', error.response?.data || error.message);
    }
  }

  /**
   * Send typing indicator
   * @param {string} to - Recipient phone number
   */
  async sendTypingIndicator(to) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        typing: 'typing_on'
      };

      await axios.post(
        this.baseUrl.replace('/messages', '/typing'),
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.debug('Typing indicator sent', { to });
    } catch (error) {
      logger.warn('Failed to send typing indicator:', error.response?.data || error.message);
    }
  }

  /**
   * Send interactive buttons to WhatsApp user
   * @param {string} to - Recipient phone number
   * @param {string} bodyText - Main message text
   * @param {Array} buttons - Array of button objects
   * @param {string} headerText - Optional header text
   * @param {string} footerText - Optional footer text
   */
  async sendInteractiveButtons(to, bodyText, buttons, headerText = null, footerText = null) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: bodyText
          },
          action: {
            buttons: buttons.map((button, index) => ({
              type: 'reply',
              reply: {
                id: button.id || `btn_${index}`,
                title: button.title
              }
            }))
          }
        }
      };

      // Add header if provided
      if (headerText) {
        payload.interactive.header = {
          type: 'text',
          text: headerText
        };
      }

      // Add footer if provided
      if (footerText) {
        payload.interactive.footer = {
          text: footerText
        };
      }

      const response = await axios.post(
        this.baseUrl,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.debug('Interactive buttons sent', { to, buttonsCount: buttons.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to send interactive buttons:', error.response?.data || error.message);
      // Fallback to regular text message with button options
      const fallbackMessage = `${bodyText}\n\n${buttons.map((btn, i) => `${i + 1}. ${btn.title}`).join('\n')}`;
      return await this.sendMessage(to, fallbackMessage);
    }
  }

  /**
   * Send a reaction to a message
   * @param {string} to - Recipient phone number
   * @param {string} messageId - Message ID to react to
   * @param {string} emoji - Emoji reaction
   */
  async sendReaction(to, messageId, emoji) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'reaction',
        reaction: {
          message_id: messageId,
          emoji: emoji
        }
      };

      await axios.post(
        this.baseUrl,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.debug('Reaction sent', { to, messageId, emoji });
    } catch (error) {
      logger.warn('Failed to send reaction:', error.response?.data || error.message);
    }
  }

  /**
   * Extract message details from webhook payload
   * @param {Object} webhookData - Webhook payload
   */
  extractMessageData(webhookData) {
    try {
      if (!webhookData?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        return null;
      }

      const change = webhookData.entry[0].changes[0];
      const message = change.value.messages[0];
      const contact = change.value.contacts?.[0];

      let text = '';
      let buttonId = null;

      // Handle different message types
      if (message.type === 'text') {
        text = message.text?.body || '';
      } else if (message.type === 'interactive') {
        // Handle button responses
        if (message.interactive?.type === 'button_reply') {
          buttonId = message.interactive.button_reply.id;
          text = message.interactive.button_reply.title;
        }
      }

      return {
        messageId: message.id,
        from: message.from,
        name: contact?.profile?.name || 'User',
        text: text,
        type: message.type,
        buttonId: buttonId,
        timestamp: message.timestamp
      };
    } catch (error) {
      logger.error('Failed to extract message data:', error);
      return null;
    }
  }

  /**
   * Validate webhook signature (optional security)
   */
  validateWebhookSignature(signature, body) {
    // Implement Facebook webhook signature validation if needed
    // For now, returning true
    return true;
  }
}

export const whatsappService = new WhatsAppService();
