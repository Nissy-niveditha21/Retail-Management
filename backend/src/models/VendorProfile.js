const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true,
    },
    businessType: {
        type: String,
        required: true,
        enum: ['food', 'apparel', 'electronics', 'handicrafts', 'services', 'other'],
    },
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },

    // Location Information
    location: {
        city: String,
        area: String,
        fullLocation: String,
        coordinates: {
            latitude: Number,
            longitude: Number,
        },
    },

    // Business Details
    productsServices: String,
    experience: {
        type: Number,
        default: 0,
    },
    uniqueFeature: String,
    targetAudience: String,
    challenges: String,

    // Financial Information
    productType: String,
    currentPrice: String,
    competitors: String,
    demand: String,
    productionCost: String,
    monthlyRevenue: Number,

    // Generated Profiles & Strategies
    businessProfile: mongoose.Schema.Types.Mixed,
    seoStrategy: mongoose.Schema.Types.Mixed,
    pricingStrategy: mongoose.Schema.Types.Mixed,
    promotionalMaterials: mongoose.Schema.Types.Mixed,
    marketingStrategy: mongoose.Schema.Types.Mixed,

    // Digital Setup
    upiSetupGuide: String,
    upiMerchantId: String,
    qrCodeUrl: String,

    // Geolocation & Demographics
    geographicInsights: mongoose.Schema.Types.Mixed,
    nearbyHotspots: [String],
    peakOperatingHours: {
        start: String,
        end: String,
    },

    // Knowledge Base & Resources
    knowledgeBaseArticles: [mongoose.Schema.Types.Mixed],
    eligibleMSMESchemes: [mongoose.Schema.Types.Mixed],
    onboardingSteps: [mongoose.Schema.Types.Mixed],

    // Language & Localization
    preferredLanguage: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'bn', 'pa'],
    },

    // Engagement & Metrics
    customerEngagementTips: String,
    engagementTipsLanguage: String,
    creditAccessGuide: mongoose.Schema.Types.Mixed,
    onboardingProgress: {
        profileComplete: Boolean,
        upiSetup: Boolean,
        businessListingsCreated: Boolean,
        qrCodeGenerated: Boolean,
        seoOptimized: Boolean,
        completionPercentage: {
            type: Number,
            default: 0,
        },
    },

    // Ratings & Reviews
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: [{
        customerName: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
    }],

    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },

    // Metadata
    lastProfileUpdate: { type: Date, default: Date.now },
    profileVersion: { type: Number, default: 1 },
    ragContextUsed: String,

}, { timestamps: true });

// Indexes for faster queries
vendorProfileSchema.index({ name: 1 });
vendorProfileSchema.index({ 'location.city': 1 });
vendorProfileSchema.index({ businessType: 1 });
vendorProfileSchema.index({ phone: 1 });
vendorProfileSchema.index({ isActive: 1 });

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
