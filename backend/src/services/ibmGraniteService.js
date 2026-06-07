/**
 * IBM Granite Integration Service
 * Handles all interactions with IBM Granite LLM via IBM Cloud Lite
 */

const axios = require('axios');
const NodeCache = require('node-cache');

class IBMGraniteService {
    constructor() {
        this.apiKey = process.env.IBM_GRANITE_API_KEY;
        this.projectId = process.env.IBM_GRANITE_PROJECT_ID;
        this.baseUrl = process.env.IBM_GRANITE_BASE_URL || 'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation';
        this.modelId = 'ibm/granite-13b-instruct-v2';
        this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
    }

    /**
     * Generate content using IBM Granite
     * @param {string} prompt - The prompt for generation
     * @param {object} options - Generation options
     * @returns {Promise<string>} - Generated text
     */
    async generateContent(prompt, options = {}) {
        try {
            const cacheKey = `granite_${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
            const cached = this.cache.get(cacheKey);

            if (cached) {
                console.log('Returning cached Granite response');
                return cached;
            }

            const requestBody = {
                model_id: this.modelId,
                input: prompt,
                parameters: {
                    max_tokens: options.max_tokens || 1024,
                    temperature: options.temperature || 0.7,
                    top_p: options.top_p || 0.9,
                    top_k: options.top_k || 50,
                    repetition_penalty: options.repetition_penalty || 1.0,
                },
            };

            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            const params = {
                version: '2024-01-23',
                project_id: this.projectId,
            };

            const response = await axios.post(this.baseUrl, requestBody, {
                headers,
                params,
            });

            const generatedText = response.data.results[0].generated_text;
            this.cache.set(cacheKey, generatedText);

            return generatedText;
        } catch (error) {
            console.error('IBM Granite API Error:', error.message);
            throw new Error(`Failed to generate content: ${error.message}`);
        }
    }

    /**
     * Generate business profile for a vendor
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - Generated profile
     */
    async generateVendorProfile(vendorData) {
        const prompt = `Create a professional business profile for this street vendor:
Name: ${vendorData.name}
Business Type: ${vendorData.businessType}
Location: ${vendorData.location}
Products/Services: ${vendorData.productsServices}
Experience: ${vendorData.experience} years
Current Challenges: ${vendorData.challenges}

Generate a compelling business profile including:
1. Business Summary
2. Unique Selling Points
3. Target Customer Segments
4. Current Strengths
5. Growth Opportunities

Format as JSON.`;

        const response = await this.generateContent(prompt, { max_tokens: 1500 });
        return JSON.parse(response);
    }

    /**
     * Generate UPI setup guide
     * @param {string} vendorName - Name of the vendor
     * @param {string} language - Preferred language
     * @returns {Promise<string>} - Setup guide
     */
    async generateUPIGuide(vendorName, language = 'English') {
        const prompt = `Create a step-by-step UPI (Unified Payments Interface) setup guide for ${vendorName}.
Language: ${language}

Include:
1. Prerequisites and requirements
2. Step-by-step app download and installation
3. Bank account linkage process
4. Merchant registration (if applicable)
5. QR code generation
6. Safety tips and security measures
7. How to receive payments
8. Transaction tracking
9. Withdrawal process

Make it simple and beginner-friendly.`;

        return await this.generateContent(prompt, { max_tokens: 2000 });
    }

    /**
     * Generate local SEO strategy
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - SEO strategy
     */
    async generateLocalSEO(vendorData) {
        const prompt = `Create a local SEO strategy for this street vendor:
Business Name: ${vendorData.name}
Business Type: ${vendorData.businessType}
Location: ${vendorData.location}
Area/Locality: ${vendorData.locality}

Generate SEO recommendations including:
1. Local Keywords (with location modifiers)
2. Google Business Profile Optimization
3. Online Directories to Register On
4. Local Citation Building Strategy
5. Review Generation Tips
6. Location-Specific Content Ideas
7. Mobile Optimization Tips
8. Local Social Media Strategy

Format as JSON.`;

        const response = await this.generateContent(prompt, { max_tokens: 1500 });
        return JSON.parse(response);
    }

    /**
     * Generate pricing recommendations
     * @param {object} marketData - Market and product data
     * @returns {Promise<object>} - Pricing strategy
     */
    async generatePricingStrategy(marketData) {
        const prompt = `Analyze and recommend pricing strategy for this vendor:
Product Type: ${marketData.productType}
Location: ${marketData.location}
Current Price: ${marketData.currentPrice}
Competitors: ${marketData.competitors}
Market Demand: ${marketData.demand}
Production Cost: ${marketData.productionCost}

Provide:
1. Recommended Price Range
2. Price Justification
3. Competitive Analysis
4. Seasonal Pricing Adjustments
5. Discount Strategy
6. Bundle Suggestions
7. Psychology-Based Pricing Tips

Format as JSON.`;

        const response = await this.generateContent(prompt, { max_tokens: 1200 });
        return JSON.parse(response);
    }

    /**
     * Generate promotional materials
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - Promotional content
     */
    async generatePromotionalMaterials(vendorData) {
        const prompt = `Create promotional materials for this street vendor:
Business: ${vendorData.name}
Type: ${vendorData.businessType}
Unique Feature: ${vendorData.uniqueFeature}
Target Audience: ${vendorData.targetAudience}
Location: ${vendorData.location}

Generate:
1. Business Tagline
2. Elevator Pitch (30 seconds)
3. Social Media Post Ideas (5 variations)
4. WhatsApp Marketing Message
5. Promotional Offers Ideas
6. Customer Testimonial Template
7. Behind-the-Scenes Content Ideas
8. Call-to-Action Phrases

Format as JSON.`;

        const response = await this.generateContent(prompt, { max_tokens: 1500 });
        return JSON.parse(response);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.flushAll();
    }
}

module.exports = new IBMGraniteService();
