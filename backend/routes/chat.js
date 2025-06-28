const express = require('express');
const router = express.Router();
const { ChatService } = require('../services/chatService');

const chatService = new ChatService();

// POST /api/chat/query
// Process a voice-to-text query from the frontend
router.post('/query', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await chatService.processQuery(message, sessionId);

        res.json({
            success: true,
            response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chat query error:', error);
        res.status(500).json({
            error: 'Failed to process chat query',
            message: error.message
        });
    }
});

// POST /api/chat/session
// Create a new chat session
router.post('/session', async (req, res) => {
    try {
        const session = await chatService.createSession();

        res.json({
            success: true,
            sessionId: session.sessionId,
            message: 'Session created successfully'
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            error: 'Failed to create session',
            message: error.message
        });
    }
});

// GET /api/chat/session/:sessionId
// Get session information
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = chatService.getSession(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({
            success: true,
            session: {
                sessionId: session.sessionId,
                messageCount: session.messages.length,
                createdAt: session.createdAt,
                lastActivity: session.lastActivity
            }
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({
            error: 'Failed to get session',
            message: error.message
        });
    }
});

module.exports = router; 