const { openai } = require("@llamaindex/openai");
const fs = require('fs');
const path = require('path');

class LlamaIndexService {
    constructor() {
        this.llm = null;
        this.csvData = null;
        this.initializeLLM();
        this.loadCSVData();
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
     * Load CSV data from the data directory
     */
    async loadCSVData() {
        try {
            console.log('Loading CSV data...');
            const csvDir = path.join(__dirname, '../data/csv');

            if (!fs.existsSync(csvDir)) {
                console.log('CSV data directory not found, creating...');
                fs.mkdirSync(csvDir, { recursive: true });
                return;
            }

            const files = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));

            if (files.length === 0) {
                console.log('No CSV files found in data/csv directory');
                return;
            }

            console.log(`Found ${files.length} CSV files:`, files);

            // Load all CSV files and combine them with proper context
            this.csvData = '';

            for (const file of files) {
                const csvPath = path.join(csvDir, file);
                const fileData = fs.readFileSync(csvPath, 'utf8');

                // Add file context to help distinguish between different data types
                this.csvData += `\n=== ${file.toUpperCase()} ===\n`;
                this.csvData += fileData;
                this.csvData += '\n';

                console.log(`Loaded CSV data from: ${file} (${fileData.length} characters)`);
            }

            console.log(`Total loaded data: ${this.csvData.length} characters`);

        } catch (error) {
            console.error('Error loading CSV data:', error);
        }
    }

    /**
     * Query the indexed CSV data
     * @param {string} query - User query (transcribed voice)
     * @param {string} sessionContext - Conversation context
     * @returns {Promise<string>} Response from the AI
     */
    async query(query, sessionContext = '') {
        try {
            if (!this.llm) {
                throw new Error('LLM not initialized. Please check your OpenAI API key.');
            }

            // If no CSV data, return a basic response
            if (!this.csvData) {
                return this.getBasicResponse(query, sessionContext);
            }

            // Create a simple prompt with the CSV data
            const csvContext = this.formatCSVForIndexing(this.csvData);

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

            // Use the LLM directly instead of the query engine
            const response = await this.llm.complete({
                prompt: prompt,
                maxTokens: 1000,
                temperature: 0.1
            });

            // Extract the response text
            if (response && response.text) {
                return response.text.trim();
            } else if (response && response.message) {
                return response.message.content || response.message;
            } else {
                throw new Error('No valid response received from LLM');
            }
        } catch (error) {
            console.error('Error querying:', error);
            throw new Error(`Failed to process query: ${error.message}`);
        }
    }

    /**
     * Correct misheard Pokémon names using a small LLM call
     * @param {string} text - Original transcribed text
     * @returns {Promise<string>} Corrected text
     */
    async correctPokemonNames(text) {
        try {
            const correctionResponse = await this.llm.complete({
                prompt: `You are a Pokémon name correction assistant. Your job is to identify and correct misheard Pokémon names in transcribed speech.

Common speech-to-text errors for Pokémon names:
- "mu" → "mew"
- "mew two" → "mewtwo" 
- "pick a chew" → "pikachu"
- "char man der" → "charmander"
- "squirt el" → "squirtle"
- "bulb a saur" → "bulbasaur"
- "pidge y" → "pidgey"
- "rat tat ta" → "rattata"
- And many other similar phonetic mishearings

Rules:
1. Only correct Pokémon names, leave all other words unchanged
2. Only correct if you're confident it's a Pokémon name
3. Return the corrected text with the same structure and capitalization
4. If no Pokémon names need correction, return the original text unchanged

Examples:
Input: "can mu learn tm01"
Output: "can mew learn tm01"

Input: "what are pick a chew stats"
Output: "what are pikachu stats"

Input: "how do I evolve char man der"
Output: "how do I evolve charmander"

Please correct any misheard Pokémon names in this transcribed text: "${text}"`,
                maxTokens: 100,
                temperature: 0.1
            });

            const correctedText = correctionResponse.text?.trim();
            if (correctedText && correctedText !== text) {
                console.log(`Pokémon name correction: "${text}" → "${correctedText}"`);
                return correctedText;
            }
            return text;
        } catch (error) {
            console.error('Error correcting Pokémon names:', error);
            return text; // Return original text if correction fails
        }
    }

    /**
     * Enhanced query method with Pokémon name correction
     * @param {string} query - User query (transcribed voice)
     * @param {string} sessionContext - Conversation context
     * @returns {Promise<string>} Response from the AI
     */
    async queryWithCorrection(query, sessionContext = '') {
        try {
            // First, correct any misheard Pokémon names
            const correctedQuery = await this.correctPokemonNames(query);

            // Then process the corrected query normally
            return await this.query(correctedQuery, sessionContext);
        } catch (error) {
            console.error('Error in queryWithCorrection:', error);
            throw new Error(`Failed to process query: ${error.message}`);
        }
    }

    /**
     * Format CSV data for better indexing
     * @param {string} csvData - Raw CSV data
     * @returns {string} Formatted data for indexing
     */
    formatCSVForIndexing(csvData) {
        try {
            // Split the data by file sections
            const sections = csvData.split('===');
            let formattedData = '';

            for (const section of sections) {
                if (!section.trim()) continue;

                const lines = section.trim().split('\n');
                if (lines.length === 0) continue;

                // First line contains the file name
                const fileName = lines[0].trim();
                const dataLines = lines.slice(1);

                if (dataLines.length === 0) continue;

                const headers = dataLines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const actualData = dataLines.slice(1);

                formattedData += `\n${fileName}:\n`;
                formattedData += `Columns: ${headers.join(', ')}\n\n`;

                // Add first few rows as examples
                const exampleRows = actualData.slice(0, 3);
                formattedData += 'Sample data:\n';
                exampleRows.forEach((line, index) => {
                    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                    formattedData += `Row ${index + 1}: ${values.join(' | ')}\n`;
                });

                if (actualData.length > 3) {
                    formattedData += `... and ${actualData.length - 3} more rows\n`;
                }
                formattedData += '\n';
            }

            return formattedData;
        } catch (error) {
            console.error('Error formatting CSV:', error);
            return csvData; // Return original data if formatting fails
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
     * Get statistics about the service
     * @returns {Object} Statistics
     */
    getStats() {
        return {
            csvLoaded: !!this.csvData,
            csvSize: this.csvData ? this.csvData.length : 0,
            llmInitialized: !!this.llm,
            model: 'gpt-3.5-turbo'
        };
    }
}

module.exports = { LlamaIndexService }; 