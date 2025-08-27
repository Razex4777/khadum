import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { webhookRouter } from './routes/webhook.js';
import { healthRouter } from './routes/health.js';
import { myfatoorahRouter } from './routes/myfatoorah.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/webhook', webhookRouter);
app.use('/health', healthRouter);
app.use('/myfatoorah', myfatoorahRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'WhatsApp Gemini Chatbot API is running!',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhook',
      health: '/health',
      myfatoorah: '/myfatoorah'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`🤖 WhatsApp Gemini Chatbot is ready!`);
  logger.info(`📍 Webhook URL: http://localhost:${PORT}/webhook`);
});

export default app;
