/**
 * RAG (Retrieval-Augmented Generation) Engine
 * Manages knowledge base and retrieves relevant documents for context
 */

const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');

class RAGEngine {
    constructor() {
        this.knowledgeBase = new Map();
        this.cache = new NodeCache({ stdTTL: 7200 }); // 2 hour cache
        this.indexMap = new Map(); // For fast searches
        this.initializeKnowledgeBase();
    }

    /**
     * Initialize knowledge base with default content
     */
    initializeKnowledgeBase() {
        // MSME Schemes and Government Policies
        this.addDocument({
            id: uuidv4(),
            category: 'msme_schemes',
            title: 'Credit Linked Capital Subsidy Scheme for Technology Upgradation (CLCSS)',
            content: `The CLCSS scheme provides financial assistance for technology upgradation in MSME units.
      - Eligible for manufacturing SMEs
      - Subsidy up to 15% on technology equipment
      - Processing through identified financial institutions
      - Can be combined with other government schemes
      - Documents required: Business registration, bank statement, technology proposal`,
            language: 'English',
            lastUpdated: new Date(),
        });

        this.addDocument({
            id: uuidv4(),
            category: 'msme_schemes',
            title: 'Pradhan Mantri Mudra Yojana (PMMY)',
            content: `Micro Units Development and Refinance Agency scheme for small business loans.
      - Loan amount: Up to 10 lakhs
      - No collateral required
      - Available for new and existing businesses
      - Zero percent interest subsidy for certain categories
      - Covers equipment, working capital, and setup costs`,
            language: 'English',
            lastUpdated: new Date(),
        });

        // Digital Onboarding Content
        this.addDocument({
            id: uuidv4(),
            category: 'digital_onboarding',
            title: 'Complete UPI Setup for Street Vendors',
            content: `Step-by-step guide for UPI merchant setup:
      1. Download UPI app (Google Pay, PhonePe, Paytm)
      2. Link your bank account
      3. Set UPI PIN
      4. Enable merchant mode
      5. Generate QR code
      6. Display QR code at shop
      7. Track transactions via app`,
            language: 'English',
            lastUpdated: new Date(),
        });

        this.addDocument({
            id: uuidv4(),
            category: 'digital_onboarding',
            title: 'Online Listing Platforms for Vendors',
            content: `Popular platforms to list your business:
      - Google Business Profile (free)
      - Justdial (local search)
      - MapMyIndia (local listings)
      - Facebook Business Page
      - Instagram Business Account
      - OLX (for product sales)
      - LocalCircles (community engagement)`,
            language: 'English',
            lastUpdated: new Date(),
        });

        // Local Business Tips
        this.addDocument({
            id: uuidv4(),
            category: 'local_business_tips',
            title: 'Pricing Strategy for Street Vendors',
            content: `Effective pricing in informal retail:
      - Research competitor pricing
      - Calculate cost + 30-50% markup
      - Adjust for location and demand
      - Offer volume discounts
      - Use psychological pricing ($9.99 instead of $10)
      - Seasonal adjustments
      - Premium for convenience/location`,
            language: 'English',
            lastUpdated: new Date(),
        });

        this.addDocument({
            id: uuidv4(),
            category: 'local_business_tips',
            title: 'Customer Engagement Strategies',
            content: `Build loyal customer base:
      - Remember regular customers' names
      - Offer loyalty rewards/discounts
      - Provide excellent customer service
      - Engage on social media
      - Ask for feedback and reviews
      - Personalize recommendations
      - Create urgency with limited offers`,
            language: 'English',
            lastUpdated: new Date(),
        });

        // QR Code and Payment Solutions
        this.addDocument({
            id: uuidv4(),
            category: 'payment_solutions',
            title: 'QR Code Setup and Benefits',
            content: `Why QR codes matter for street vendors:
      - Accepts digital payments instantly
      - Reduces cash handling risk
      - Creates transaction records
      - Builds business credibility
      - Enables receipt generation
      - Works offline in some apps
      - Free to generate and update`,
            language: 'English',
            lastUpdated: new Date(),
        });

        // Build index for fast searching
        this.buildIndex();
    }

    /**
     * Add document to knowledge base
     * @param {object} document - Document to add
     */
    addDocument(document) {
        const doc = {
            ...document,
            id: document.id || uuidv4(),
            createdAt: document.createdAt || new Date(),
        };

        this.knowledgeBase.set(doc.id, doc);
        return doc;
    }

    /**
     * Build search index
     */
    buildIndex() {
        this.indexMap.clear();

        for (const [id, doc] of this.knowledgeBase.entries()) {
            const keywords = this.extractKeywords([
                doc.title,
                doc.category,
                doc.content.substring(0, 200),
            ].join(' '));

            keywords.forEach(keyword => {
                if (!this.indexMap.has(keyword)) {
                    this.indexMap.set(keyword, []);
                }
                this.indexMap.get(keyword).push(id);
            });
        }
    }

    /**
     * Extract keywords from text
     * @param {string} text - Text to extract from
     * @returns {string[]} - Keywords
     */
    extractKeywords(text) {
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'for', 'of', 'in', 'on', 'at', 'to', 'is', 'be']);
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];

        return [...new Set(words)]
            .filter(word => !stopWords.has(word) && word.length > 2)
            .slice(0, 20);
    }

    /**
     * Retrieve relevant documents
     * @param {string} query - Search query
     * @param {object} options - Search options
     * @returns {object[]} - Relevant documents
     */
    retrieve(query, options = {}) {
        const cacheKey = `rag_retrieve_${query}`;
        const cached = this.cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const maxResults = options.maxResults || 5;
        const category = options.category || null;
        const language = options.language || 'English';

        const keywords = this.extractKeywords(query);
        const relevantDocIds = new Set();
        const scores = new Map();

        // Find documents matching keywords
        keywords.forEach(keyword => {
            const docIds = this.indexMap.get(keyword) || [];
            docIds.forEach(id => {
                relevantDocIds.add(id);
                scores.set(id, (scores.get(id) || 0) + 1);
            });
        });

        // Filter and rank results
        let results = Array.from(relevantDocIds)
            .map(id => ({
                ...this.knowledgeBase.get(id),
                relevanceScore: scores.get(id),
            }))
            .filter(doc => !category || doc.category === category)
            .filter(doc => !language || doc.language === language)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, maxResults);

        this.cache.set(cacheKey, results);
        return results;
    }

    /**
     * Get documents by category
     * @param {string} category - Category name
     * @returns {object[]} - Documents in category
     */
    getByCategory(category) {
        return Array.from(this.knowledgeBase.values())
            .filter(doc => doc.category === category);
    }

    /**
     * Get all categories
     * @returns {string[]} - Available categories
     */
    getCategories() {
        return [...new Set(Array.from(this.knowledgeBase.values()).map(doc => doc.category))];
    }

    /**
     * Build context for RAG
     * @param {string} query - User query
     * @param {object} options - Options
     * @returns {string} - Context string for LLM
     */
    buildContext(query, options = {}) {
        const documents = this.retrieve(query, options);

        let context = 'Retrieved knowledge base documents:\n\n';

        documents.forEach((doc, index) => {
            context += `Document ${index + 1}: ${doc.title}\n`;
            context += `Category: ${doc.category}\n`;
            context += `Content: ${doc.content}\n`;
            context += `---\n`;
        });

        return context;
    }

    /**
     * Search across all documents
     * @param {string} query - Search query
     * @returns {object[]} - Search results
     */
    search(query) {
        const keywords = this.extractKeywords(query);
        const results = new Map();

        keywords.forEach(keyword => {
            const docIds = this.indexMap.get(keyword) || [];
            docIds.forEach(id => {
                const doc = this.knowledgeBase.get(id);
                const score = (results.get(id)?.score || 0) + 1;
                results.set(id, { doc, score });
            });
        });

        return Array.from(results.values())
            .sort((a, b) => b.score - a.score)
            .map(item => ({ ...item.doc, score: item.score }));
    }

    /**
     * Get statistics
     * @returns {object} - KB statistics
     */
    getStats() {
        return {
            totalDocuments: this.knowledgeBase.size,
            categories: this.getCategories(),
            languages: [...new Set(Array.from(this.knowledgeBase.values()).map(d => d.language))],
        };
    }
}

module.exports = new RAGEngine();
