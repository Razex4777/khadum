import axios from 'axios';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

/**
 * MyFatoorah Payment Service
 * Based on official MyFatoorah API v2 documentation
 * Supports both live and test environments
 */

class MyFatoorahService {
  constructor() {
    // Live Saudi Arabia API configuration only
    this.apiKey = process.env.MYFATOORAH_API_KEY;
    this.baseUrl = 'https://api-sa.myfatoorah.com';
    this.currency = 'SAR';

    if (!this.apiKey) {
      throw new Error('MYFATOORAH_API_KEY is required for live mode');
    }

    console.log('MyFatoorah Service initialized: LIVE mode only');
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Currency: ${this.currency}`);
  }

  /**
   * Get axios configuration with proper headers
   */
  getConfig() {
    return {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    };
  }

  /**
   * Generate payment link for client using correct MyFatoorah API
   * @param {Object} paymentData - Payment information
   * @returns {Object} Payment link and transaction details
   */
  async generatePaymentLink(paymentData) {
    try {
      const { clientPhone, clientName, freelancerData, amount = 300 } = paymentData;

      logger.debug('🔗 Generating MyFatoorah payment link', {
        clientPhone,
        clientName,
        amount,
        freelancerName: freelancerData.full_name
      });

      // Try real MyFatoorah API first with correct endpoint
      try {
        // Clean phone number for MyFatoorah (remove country code, max 11 chars)
        const cleanPhone = clientPhone.replace(/[^\d]/g, '').slice(-11); // Take last 11 digits
        
        const payload = {
          CustomerName: clientName,
          NotificationOption: "Lnk", // Link only for better compatibility
          InvoiceValue: amount,
          DisplayCurrencyIso: this.currency,
          CustomerMobile: cleanPhone,
          CustomerEmail: `${clientPhone.replace(/[^\d]/g, '')}@temp.khadum.com`,
          CallBackUrl: `${process.env.WEBHOOK_BASE_URL || 'https://khadum.com'}/webhook/myfatoorah/callback`,
          ErrorUrl: `${process.env.WEBHOOK_BASE_URL || 'https://khadum.com'}/webhook/myfatoorah/error`,
          Language: 'AR',
          CustomerReference: `KHADUM_${Date.now()}`,
          UserDefinedField: JSON.stringify({
            clientPhone,
            clientName,
            freelancerId: freelancerData.id,
            freelancerName: freelancerData.full_name,
            platform: 'khadum_whatsapp'
          }),
          InvoiceItems: [
            {
              ItemName: `Service from freelancer: ${freelancerData.full_name}`,
              Quantity: 1,
              UnitPrice: amount
            }
          ]
        };

        console.log('📤 Sending request to MyFatoorah LIVE API...');
        console.log(`URL: ${this.baseUrl}/v2/SendPayment`);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(
          `${this.baseUrl}/v2/SendPayment`,
          payload,
          this.getConfig()
        );

        if (response.data.IsSuccess) {
          const paymentData = response.data.Data;

          logger.info('✅ LIVE MyFatoorah payment link generated successfully', {
            invoiceId: paymentData.InvoiceId,
            paymentUrl: paymentData.InvoiceURL,
            clientPhone
          });

          return {
            success: true,
            invoiceId: paymentData.InvoiceId,
            paymentUrl: paymentData.InvoiceURL,
            invoiceReference: paymentData.CustomerReference,
            expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            isReal: true
          };
        } else {
          throw new Error(`MyFatoorah Error: ${response.data.Message}`);
        }

      } catch (realApiError) {
        logger.error('❌ MyFatoorah LIVE API failed:', {
          error: realApiError.message,
          status: realApiError.response?.status,
          data: realApiError.response?.data
        });

        // Return error instead of fallback
        throw new Error(`MyFatoorah API Error: ${realApiError.response?.data?.Message || realApiError.message}`);
      }

    } catch (error) {
      logger.error('❌ Failed to generate payment link:', error);
      throw error; // Propagate error instead of fallback
    }
  }

  /**
   * Verify payment status using correct API endpoint
   * @param {string} invoiceId - MyFatoorah invoice ID
   * @returns {Object} Payment verification result
   */
  async verifyPayment(invoiceId) {
    try {
      logger.debug('🔍 Verifying MyFatoorah payment', { invoiceId });

      const response = await axios.get(
        `${this.baseUrl}/v2/GetPaymentStatus`,
        {
          ...this.getConfig(),
          params: {
            InvoiceId: invoiceId
          }
        }
      );

      if (response.data.IsSuccess) {
        const paymentData = response.data.Data;

        logger.debug('✅ Payment verification successful', {
          invoiceId,
          status: paymentData.InvoiceStatus,
          paidAmount: paymentData.InvoiceValue
        });

        return {
          success: true,
          isPaid: paymentData.InvoiceStatus === 'Paid',
          status: paymentData.InvoiceStatus,
          paidAmount: paymentData.InvoiceValue,
          currency: paymentData.CurrencyIso,
          customerReference: paymentData.CustomerReference,
          userDefinedField: paymentData.UserDefinedField ? JSON.parse(paymentData.UserDefinedField) : null,
          paidDate: paymentData.CreatedDate
        };
      } else {
        logger.error('❌ MyFatoorah payment verification failed', response.data);
        return {
          success: false,
          error: response.data.Message
        };
      }

    } catch (error) {
      logger.error('❌ Failed to verify MyFatoorah payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process webhook notification from MyFatoorah
   * @param {Object} webhookData - Webhook payload
   * @returns {Object} Processed webhook result
   */
  async processWebhook(webhookData) {
    try {
      logger.debug('📨 Processing MyFatoorah webhook', webhookData);

      // Extract invoice ID from webhook
      const invoiceId = webhookData.InvoiceId || webhookData.Data?.InvoiceId;

      if (!invoiceId) {
        throw new Error('Invoice ID not found in webhook data');
      }

      // Verify the payment status
      const verification = await this.verifyPayment(invoiceId);

      if (verification.success && verification.isPaid) {
        logger.info('🎉 Payment confirmed via webhook', {
          invoiceId,
          amount: verification.paidAmount,
          clientData: verification.userDefinedField
        });

        return {
          success: true,
          isPaid: true,
          invoiceId,
          clientData: verification.userDefinedField,
          paidAmount: verification.paidAmount,
          paidDate: verification.paidDate
        };
      } else {
        logger.warn('⚠️ Webhook received but payment not confirmed', {
          invoiceId,
          status: verification.status
        });

        return {
          success: false,
          isPaid: false,
          invoiceId,
          status: verification.status
        };
      }

    } catch (error) {
      logger.error('❌ Failed to process MyFatoorah webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test the service connectivity
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      console.log('Testing MyFatoorah connection...');

      const result = await this.getPaymentMethods(1);

      if (result.success) {
        console.log('✅ MyFatoorah connection successful');
        return true;
      } else {
        console.error('❌ MyFatoorah connection failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Get available payment methods
   * @param {number} amount - Invoice amount
   * @returns {Promise<Object>} Available payment methods
   */
  async getPaymentMethods(amount = 100) {
    try {
      console.log('Getting available payment methods...');

      const payload = {
        InvoiceAmount: amount,
        CurrencyIso: this.currency
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/InitiatePayment`,
        payload,
        this.getConfig()
      );

      if (response.data.IsSuccess) {
        console.log(`✅ Retrieved ${response.data.Data.PaymentMethods.length} payment methods`);

        const methods = response.data.Data.PaymentMethods.map(method => ({
          id: method.PaymentMethodId,
          nameEn: method.PaymentMethodEn,
          nameAr: method.PaymentMethodAr,
          code: method.PaymentMethodCode,
          serviceCharge: method.ServiceCharge,
          totalAmount: method.TotalAmount,
          isDirectPayment: method.IsDirectPayment,
          imageUrl: method.ImageUrl,
          currency: method.CurrencyIso
        }));

        return {
          success: true,
          paymentMethods: methods,
          data: response.data.Data
        };
      } else {
        console.error('❌ Error getting payment methods:', response.data.Message);
        return {
          success: false,
          error: response.data.Message
        };
      }

    } catch (error) {
      console.error('❌ Error getting payment methods:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Format payment link message for WhatsApp
   * @param {Object} paymentLinkData - Payment link information
   * @param {Object} freelancerData - Freelancer information
   * @returns {string} Formatted WhatsApp message
   */
  formatPaymentMessage(paymentLinkData, freelancerData) {
    return `🎉 تم اختيار المستقل بنجاح!

👤 المستقل المختار: ${freelancerData.full_name}
⭐ التقييم: ${freelancerData.average_rating}/5
💼 التخصص: ${freelancerData.field}

💰 قيمة الخدمة: ${config.myfatoorah.defaultAmount} ريال سعودي

🔗 رابط الدفع الآمن:
${paymentLinkData.paymentUrl}

⚠️ تنبيه مهم:
• لا تغير اسم المستخدم في الواتساب
• لا تغير رقم الهاتف
• هذا ضروري للتحقق من الدفع

⏰ صالح حتى: ${new Date(paymentLinkData.expiryDate).toLocaleString('ar-SA')}

بعد الدفع سيتم إشعارك تلقائياً ✅`;
  }

  /**
   * Format payment success message
   * @param {Object} paymentData - Payment confirmation data
   * @returns {string} Success message
   */
  formatSuccessMessage(paymentData) {
    return `🎉 تم الدفع بنجاح!

✅ تأكيد الدفع:
   • المبلغ: ${paymentData.paidAmount} ريال سعودي
   • التاريخ: ${new Date(paymentData.paidDate).toLocaleString('ar-SA')}
   • رقم العملية: ${paymentData.invoiceId}

🚀 الخطوات التالية:
1️⃣ سيتم إشعار المستقل بطلبك
2️⃣ سيتواصل معك المستقل قريباً
3️⃣ ستبدأ العمل على مشروعك

شكراً لاستخدامك منصة خدوم! 🌟`;
  }
}

export const myfatoorahService = new MyFatoorahService();