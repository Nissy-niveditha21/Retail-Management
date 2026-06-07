/**
 * Vendor Profile Generation Service
 * Handles comprehensive vendor profile creation and management
 */

const ibmGraniteService = require('./ibmGraniteService');
const ragEngine = require('./ragEngine');
const languageService = require('./languageService');
const geolocationService = require('./geolocationService');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class VendorProfileService {
    /**
     * Generate comprehensive vendor profile
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - Complete vendor profile
     */
    async generateComprehensiveProfile(vendorData) {
        try {
            const profileId = uuidv4();

            // Generate business profile
            const businessProfile = await ibmGraniteService.generateVendorProfile({
                name: vendorData.name,
                businessType: vendorData.businessType,
                location: vendorData.location,
                productsServices: vendorData.productsServices,
                experience: vendorData.experience || 0,
                challenges: vendorData.challenges || 'Growth and visibility',
            });

            // Generate SEO strategy
            const seoStrategy = await ibmGraniteService.generateLocalSEO({
                name: vendorData.name,
                businessType: vendorData.businessType,
                location: vendorData.location,
                locality: vendorData.locality || vendorData.location.split(',')[0],
            });

            // Get geolocation insights
            const geoInsights = geolocationService.getDemographicInsights(vendorData.location);
            const hotspots = geolocationService.getBusinessHotspots(vendorData.location);

            // Generate promotional materials
            const promotionalMaterials = await ibmGraniteService.generatePromotionalMaterials({
                name: vendorData.name,
                businessType: vendorData.businessType,
                uniqueFeature: vendorData.uniqueFeature || 'Quality and freshness',
                targetAudience: vendorData.targetAudience || 'Local residents',
                location: vendorData.location,
            });

            // Generate UPI guide
            const upiGuide = await ibmGraniteService.generateUPIGuide(
                vendorData.name,
                vendorData.language || 'English'
            );

            // Generate pricing strategy if product data provided
            let pricingStrategy = null;
            if (vendorData.productType && vendorData.currentPrice) {
                pricingStrategy = await ibmGraniteService.generatePricingStrategy({
                    productType: vendorData.productType,
                    location: vendorData.location,
                    currentPrice: vendorData.currentPrice,
                    competitors: vendorData.competitors || 'Multiple',
                    demand: vendorData.demand || 'Medium',
                    productionCost: vendorData.productionCost || 'Unknown',
                });
            }

            // Generate QR code for vendor
            const qrData = {
                vendorId: profileId,
                name: vendorData.name,
                businessType: vendorData.businessType,
                location: vendorData.location,
                phone: vendorData.phone,
            };

            const qrCodeUrl = await this.generateQRCode(qrData);

            // Retrieve relevant knowledge base articles
            const kbArticles = ragEngine.retrieve(
                `${vendorData.businessType} business in ${vendorData.location}`,
                { maxResults: 5 }
            );

            // Build context from RAG
            const ragContext = ragEngine.buildContext(
                `${vendorData.businessType} ${vendorData.location}`,
                { maxResults: 3 }
            );

            // Localize if different language
            let localizedProfile = null;
            if (vendorData.language && vendorData.language !== 'English') {
                localizedProfile = await languageService.localizeContent(
                    businessProfile,
                    languageService.detectLanguage(vendorData.language) ||
                    Object.keys(languageService.getSupportedLanguages())[
                    Object.values(languageService.getSupportedLanguages()).indexOf(vendorData.language)
                    ]
                );
            }

            const completeProfile = {
                profileId,
                vendorInfo: {
                    name: vendorData.name,
                    businessType: vendorData.businessType,
                    location: vendorData.location,
                    phone: vendorData.phone,
                    email: vendorData.email,
                    language: vendorData.language || 'English',
                },
                businessProfile: localizedProfile || businessProfile,
                seoStrategy,
                pricingStrategy,
                promotionalMaterials,
                upiGuide,
                qrCode: qrCodeUrl,
                geographicInsights: geoInsights,
                nearbyHotspots: hotspots,
                knowledgeBaseArticles: kbArticles,
                ragContext: ragContext.substring(0, 500), // Truncate for display
                createdAt: new Date(),
                lastUpdated: new Date(),
            };

            return completeProfile;
        } catch (error) {
            console.error('Error generating vendor profile:', error.message);
            throw error;
        }
    }

    /**
     * Generate QR code for vendor
     * @param {object} data - Vendor data
     * @returns {Promise<string>} - QR code data URL
     */
    async generateQRCode(data) {
        try {
            const qrString = JSON.stringify(data);
            const qrCodeUrl = await QRCode.toDataURL(qrString, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
            return qrCodeUrl;
        } catch (error) {
            console.error('Error generating QR code:', error.message);
            throw error;
        }
    }

    /**
     * Generate onboarding steps for vendor
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - Onboarding steps
     */
    async generateOnboardingSteps(vendorData) {
        const kbArticles = ragEngine.retrieve('digital onboarding setup', { maxResults: 3 });

        return {
            steps: [
                {
                    stepNumber: 1,
                    title: 'Complete Your Profile',
                    description: 'Add detailed information about your business',
                    duration: '10 minutes',
                    resources: kbArticles.filter(a => a.category === 'digital_onboarding'),
                },
                {
                    stepNumber: 2,
                    title: 'Setup UPI Payment',
                    description: 'Enable digital payments with UPI',
                    duration: '15 minutes',
                    resources: ragEngine.retrieve('UPI setup', { maxResults: 2 }),
                },
                {
                    stepNumber: 3,
                    title: 'Create Business Listings',
                    description: 'List your business on online platforms',
                    duration: '20 minutes',
                    resources: ragEngine.retrieve('online listing platforms', { maxResults: 3 }),
                },
                {
                    stepNumber: 4,
                    title: 'Generate QR Code',
                    description: 'Create and display your payment QR code',
                    duration: '5 minutes',
                    resources: ragEngine.retrieve('QR code benefits', { maxResults: 1 }),
                },
                {
                    stepNumber: 5,
                    title: 'Optimize for Local SEO',
                    description: 'Improve your online visibility locally',
                    duration: '15 minutes',
                    resources: ragEngine.retrieve('local SEO strategy', { maxResults: 3 }),
                },
            ],
            estimatedTotalTime: '65 minutes',
            supportContact: 'support@vendor-agent.local',
        };
    }

    /**
     * Generate marketing recommendations
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - Marketing strategy
     */
    async generateMarketingStrategy(vendorData) {
        const prompt = `Create a comprehensive digital marketing strategy for this vendor:
Business: ${vendorData.name}
Type: ${vendorData.businessType}
Location: ${vendorData.location}
Target Audience: ${vendorData.targetAudience || 'Local community'}

Include:
1. Social Media Strategy (platforms, posting frequency, content ideas)
2. Word-of-Mouth Tactics
3. Local Partnership Opportunities
4. Seasonal Campaigns
5. Customer Loyalty Program Ideas
6. Online Review Strategy
7. Budget-Friendly Marketing Ideas
8. Metrics to Track

Format as JSON.`;

        const response = await ibmGraniteService.generateContent(prompt, { max_tokens: 2000 });
        return JSON.parse(response);
    }

    /**
     * Generate credit access guide
     * @param {object} vendorData - Vendor information
     * @returns {Promise<object>} - Credit access information
     */
    async generateCreditAccessGuide(vendorData) {
        const msmSchemes = ragEngine.retrieve('MSME schemes credit', { maxResults: 5 });

        return {
            vendor: vendorData.name,
            businessType: vendorData.businessType,
            eligibleSchemes: msmSchemes.map(scheme => ({
                name: scheme.title,
                description: scheme.content.substring(0, 200),
                category: scheme.category,
                source: 'Government of India / IBM Knowledge Base',
            })),
            documentationNeeded: [
                'Business Registration Document',
                'Bank Statement (6 months)',
                'Business Plan/Proposal',
                'PAN/Aadhaar',
                'Address Proof',
                'Collateral Valuation (if applicable)',
            ],
            nextSteps: [
                'Visit nearest bank branch',
                'Consult with business correspondent',
                'Prepare required documents',
                'Apply for selected scheme',
                'Track application status online',
            ],
        };
    }

    /**
     * Generate engagement tips
     * @param {object} vendorData - Vendor information
     * @returns {Promise<string>} - Engagement tips
     */
    async generateEngagementTips(vendorData) {
        const prompt = `Generate customer engagement tips for this street vendor:
Business: ${vendorData.name}
Type: ${vendorData.businessType}
Location: ${vendorData.location}

Provide practical, actionable tips for:
1. Building Customer Relationships
2. Handling Customer Feedback
3. Creating Repeat Business
4. Using Technology for Engagement
5. Handling Complaints
6. Creating Community Connection
7. Personal Touch Strategies
8. Long-term Customer Loyalty

Make it relevant for informal retail.`;

        return await ibmGraniteService.generateContent(prompt, { max_tokens: 1500 });
    }
}

module.exports = new VendorProfileService();
