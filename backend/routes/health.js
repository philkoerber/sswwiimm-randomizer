const express = require('express');
const router = express.Router();

// GET /api/health
// Health check endpoint
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// GET /api/health/ready
// Readiness check endpoint
router.get('/ready', (req, res) => {
    // Add any readiness checks here (database connections, external services, etc.)
    res.json({
        status: 'ready',
        timestamp: new Date().toISOString()
    });
});

// GET /api/health/live
// Liveness check endpoint
router.get('/live', (req, res) => {
    res.json({
        status: 'alive',
        timestamp: new Date().toISOString()
    });
});

module.exports = router; 