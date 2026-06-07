/**
 * Language Translation and Localization Service
 * Handles multi-language support for the platform
 */

const axios = require('axios');
const NodeCache = require('node-cache');

class LanguageService {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache
        this.supportedLanguages = {
            en: 'English',
            hi: 'Hindi',
            mr: 'Marathi',
            gu: 'Gujarati',
            ta: 'Tamil',
            te: 'Telugu',
            kn: 'Kannada',
            ml: 'Malayalam',
            bn: 'Bengali',
            pa: 'Punjabi',
        };
    }

    /**
     * Translate text to target language
     * @param {string} text - Text to translate
     * @param {string} targetLanguage - Target language code
     * @returns {Promise<string>} - Translated text
     */
    async translate(text, targetLanguage = 'hi') {
        if (targetLanguage === 'en') {
            return text; // No translation needed for English
        }

        const cacheKey = `translate_${text.substring(0, 20)}_${targetLanguage}`;
        const cached = this.cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            // Using Google Translate API alternative
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: text,
                    langpair: `en|${targetLanguage}`,
                },
            });

            const translatedText = response.data.responseData.translatedText;
            this.cache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.warn('Translation failed, returning original text:', error.message);
            return text;
        }
    }

    /**
     * Get language name from code
     * @param {string} code - Language code
     * @returns {string} - Language name
     */
    getLanguageName(code) {
        return this.supportedLanguages[code] || 'English';
    }

    /**
     * Get all supported languages
     * @returns {object} - Supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Localize content structure
     * @param {object} content - Content object
     * @param {string} language - Target language
     * @returns {Promise<object>} - Localized content
     */
    async localizeContent(content, language = 'hi') {
        if (language === 'en') {
            return content;
        }

        const localized = { ...content };

        for (const key in localized) {
            if (typeof localized[key] === 'string') {
                localized[key] = await this.translate(localized[key], language);
            } else if (typeof localized[key] === 'object' && localized[key] !== null) {
                localized[key] = await this.localizeContent(localized[key], language);
            }
        }

        return localized;
    }

    /**
     * Detect language from text
     * @param {string} text - Text to analyze
     * @returns {string} - Detected language code
     */
    detectLanguage(text) {
        // Simple detection based on keywords
        const indicators = {
            hi: ['है', 'का', 'की', 'में', 'यह', 'इस'],
            mr: ['आहे', 'ची', 'या', 'ते', 'असे'],
            gu: ['છે', 'ના', 'એ', 'તો'],
            ta: ['ஆ', 'ஐ', 'உ', 'எ', 'ஒ'],
        };

        for (const [code, keywords] of Object.entries(indicators)) {
            if (keywords.some(kw => text.includes(kw))) {
                return code;
            }
        }

        return 'en'; // Default to English
    }
}

module.exports = new LanguageService();
