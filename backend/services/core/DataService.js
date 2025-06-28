const fs = require('fs');
const path = require('path');

class DataService {
    constructor() {
        this.csvData = null;
        this.loadCSVData();
    }

    /**
     * Load CSV data from the data directory
     */
    async loadCSVData() {
        try {
            console.log('Loading CSV data...');
            const csvDir = path.join(__dirname, '../../data/csv');

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

                // Add data without revealing file names
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
     * Check if CSV data is loaded
     */
    hasData() {
        return !!this.csvData;
    }

    /**
     * Get raw CSV data
     */
    getRawData() {
        return this.csvData;
    }

    /**
     * Format CSV data for better indexing
     * @param {string} csvData - Raw CSV data
     * @returns {string} Formatted data for indexing
     */
    formatCSVForIndexing(csvData) {
        try {
            // Split the data by lines and process
            const lines = csvData.trim().split('\n');
            if (lines.length === 0) return '';

            let formattedData = '';
            let currentSection = '';
            let lineIndex = 0;

            while (lineIndex < lines.length) {
                const line = lines[lineIndex].trim();

                // Skip empty lines
                if (!line) {
                    lineIndex++;
                    continue;
                }

                // Check if this looks like a header row (contains common Pokemon data headers)
                const headers = line.split(',').map(h => h.trim().replace(/"/g, ''));
                const isHeaderRow = headers.some(header =>
                    ['Name', 'Type', 'HP', 'Attack', 'Defense', 'Special', 'Speed', 'Move', 'Power', 'PP', 'Accuracy'].includes(header)
                );

                if (isHeaderRow) {
                    // Start a new section
                    if (currentSection) {
                        formattedData += '\n';
                    }

                    formattedData += `Pokemon Data:\n`;
                    formattedData += `Columns: ${headers.join(', ')}\n\n`;

                    // Add sample data rows
                    let sampleCount = 0;
                    lineIndex++;

                    while (lineIndex < lines.length && sampleCount < 3) {
                        const dataLine = lines[lineIndex].trim();
                        if (dataLine && !dataLine.startsWith('===')) {
                            const values = dataLine.split(',').map(v => v.trim().replace(/"/g, ''));
                            formattedData += `Row ${sampleCount + 1}: ${values.join(' | ')}\n`;
                            sampleCount++;
                        }
                        lineIndex++;
                    }

                    // Count remaining rows
                    let remainingRows = 0;
                    while (lineIndex < lines.length) {
                        const dataLine = lines[lineIndex].trim();
                        if (dataLine && !dataLine.startsWith('===')) {
                            remainingRows++;
                        }
                        lineIndex++;
                    }

                    if (remainingRows > 0) {
                        formattedData += `... and ${remainingRows} more rows\n`;
                    }
                    formattedData += '\n';
                } else {
                    lineIndex++;
                }
            }

            return formattedData;
        } catch (error) {
            console.error('Error formatting CSV:', error);
            return csvData; // Return original data if formatting fails
        }
    }

    /**
     * Get formatted CSV data for querying
     */
    getFormattedData() {
        if (!this.csvData) {
            return null;
        }
        return this.formatCSVForIndexing(this.csvData);
    }

    /**
     * Get service statistics
     */
    getStats() {
        return {
            dataLoaded: this.hasData(),
            dataSize: this.csvData ? this.csvData.length : 0
        };
    }
}

module.exports = { DataService }; 