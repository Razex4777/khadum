import dotenv from 'dotenv';

dotenv.config();

export const config = {
  whatsapp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneId: process.env.WHATSAPP_PHONE_ID,
    apiUrl: 'https://graph.facebook.com/v18.0',
    messageLimit: 20 // 20-message conversation memory per user
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    timeout: parseInt(process.env.GEMINI_TIMEOUT) || 8000,
    model: 'gemini-1.5-flash',
    maxOutputTokens: 1024,
    temperature: 0.7,
    // Analysis specific configs
    analysisMaxTokens: 300,
    analysisTemperature: 0.3,
    analysisTopK: 10,
    analysisTopP: 0.8,
    // Response specific configs
    responseMaxTokens: 500,
    responseTemperature: 0.8,
    responseTopK: 20,
    responseTopP: 0.9
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    tableName: 'chat_history'
  },
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    allowDevCommands: process.env.ALLOW_DEV_COMMANDS === 'true' || process.env.NODE_ENV === 'development'
  },
  mockPayment: {
    enabled: process.env.ENABLE_MOCK_PAYMENTS === 'true' || process.env.NODE_ENV !== 'production',
    invoiceSeed: parseInt(process.env.MOCK_INVOICE_SEED) || 2000000,
    portalUrl: process.env.MOCK_PORTAL_URL || 'https://portal.myfatoorah.com/ar/KSA/PayInvoice',
    expiryHours: parseInt(process.env.MOCK_PAYMENT_EXPIRY_HOURS) || 12,
    apiDelayMs: parseInt(process.env.MOCK_API_DELAY_MS) || 500,
    successMessage: process.env.MOCK_SUCCESS_MESSAGE || '✅ تم إنشاء وإكمال الدفع تلقائياً\n📋 رقم الفاتورة: {invoiceId}\n⚡ جاري معالجة البيانات...'
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:8080'
  },
  myfatoorah: {
    apiKey: process.env.MYFATOORAH_API_KEY, // Use the main API key for authentication
    baseUrl: process.env.MYFATOORAH_BASE_URL || 'https://api-sa.myfatoorah.com/v2', // Saudi Arabia API URL
    webhookSecret: process.env.MYFATOORAH_WEBHOOK_SECRET,
    defaultAmount: 300.00,
    currency: 'SAR'
  }
};

// Validate required environment variables
export function validateConfig() {
  const required = [
    'WHATSAPP_VERIFY_TOKEN',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_ID',
    'GEMINI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'MYFATOORAH_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  
  return true;
}

// Validate config on module load
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error.message);
  // Don't throw in development to allow testing
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
}