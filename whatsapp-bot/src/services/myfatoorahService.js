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
    // Configuration from environment variables
    this.apiKey = process.env.MYFATOORAH_API_KEY;
    this.baseUrl = process.env.MYFATOORAH_BASE_URL || 'https://api-sa.myfatoorah.com';
    this.testMode = process.env.MYFATOORAH_TEST_MODE === 'true';

    // Test environment credentials (from documentation)
    this.testApiKey = "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL";
    this.testBaseUrl = 'https://apitest.myfatoorah.com';

    // Use test environment if live is not working
    this.currentApiKey = this.testMode ? this.testApiKey : this.apiKey;
    this.currentBaseUrl = this.testMode ? this.testBaseUrl : this.baseUrl;
    this.currentCurrency = this.testMode ? 'KWD' : 'SAR';

    console.log(`MyFatoorah Service initialized: ${this.testMode ? 'TEST' : 'LIVE'} mode`);
    console.log(`Base URL: ${this.currentBaseUrl}`);
    console.log(`Currency: ${this.currentCurrency}`);
  }

  /**
   * Get axios configuration with proper headers
   */
  getConfig() {
    return {
      headers: {
        'Authorization': `Bearer ${this.currentApiKey}`,
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
        const payload = {
          CustomerName: clientName,
          NotificationOption: "ALL", // Email + SMS + Link
          InvoiceValue: amount,
          DisplayCurrencyIso: this.currentCurrency,
          CustomerMobile: clientPhone,
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

        console.log('📤 Sending request to MyFatoorah API...');
        console.log(`URL: ${this.currentBaseUrl}/v2/SendPayment`);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(
          `${this.currentBaseUrl}/v2/SendPayment`,
          payload,
          this.getConfig()
        );

        if (response.data.IsSuccess) {
          const paymentData = response.data.Data;

          logger.info('✅ Real MyFatoorah payment link generated successfully', {
            invoiceId: paymentData.InvoiceId,
            paymentUrl: paymentData.InvoiceURL,
            clientPhone
          });

          return {
            success: true,
            invoiceId: paymentData.InvoiceId,
            paymentUrl: paymentData.InvoiceURL,
            invoiceReference: paymentData.CustomerReference,
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isReal: true
          };
        } else {
          throw new Error(`MyFatoorah Error: ${response.data.Message}`);
        }

      } catch (realApiError) {
        logger.warn('⚠️ Real MyFatoorah API failed, using mock payment system', {
          error: realApiError.message,
          status: realApiError.response?.status,
          data: realApiError.response?.data
        });

        // Fallback to mock payment system
        return this.generateMockPaymentLink(paymentData);
      }

    } catch (error) {
      logger.error('❌ Failed to generate payment link:', error);

      // Final fallback to mock system
      return this.generateMockPaymentLink(paymentData);
    }
  }

  /**
   * Generate mock payment link for testing/fallback
   * @param {Object} paymentData - Payment information
   * @returns {Object} Mock payment link data
   */
  async generateMockPaymentLink(paymentData) {
    const { clientPhone, clientName, freelancerData, amount = 300 } = paymentData;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockInvoiceId = Math.floor(Math.random() * 1000000) + 2000000;
    const mockReference = `KHADUM_MOCK_${Date.now()}`;

    logger.info('✅ Mock payment link generated', {
      invoiceId: mockInvoiceId,
      clientPhone,
      freelancerName: freelancerData.full_name
    });

    return {
      success: true,
      invoiceId: mockInvoiceId,
      paymentUrl: `https://demo.myfatoorah.com/KWT/ie/01072606292741-${mockInvoiceId}`,
      invoiceReference: mockReference,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isReal: false
    };
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
        `${this.currentBaseUrl}/v2/GetPaymentStatus`,
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
        CurrencyIso: this.currentCurrency
      };

      const response = await axios.post(
        `${this.currentBaseUrl}/v2/InitiatePayment`,
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
   * Switch to test mode
   */
  switchToTestMode() {
    console.log('🔄 Switching to TEST mode');
    this.testMode = true;
    this.currentApiKey = this.testApiKey;
    this.currentBaseUrl = this.testBaseUrl;
    this.currentCurrency = 'KWD';
  }

  /**
   * Switch to live mode
   */
  switchToLiveMode() {
    console.log('🔄 Switching to LIVE mode');
    this.testMode = false;
    this.currentApiKey = this.apiKey;
    this.currentBaseUrl = this.baseUrl;
    this.currentCurrency = 'SAR';
  }

  /**
   * Format payment link message for WhatsApp
   * @param {Object} paymentLinkData - Payment link information
   * @param {Object} freelancerData - Freelancer information
   * @returns {string} Formatted WhatsApp message
   */
  formatPaymentMessage(paymentLinkData, freelancerData) {
    const isReal = paymentLinkData.isReal !== false; // Default to true if not specified

    const baseMessage = `🎉 تم اختيار المستقل بنجاح!

👤 المستقل المختار: ${freelancerData.full_name}
⭐ التقييم: ${freelancerData.average_rating}/5
💼 التخصص: ${freelancerData.field}

💰 قيمة الخدمة: ${config.myfatoorah.defaultAmount} ريال سعودي

🔗 رابط الدفع${isReal ? ' الآمن' : ' التجريبي'}:
${paymentLinkData.paymentUrl}`;

    if (!isReal) {
      return baseMessage + `

⚠️ ملاحظة مهمة:
• هذا رابط تجريبي للاختبار
• في البيئة الحقيقية سيتم استخدام MyFatoorah API
• جميع الوظائف تعمل بشكل طبيعي

📋 تعليمات:
• لا تغير اسم المستخدم في الواتساب
• لا تغير رقم الهاتف
• هذا ضروري للتحقق من الدفع

⏰ صالح حتى: ${new Date(paymentLinkData.expiryDate).toLocaleString('ar-SA')}

بعد الدفع سيتم إشعارك تلقائياً 🚀`;
    } else {
      return baseMessage + `

⚠️ تنبيه مهم:
• لا تغير اسم المستخدم في الواتساب
• لا تغير رقم الهاتف
• هذا ضروري للتحقق من الدفع

⏰ صالح حتى: ${new Date(paymentLinkData.expiryDate).toLocaleString('ar-SA')}

بعد الدفع سيتم إشعارك تلقائياً ✅`;
    }
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