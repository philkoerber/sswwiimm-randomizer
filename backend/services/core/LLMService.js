const { openai } = require("@llamaindex/openai");

class LLMService {
    constructor() {
        this.llm = null;
        this.initializeLLM();
    }

    /**
     * Initialize the LLM (OpenAI)
     */
    initializeLLM() {
        try {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                console.warn('OpenAI API key not found. Some features may not work.');
                console.log('Please set OPENAI_API_KEY environment variable');
                return;
            }

            console.log('Initializing OpenAI LLM...');
            this.llm = openai({
                apiKey: apiKey,
                model: "gpt-3.5-turbo",
                temperature: 0.1,
                maxTokens: 1000,
            });
            console.log('LLM initialized successfully');
        } catch (error) {
            console.error('Error initializing LLM:', error);
        }
    }

    /**
     * Check if LLM is initialized
     */
    isInitialized() {
        return !!this.llm;
    }

    /**
     * Get the LLM instance
     */
    getLLM() {
        if (!this.llm) {
            throw new Error('LLM not initialized. Please check your OpenAI API key.');
        }
        return this.llm;
    }

    /**
     * Complete a prompt using the LLM
     * @param {string} prompt - The prompt to send
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} LLM response
     */
    async complete(prompt, options = {}) {
        const llm = this.getLLM();

        const defaultOptions = {
            maxTokens: 1000,
            temperature: 0.1
        };

        const finalOptions = { ...defaultOptions, ...options };

        return await llm.complete({
            prompt,
            ...finalOptions
        });
    }

    /**
     * Extract text from LLM response
     * @param {Object} response - LLM response
     * @returns {string} Extracted text
     */
    extractText(response) {
        if (response && response.text) {
            return response.text.trim();
        } else if (response && response.message) {
            return response.message.content || response.message;
        } else {
            throw new Error('No valid response received from LLM');
        }
    }

    /**
     * Get service statistics
     */
    getStats() {
        return {
            initialized: this.isInitialized(),
            model: this.isInitialized() ? 'gpt-3.5-turbo' : 'none'
        };
    }

    /**
     * Chat with the LLM using a messages array (for chat-based models)
     * @param {Array} messages - Array of chat messages [{role, content}]
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} LLM response
     */
    async chat(messages, options = {}) {
        const llm = this.getLLM();
        const defaultOptions = {
            maxTokens: 1000,
            temperature: 0.1
        };
        const finalOptions = { ...defaultOptions, ...options };
        return await llm.chat({
            messages,
            ...finalOptions
        });
    }

    /**
     * Extract text from a chat-based LLM response
     * @param {Object} response - LLM chat response
     * @returns {string} Extracted text
     */
    extractChatText(response) {
        if (response && response.message && response.message.content) {
            return response.message.content.trim();
        } else if (response && response.text) {
            return response.text.trim();
        } else {
            throw new Error('No valid chat response received from LLM');
        }
    }
}

module.exports = { LLMService }; 