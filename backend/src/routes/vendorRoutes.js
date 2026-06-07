const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const agentController = require('../controllers/agentController');

// ==================== VENDOR ROUTES ====================

// Create new vendor profile
router.post('/vendor/create', vendorController.createVendorProfile);

// Get vendor profile by ID
router.get('/vendor/:vendorId', vendorController.getVendorProfile);

// Update vendor profile
router.put('/vendor/:vendorId', vendorController.updateVendorProfile);

// Search vendors
router.get('/vendors/search', vendorController.searchVendors);

// Get onboarding steps for vendor
router.get('/vendor/:vendorId/onboarding', vendorController.getOnboardingSteps);

// Get marketing strategy for vendor
router.get('/vendor/:vendorId/marketing-strategy', vendorController.getMarketingStrategy);

// Get credit access guide
router.get('/vendor/:vendorId/credit-guide', vendorController.getCreditAccessGuide);

// Get location insights
router.get('/location-insights', vendorController.getLocationInsights);

// Get knowledge base
router.get('/knowledge-base', vendorController.getKnowledgeBase);

// ==================== AGENT ROUTES ====================

// Query the AI agent
router.post('/agent/query', agentController.queryAgent);

// Get business recommendations
router.post('/agent/recommendations', agentController.getBusinessRecommendations);

// Handle natural language business description
router.post('/agent/natural-language-profile', agentController.handleNaturalLanguageProfile);

// Search policies and schemes
router.get('/agent/policies', agentController.searchPoliciesAndSchemes);

// Get multi-language content
router.post('/agent/multi-language', agentController.getMultiLanguageContent);

module.exports = router;
