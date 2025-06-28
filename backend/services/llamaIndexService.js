const { Document } = require('llamaindex');
const { VectorStoreIndex } = require('llamaindex');
const { OpenAI } = require('llamaindex/llms/openai');
const fs = require('fs');
const path = require('path');

class LlamaIndexService {
    constructor() {
        this.index = null;
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
                return;
            }

            this.llm = new OpenAI({
                apiKey: apiKey,
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                temperature: 0.1,
                maxTokens: 1000
            });
        } catch (error) {
            console.error('Error initializing LLM:', error);
        }
    }

    /**
     * Load CSV data from the data directory
     */
    async loadCSVData() {
        try {
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

            // Load the first CSV file found (you can modify this to load multiple files)
            const csvFile = files[0];
            const csvPath = path.join(csvDir, csvFile);
            this.csvData = fs.readFileSync(csvPath, 'utf8');

            console.log(`Loaded CSV data from: ${csvFile}`);

            // Index the CSV data
            await this.indexCSVData();

        } catch (error) {
            console.error('Error loading CSV data:', error);
        }
    }

    /**
     * Index the loaded CSV data
     */
    async indexCSVData() {
        try {
            if (!this.llm) {
                throw new Error('LLM not initialized. Please check your OpenAI API key.');
            }

            if (!this.csvData) {
                console.log('No CSV data to index');
                return;
            }

            // Create a document from CSV data
            const document = new Document({
                text: this.formatCSVForIndexing(this.csvData),
                metadata: {
                    type: 'csv',
                    timestamp: new Date().toISOString()
                }
            });

            // Create vector index
            this.index = await VectorStoreIndex.fromDocuments([document], {
                llm: this.llm
            });

            console.log('CSV data indexed successfully');
        } catch (error) {
            console.error('Error indexing CSV data:', error);
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

            // If no index, return a basic response
            if (!this.index) {
                return this.getBasicResponse(query, sessionContext);
            }

            // Create query engine
            const queryEngine = this.index.asQueryEngine();

            // Add session context to the query if provided
            const enhancedQuery = sessionContext
                ? `Previous conversation:\n${sessionContext}\n\nCurrent question: ${query}`
                : query;

            // Execute query
            const response = await queryEngine.query(enhancedQuery);

            return response.response;
        } catch (error) {
            console.error('Error querying:', error);
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
            const lines = csvData.trim().split('\n');
            if (lines.length === 0) return '';

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const dataLines = lines.slice(1);

            let formattedData = `CSV Data with ${headers.length} columns:\n`;
            formattedData += `Headers: ${headers.join(', ')}\n\n`;

            // Add first few rows as examples
            const exampleRows = dataLines.slice(0, 5);
            formattedData += 'Sample data:\n';
            exampleRows.forEach((line, index) => {
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                formattedData += `Row ${index + 1}: ${values.join(' | ')}\n`;
            });

            if (dataLines.length > 5) {
                formattedData += `\n... and ${dataLines.length - 5} more rows\n`;
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
            indexCreated: !!this.index,
            llmInitialized: !!this.llm,
            model: this.llm ? process.env.OPENAI_MODEL || 'gpt-3.5-turbo' : 'none'
        };
    }
}

module.exports = { LlamaIndexService }; 