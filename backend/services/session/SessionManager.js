class SessionManager {
    constructor() {
        this.sessions = new Map();
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
     * Add a message to a session
     * @param {string} sessionId - Session ID
     * @param {string} role - Message role ('user' or 'assistant')
     * @param {string} content - Message content
     */
    addMessage(sessionId, role, content) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.messages.push({ role, content });
            session.lastActivity = new Date();
        }
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
     * Get session context for a session ID
     * @param {string} sessionId - Session ID
     * @returns {string} Session context
     */
    getSessionContext(sessionId) {
        const session = this.getSession(sessionId);
        if (!session) return '';

        return this.buildSessionContext(session.messages);
    }

    /**
     * Clean up old sessions
     * @param {number} maxAge - Maximum age in hours
     */
    cleanupSessions(maxAge = 24) {
        const cutoff = new Date(Date.now() - maxAge * 60 * 60 * 1000);
        let cleanedCount = 0;

        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.lastActivity < cutoff) {
                this.sessions.delete(sessionId);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} old sessions`);
        }

        return cleanedCount;
    }

    /**
     * Get all active sessions
     * @returns {Array} Array of session objects
     */
    getAllSessions() {
        return Array.from(this.sessions.values());
    }

    /**
     * Get session count
     * @returns {number} Number of active sessions
     */
    getSessionCount() {
        return this.sessions.size;
    }

    /**
     * Get service statistics
     */
    getStats() {
        return {
            activeSessions: this.getSessionCount(),
            totalSessions: this.getAllSessions().length
        };
    }
}

module.exports = { SessionManager }; 