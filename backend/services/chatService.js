const { LlamaIndexService } = require('./llamaIndexService');

class ChatService {
    constructor() {
        this.llamaIndexService = new LlamaIndexService();
        this.sessions = new Map();
    }

    /**
     * Process a voice-to-text query using LlamaIndex
     * @param {string} message - The transcribed voice message
     * @param {string} sessionId - Session ID for conversation history
     * @returns {Promise<Object>} The chatbot response
     */
    async processQuery(message, sessionId = null) {
        try {
            // Get session context if sessionId is provided
            let sessionContext = '';
            if (sessionId && this.sessions.has(sessionId)) {
                const session = this.sessions.get(sessionId);
                sessionContext = this.buildSessionContext(session.messages);
                session.messages.push({ role: 'user', content: message });
            }

            // Process query with LlamaIndex (uses pre-loaded CSV data)
            const response = await this.llamaIndexService.query(message, sessionContext);

            // Update session if exists
            if (sessionId && this.sessions.has(sessionId)) {
                const session = this.sessions.get(sessionId);
                session.messages.push({ role: 'assistant', content: response });
                session.lastActivity = new Date();
            }

            return {
                response,
                sessionId,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error processing chat query:', error);
            throw new Error(`Failed to process query: ${error.message}`);
        }
    }

    /**
     * Create a new chat session
     * @returns {Promise<Object>} Session information
     */
    async createSession() {
        try {
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const session = {
                sessionId,
                messages: [],
                createdAt: new Date(),
                lastActivity: new Date()
            };

            this.sessions.set(sessionId, session);

            return {
                sessionId,
                message: 'Session created successfully'
            };
        } catch (error) {
            console.error('Error creating session:', error);
            throw new Error(`Failed to create session: ${error.message}`);
        }
    }

    /**
     * Get session information
     * @param {string} sessionId - Session ID
     * @returns {Object|null} Session information
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }

    /**
     * Build context from session messages
     * @param {Array} messages - Session messages
     * @returns {string} Formatted context
     */
    buildSessionContext(messages) {
        if (messages.length === 0) return '';

        const recentMessages = messages.slice(-6); // Last 6 messages for context
        return recentMessages
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');
    }

    /**
     * Clean up old sessions
     * @param {number} maxAge - Maximum age in hours
     */
    cleanupSessions(maxAge = 24) {
        const cutoff = new Date(Date.now() - maxAge * 60 * 60 * 1000);

        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.lastActivity < cutoff) {
                this.sessions.delete(sessionId);
            }
        }
    }
}

module.exports = { ChatService }; 