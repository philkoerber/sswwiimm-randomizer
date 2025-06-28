const { LLMService } = require('../core/LLMService');

class PokemonNameCorrector {
    constructor() {
        this.llmService = new LLMService();
    }

    /**
     * Correct misheard Pokémon names using a small LLM call, with a hardcoded pre-pass for the most common cases
     * @param {string} text - Original transcribed text
     * @returns {Promise<string>} Corrected text
     */
    async correctPokemonNames(text) {
        try {
            console.log(`[DEBUG] Input text: "${text}"`);

            // Hardcoded replacements for the most common mishearings
            const replacements = [
                [/\bmu\b/gi, 'mew'],
                [/\bmew two\b/gi, 'mewtwo'],
                [/\bpick a chew\b/gi, 'pikachu'],
                [/\bchar man der\b/gi, 'charmander'],
                [/\bsquirt el\b/gi, 'squirtle'],
                [/\bbulb a saur\b/gi, 'bulbasaur'],
            ];
            let preCorrected = text;
            for (const [pattern, replacement] of replacements) {
                preCorrected = preCorrected.replace(pattern, replacement);
            }
            console.log(`[DEBUG] After hardcoded replacement: "${preCorrected}"`);

            if (preCorrected !== text) {
                console.log(`[Hardcoded Correction] "${text}" → "${preCorrected}"`);
            }

            // Now pass to LLM for further correction if needed (using chat)
            const systemPrompt = `You are a Pokémon name correction assistant. Your job is to identify and correct misheard Pokémon names in transcribed speech.

Common speech-to-text errors for Pokémon names:
- "mu" → "mew"
- "mew two" → "mewtwo" 
- "pick a chew" → "pikachu"
- "char man der" → "charmander"
- "squirt el" → "squirtle"
- "bulb a saur" → "bulbasaur"
- And many other similar phonetic mishearings

Rules:
1. Only correct Pokémon names, leave all other words unchanged
2. Only correct if you're confident it's a Pokémon name
3. Return ONLY the corrected text with the same structure and capitalization
4. Do NOT include any explanations, comments, or mention of corrections
5. Do NOT say things like "I corrected X to Y" or "based on the correction"
6. If no Pokémon names need correction, return the original text unchanged
7. Your response should be the corrected text and nothing else

Examples:
Input: "can mu learn tm01"
Output: "can mew learn tm01"

Input: "what are pick a chew stats"
Output: "what are pikachu stats"

Input: "how do I evolve char man der"
Output: "how do I evolve charmander"`;
            const userPrompt = `Please correct any misheard Pokémon names in this transcribed text: "${preCorrected}"`;
            const correctionResponse = await this.llmService.chat([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ], { maxTokens: 100, temperature: 0.1 });

            const correctedText = this.llmService.extractChatText(correctionResponse);

            // Clean up any potential correction explanations that might have slipped through
            let finalText = correctedText;
            if (correctedText) {
                // Remove common correction explanation patterns
                const cleanupPatterns = [
                    /^I corrected .* to .*: /i,
                    /^Based on the correction, /i,
                    /^After correcting .* to .*, /i,
                    /^The corrected text is: /i,
                    /^Here's the corrected version: /i,
                    /^I changed .* to .*: /i,
                    /^Correction: /i,
                    /^Fixed: /i
                ];

                for (const pattern of cleanupPatterns) {
                    finalText = finalText.replace(pattern, '');
                }

                // Trim any extra whitespace
                finalText = finalText.trim();
            }

            if (finalText && finalText !== preCorrected) {
                console.log(`[LLM Correction] "${preCorrected}" → "${finalText}"`);
                return finalText;
            }
            return preCorrected;
        } catch (error) {
            console.error('Error correcting Pokémon names:', error);
            return text; // Return original text if correction fails
        }
    }

    /**
     * Get service statistics
     */
    getStats() {
        return {
            llmStats: this.llmService.getStats()
        };
    }
}

module.exports = { PokemonNameCorrector }; 