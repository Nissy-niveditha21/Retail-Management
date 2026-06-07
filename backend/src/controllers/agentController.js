/**
 * Agent Controller
 * Handles AI-driven vendor digitalization agent interactions
 */

const ibmGraniteService = require('../services/ibmGraniteService');
const ragEngine = require('../services/ragEngine');
const languageService = require('../services/languageService');
const vendorProfileService = require('../services/vendorProfileService');

exports.queryAgent = async (req, res) => {
    try {
        const { query, vendorContext, language } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required',
            });
        }

        console.log(`Processing agent query: ${query}`);
        console.log(`Language: ${language || 'English'}`);

        // Detect language if not provided
        const detectedLanguage = language || languageService.detectLanguage(query);

        // Build RAG context
        const ragContext = ragEngine.buildContext(query, {
            maxResults: 5,
            language: 'English', // Always retrieve in English first
        });

        // Build prompt with RAG context
        let prompt = `You are a Street Vendor Digitalization Agent powered by RAG (Retrieval-Augmented Generation).
Your role is to help street vendors and micro-entrepreneurs become digitally visible.

${ragContext}

Based on the above knowledge base and context, answer the following vendor query:

Query: ${query}`;

        if (vendorContext) {
            prompt += `

Vendor Context:
- Business Type: ${vendorContext.businessType || 'Unknown'}
- Location: ${vendorContext.location || 'Unknown'}
- Experience: ${vendorContext.experience || 'Not specified'} years
`;
        }

        prompt += `

Provide a helpful, practical response that includes:
1. Direct answer to the query
2. Action steps (if applicable)
3. Relevant resources or platforms
4. Local or specific recommendations

Keep the response concise and actionable.`;

        // Generate response using IBM Granite
        let response = await ibmGraniteService.generateContent(prompt, {
            max_tokens: 1500,
            temperature: 0.7,
        });

        // Translate if needed
        if (detectedLanguage !== 'en' && detectedLanguage !== 'English') {
            const languageCode = Object.keys(languageService.getSupportedLanguages()).find(
                code => languageService.getSupportedLanguages()[code] === detectedLanguage
            ) || detectedLanguage;
            response = await languageService.translate(response, languageCode);
        }

        // Extract action items from response
        const actionItems = this.extractActionItems(response);

        res.status(200).json({
            success: true,
            data: {
                query,
                response,
                detectedLanguage,
                actionItems,
                ragContextUsed: {
                    documentsRetrieved: ragContext.split('Document').length - 1,
                    topicsCovered: ragContext.substring(0, 100),
                },
                timestamp: new Date(),
            },
        });
    } catch (error) {
        console.error('Error processing agent query:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing query',
            error: error.message,
        });
    }
};

exports.getBusinessRecommendations = async (req, res) => {
    try {
        const { businessType, location, experience, challenges } = req.body;

        if (!businessType || !location) {
            return res.status(400).json({
                success: false,
                message: 'businessType and location are required',
            });
        }

        const prompt = `As a Street Vendor Digitalization Agent, provide comprehensive recommendations for:
Business Type: ${businessType}
Location: ${location}
Experience: ${experience || 'Not specified'} years
Current Challenges: ${challenges || 'Not specified'}

Provide specific, actionable recommendations for:
1. Digital Presence Setup
2. Payment Integration
3. Local Marketing
4. Customer Engagement
5. Growth Opportunities
6. Available Government Support/Schemes

Format as structured JSON with sections and detailed points.`;

        const recommendations = await ibmGraniteService.generateContent(prompt, {
            max_tokens: 2000,
        });

        res.status(200).json({
            success: true,
            data: {
                businessType,
                location,
                recommendations: JSON.parse(recommendations),
            },
        });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations',
            error: error.message,
        });
    }
};

exports.handleNaturalLanguageProfile = async (req, res) => {
    try {
        const { businessDescription, language } = req.body;

        if (!businessDescription) {
            return res.status(400).json({
                success: false,
                message: 'businessDescription is required',
            });
        }

        // Parse business description to extract key information
        const extractionPrompt = `Extract the following information from this vendor description:
"${businessDescription}"

Extract and return as JSON:
{
  "name": "vendor name if mentioned",
  "businessType": "type of business",
  "location": "location mentioned",
  "area": "specific area/locality",
  "productsServices": "what they sell/offer",
  "experience": "years of experience if mentioned",
  "challenges": "challenges mentioned"
}

Return ONLY valid JSON.`;

        const extractedDataJson = await ibmGraniteService.generateContent(extractionPrompt, {
            max_tokens: 500,
        });

        let extractedData;
        try {
            extractedData = JSON.parse(extractedDataJson);
        } catch (e) {
            extractedData = {
                businessDescription,
                location: 'Unknown',
                businessType: 'other',
            };
        }

        // Generate comprehensive profile based on extracted data
        const profile = await vendorProfileService.generateComprehensiveProfile({
            name: extractedData.name || 'Vendor',
            businessType: extractedData.businessType || 'other',
            location: extractedData.location || 'Unknown',
            productsServices: extractedData.productsServices,
            experience: extractedData.experience || 0,
            challenges: extractedData.challenges,
            language: language || 'English',
        });

        res.status(200).json({
            success: true,
            message: 'Vendor profile generated from natural language description',
            data: {
                extractedData,
                generatedProfile: profile,
            },
        });
    } catch (error) {
        console.error('Error processing natural language profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing natural language profile',
            error: error.message,
        });
    }
};

exports.searchPoliciesAndSchemes = async (req, res) => {
    try {
        const { keyword, category, language } = req.query;

        const documents = ragEngine.retrieve(keyword || 'MSME schemes', {
            maxResults: 10,
            category: category || 'msme_schemes',
            language: language || 'English',
        });

        const formatted = documents.map(doc => ({
            title: doc.title,
            category: doc.category,
            content: doc.content,
            relevanceScore: doc.relevanceScore,
            url: `https://msme.gov.in/${doc.id}`, // Placeholder URL
        }));

        res.status(200).json({
            success: true,
            data: formatted,
        });
    } catch (error) {
        console.error('Error searching policies:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching policies',
            error: error.message,
        });
    }
};

exports.getMultiLanguageContent = async (req, res) => {
    try {
        const { query, targetLanguages } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'query is required',
            });
        }

        const languages = targetLanguages || ['en', 'hi', 'mr'];
        const results = {};

        for (const lang of languages) {
            const langName = languageService.getLanguageName(lang);

            // Get response in English first
            const englishResponse = await ibmGraniteService.generateContent(
                `Answer briefly: ${query}`,
                { max_tokens: 300 }
            );

            // Translate to target language
            if (lang !== 'en') {
                results[langName] = await languageService.translate(englishResponse, lang);
            } else {
                results[langName] = englishResponse;
            }
        }

        res.status(200).json({
            success: true,
            data: {
                originalQuery: query,
                responses: results,
            },
        });
    } catch (error) {
        console.error('Error processing multi-language content:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing multi-language content',
            error: error.message,
        });
    }
};

/**
 * Helper function to extract action items from response
 * @param {string} response - Agent response text
 * @returns {string[]} - Extracted action items
 */
exports.extractActionItems = (response) => {
    const actionPatterns = [
        /^\s*\d+\.\s+(.+)$/gm,
        /^-\s+(.+)$/gm,
        /^•\s+(.+)$/gm,
    ];

    const actionItems = [];

    for (const pattern of actionPatterns) {
        let match;
        while ((match = pattern.exec(response)) !== null) {
            actionItems.push(match[1].trim());
        }
    }

    return actionItems.slice(0, 10); // Return top 10 action items
};
