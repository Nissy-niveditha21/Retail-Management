/**
 * Vendor Controller
 * Handles vendor profile operations and vendor-related endpoints
 */

const VendorProfile = require('../models/VendorProfile');
const vendorProfileService = require('../services/vendorProfileService');
const ragEngine = require('../services/ragEngine');
const geolocationService = require('../services/geolocationService');

exports.createVendorProfile = async (req, res) => {
    try {
        const {
            name,
            businessType,
            email,
            phone,
            location,
            productsServices,
            experience,
            uniqueFeature,
            targetAudience,
            language,
        } = req.body;

        // Validate required fields
        if (!name || !businessType || !phone || !location) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, businessType, phone, location',
            });
        }

        // Generate comprehensive profile using RAG + Granite
        console.log('Generating comprehensive vendor profile...');
        const generatedProfile = await vendorProfileService.generateComprehensiveProfile({
            name,
            businessType,
            email,
            phone,
            location,
            productsServices,
            experience: experience || 0,
            uniqueFeature,
            targetAudience,
            language: language || 'English',
        });

        // Create and save vendor profile
        const vendorProfile = new VendorProfile({
            name,
            businessType,
            email,
            phone,
            location: {
                fullLocation: location,
                city: location.split(',')[location.split(',').length - 1].trim(),
                area: location.split(',')[0],
            },
            productsServices,
            experience,
            uniqueFeature,
            targetAudience,
            preferredLanguage: language || 'en',
            businessProfile: generatedProfile.businessProfile,
            seoStrategy: generatedProfile.seoStrategy,
            promotionalMaterials: generatedProfile.promotionalMaterials,
            upiSetupGuide: generatedProfile.upiGuide,
            qrCodeUrl: generatedProfile.qrCode,
            geographicInsights: generatedProfile.geographicInsights,
            nearbyHotspots: generatedProfile.nearbyHotspots,
            knowledgeBaseArticles: generatedProfile.knowledgeBaseArticles,
            ragContextUsed: generatedProfile.ragContext,
        });

        await vendorProfile.save();

        res.status(201).json({
            success: true,
            message: 'Vendor profile created successfully',
            profileId: vendorProfile._id,
            data: {
                vendor: {
                    name: vendorProfile.name,
                    businessType: vendorProfile.businessType,
                    location: vendorProfile.location.fullLocation,
                },
                profile: generatedProfile,
            },
        });
    } catch (error) {
        console.error('Error creating vendor profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating vendor profile',
            error: error.message,
        });
    }
};

exports.getVendorProfile = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await VendorProfile.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor profile not found',
            });
        }

        res.status(200).json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        console.error('Error fetching vendor profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor profile',
            error: error.message,
        });
    }
};

exports.updateVendorProfile = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const updates = req.body;

        // Check if location is being updated
        if (updates.location) {
            updates['location.fullLocation'] = updates.location;
            updates['location.city'] = updates.location.split(',')[updates.location.split(',').length - 1].trim();
        }

        const vendor = await VendorProfile.findByIdAndUpdate(
            vendorId,
            { ...updates, lastProfileUpdate: new Date() },
            { new: true, runValidators: true }
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor profile not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vendor profile updated successfully',
            data: vendor,
        });
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vendor profile',
            error: error.message,
        });
    }
};

exports.searchVendors = async (req, res) => {
    try {
        const { keyword, businessType, location, city } = req.query;

        let query = { isActive: true };

        if (keyword) {
            query.$or = [
                { name: new RegExp(keyword, 'i') },
                { productsServices: new RegExp(keyword, 'i') },
                { uniqueFeature: new RegExp(keyword, 'i') },
            ];
        }

        if (businessType) {
            query.businessType = businessType;
        }

        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        if (location) {
            query['location.fullLocation'] = new RegExp(location, 'i');
        }

        const vendors = await VendorProfile.find(query)
            .select('name businessType location rating phone')
            .limit(20);

        res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
        });
    } catch (error) {
        console.error('Error searching vendors:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching vendors',
            error: error.message,
        });
    }
};

exports.getOnboardingSteps = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await VendorProfile.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found',
            });
        }

        const steps = await vendorProfileService.generateOnboardingSteps({
            name: vendor.name,
            businessType: vendor.businessType,
            location: vendor.location.fullLocation,
        });

        res.status(200).json({
            success: true,
            data: steps,
        });
    } catch (error) {
        console.error('Error fetching onboarding steps:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching onboarding steps',
            error: error.message,
        });
    }
};

exports.getMarketingStrategy = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await VendorProfile.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found',
            });
        }

        const strategy = await vendorProfileService.generateMarketingStrategy({
            name: vendor.name,
            businessType: vendor.businessType,
            location: vendor.location.fullLocation,
            targetAudience: vendor.targetAudience,
        });

        res.status(200).json({
            success: true,
            data: strategy,
        });
    } catch (error) {
        console.error('Error generating marketing strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating marketing strategy',
            error: error.message,
        });
    }
};

exports.getCreditAccessGuide = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await VendorProfile.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found',
            });
        }

        const guide = await vendorProfileService.generateCreditAccessGuide({
            name: vendor.name,
            businessType: vendor.businessType,
        });

        res.status(200).json({
            success: true,
            data: guide,
        });
    } catch (error) {
        console.error('Error generating credit guide:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating credit guide',
            error: error.message,
        });
    }
};

exports.getLocationInsights = async (req, res) => {
    try {
        const { location, businessType } = req.query;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: 'Location parameter required',
            });
        }

        const insights = {
            demographics: geolocationService.getDemographicInsights(location),
            peakHours: geolocationService.getPeakHours(location),
            hotspots: geolocationService.getBusinessHotspots(location),
            locationSuggestion: geolocationService.suggestOptimalLocation(
                location.split(',')[location.split(',').length - 1].trim(),
                businessType || 'general'
            ),
        };

        res.status(200).json({
            success: true,
            data: insights,
        });
    } catch (error) {
        console.error('Error fetching location insights:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching location insights',
            error: error.message,
        });
    }
};

exports.getKnowledgeBase = async (req, res) => {
    try {
        const { query, category, language } = req.query;

        let results;

        if (query) {
            results = ragEngine.retrieve(query, {
                maxResults: 10,
                category: category || null,
                language: language || 'English',
            });
        } else {
            const categories = ragEngine.getCategories();
            results = {
                categories,
                stats: ragEngine.getStats(),
            };
        }

        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error('Error fetching knowledge base:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching knowledge base',
            error: error.message,
        });
    }
};
