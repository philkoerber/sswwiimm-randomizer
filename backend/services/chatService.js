const { QueryProcessor } = require('./processors/QueryProcessor');
const { PokemonNameCorrector } = require('./processors/PokemonNameCorrector');
const { SessionManager } = require('./session/SessionManager');

class ChatService {
    constructor() {
        this.queryProcessor = new QueryProcessor();
        this.pokemonNameCorrector = new PokemonNameCorrector();
        this.sessionManager = new SessionManager();
    }

    /**
     * Process a voice-to-text query with Pokémon name correction
     * @param {string} message - The transcribed voice message
     * @param {string} sessionId - Session ID for conversation history
     * @returns {Promise<Object>} The chatbot response
     */
    async processQuery(message, sessionId = null) {
        try {
            // Step 1: Correct any misheard Pokémon names
            const correctedMessage = await this.pokemonNameCorrector.correctPokemonNames(message);

            // Step 2: Get session context if sessionId is provided
            let sessionContext = '';
            if (sessionId) {
                sessionContext = this.sessionManager.getSessionContext(sessionId);
                this.sessionManager.addMessage(sessionId, 'user', correctedMessage);
            }

            // Step 3: Process the corrected query
            const response = await this.queryProcessor.processQuery(correctedMessage, sessionContext);

            // Step 4: Update session if exists
            if (sessionId) {
                this.sessionManager.addMessage(sessionId, 'assistant', response);
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
            return await this.sessionManager.createSession();
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
        return this.sessionManager.getSession(sessionId);
    }

    /**
     * Clean up old sessions
     * @param {number} maxAge - Maximum age in hours
     */
    cleanupSessions(maxAge = 24) {
        return this.sessionManager.cleanupSessions(maxAge);
    }

    /**
     * Get comprehensive service statistics
     * @returns {Object} Statistics from all services
     */
    getStats() {
        return {
            queryProcessor: this.queryProcessor.getStats(),
            pokemonNameCorrector: this.pokemonNameCorrector.getStats(),
            sessionManager: this.sessionManager.getStats()
        };
    }
}

module.exports = { ChatService }; 