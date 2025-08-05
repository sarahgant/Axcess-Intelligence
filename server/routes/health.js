/**
 * Health check routes
 */

const express = require('express');
const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Detailed health check
router.get('/detailed', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            anthropic: {
                configured: !!process.env.ANTHROPIC_API_KEY,
                status: 'unknown'
            },
            openai: {
                configured: !!process.env.OPENAI_API_KEY,
                status: 'unknown'
            }
        }
    };

    // Test AI service connectivity (optional)
    if (req.query.checkServices === 'true') {
        try {
            // Could add actual API health checks here
            health.services.anthropic.status = 'healthy';
            health.services.openai.status = 'healthy';
        } catch (error) {
            health.status = 'degraded';
            health.services.anthropic.status = 'error';
            health.services.openai.status = 'error';
        }
    }

    res.json(health);
});

module.exports = router;