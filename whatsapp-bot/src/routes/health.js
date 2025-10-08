import express from 'express';
import { supabaseService } from '../services/supabaseservice/index.js';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * GET /health - Health check endpoint
 */
router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.server.nodeEnv,
      services: {
        server: 'running',
        whatsapp: 'configured',
        gemini: 'configured',
        supabase: 'checking...'
      }
    };

    // Check Supabase connection
    try {
      const testUserId = 'health_check_test';
      const count = await supabaseService.getMessageCount(testUserId);
      healthStatus.services.supabase = 'connected';
      healthStatus.dbMessageCount = count;
    } catch (error) {
      healthStatus.services.supabase = 'error';
      healthStatus.dbError = error.message;
    }

    // Overall health status
    const allHealthy = Object.values(healthStatus.services).every(
      status => status !== 'error'
    );
    
    healthStatus.healthy = allHealthy;

    res.status(allHealthy ? 200 : 503).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /health/detailed - Detailed health information
 */
router.get('/detailed', async (req, res) => {
  try {
    const detailed = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: process.uptime(),
        formatted: formatUptime(process.uptime())
      },
      memory: process.memoryUsage(),
      environment: {
        node: process.version,
        platform: process.platform,
        env: config.server.nodeEnv,
        port: config.server.port
      },
      configuration: {
        whatsapp: {
          configured: Boolean(config.whatsapp.accessToken),
          phoneId: config.whatsapp.phoneId ? 'configured' : 'missing',
          messageLimit: config.whatsapp.messageLimit
        },
        gemini: {
          configured: Boolean(config.gemini.apiKey),
          model: config.gemini.model,
          timeout: config.gemini.timeout,
          temperature: config.gemini.temperature
        },
        supabase: {
          configured: Boolean(config.supabase.url && config.supabase.anonKey),
          tableName: config.supabase.tableName
        }
      }
    };

    res.json(detailed);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Format uptime in human-readable format
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export { router as healthRouter };
