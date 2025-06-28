const { LLMService } = require('../core/LLMService');
const { DataService } = require('../core/DataService');

class QueryProcessor {
    constructor() {
        this.llmService = new LLMService();
        this.dataService = new DataService();
    }

    /**
     * Process a query against the CSV data
     * @param {string} query - User query
     * @param {string} sessionContext - Conversation context
     * @returns {Promise<string>} Response from the AI
     */
    async processQuery(query, sessionContext = '') {
        try {
            if (!this.llmService.isInitialized()) {
                throw new Error('LLM not initialized. Please check your OpenAI API key.');
            }

            // If no CSV data, return a basic response
            if (!this.dataService.hasData()) {
                return this.getBasicResponse(query, sessionContext);
            }

            // Create a simple prompt with the CSV data
            const csvContext = this.dataService.getFormattedData();

            let prompt = `You are a helpful assistant that answers questions about Pokemon from Generation 1. You have access to comprehensive Pokemon data including:

- Pokemon base stats (HP, Attack, Defense, Special, Speed)
- Pokemon types
- Evolution information
- Level-up moves
- TM/HM compatibility
- Move information (power, PP, accuracy, priority, type, class)
- Which Pokemon can learn each move

IMPORTANT: When someone asks about a Pokemon's "stats", they are asking about the base stats (HP, Attack, Defense, Special, Speed), NOT move statistics.

RESPONSE GUIDELINES:
- Provide only factual information from the data
- Use clear, direct statements
- Avoid subjective opinions, recommendations, or commentary
- Do not include phrases like "it's great", "it's useful", "you should", "it's known for", etc.
- Focus on the raw data and facts only
- Do not mention data sources, file names, or internal processes
- Answer naturally as if you just know this information

Examples of factual response formats:
- For Pokemon stats: "Pikachu is an Electric type Pokemon with 35 HP, 55 Attack, 40 Defense, 50 Special, and 90 Speed."
- For move information: "Swords Dance is a Normal type status move with 0 power, 30 PP, and 100% accuracy. It increases the user's Attack stat by two stages."
- For evolution info: "Charmander evolves into Charmeleon at level 16, and then into Charizard at level 36."

Here is the Pokemon data you have access to:\n\n${csvContext}\n\n`;

            if (sessionContext) {
                prompt += `Previous conversation:\n${sessionContext}\n\n`;
            }

            prompt += `Please answer the following question based on the CSV data above: ${query}`;

            // Use the LLM to process the query
            const response = await this.llmService.complete(prompt);

            // Extract the response text
            return this.llmService.extractText(response);
        } catch (error) {
            console.error('Error processing query:', error);
            throw new Error(`Failed to process query: ${error.message}`);
        }
    }

    /**
     * Get a basic response when no indexed data is available
     * @param {string} query - User query
     * @param {string} sessionContext - Session context
     * @returns {string} Basic response
     */
    getBasicResponse(query, sessionContext = '') {
        if (sessionContext) {
            return `I can see we've been chatting, but I don't have any CSV data loaded to analyze. Please ensure CSV files are placed in the data/csv directory. Your question was: "${query}"`;
        }

        return `Hello! I'm a voice-activated chatbot that can help you analyze CSV data. Please ensure CSV files are placed in the data/csv directory, and then I'll be able to answer questions about your data. Your question was: "${query}"`;
    }

    /**
     * Get service statistics
     */
    getStats() {
        return {
            llmStats: this.llmService.getStats(),
            dataStats: this.dataService.getStats()
        };
    }
}

module.exports = { QueryProcessor }; 