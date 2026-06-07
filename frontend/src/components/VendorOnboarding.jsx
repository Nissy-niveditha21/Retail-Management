import React, { useState } from 'react';
import axios from 'axios';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import '../styles/VendorOnboarding.css';

const VendorOnboarding = ({ onProfileCreated }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        businessType: 'food',
        email: '',
        phone: '',
        location: '',
        productsServices: '',
        experience: 0,
        uniqueFeature: '',
        targetAudience: '',
        language: 'en',
    });

    const [profile, setProfile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vendor/create`,
                formData
            );

            setProfile(response.data.data.profile);
            setStep(4);
            onProfileCreated?.(response.data);
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Error creating profile: ' + error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const businessTypes = [
        { value: 'food', label: 'Food & Beverages' },
        { value: 'apparel', label: 'Apparel & Fashion' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'handicrafts', label: 'Handicrafts' },
        { value: 'services', label: 'Services' },
        { value: 'other', label: 'Other' },
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'Hindi' },
        { value: 'mr', label: 'Marathi' },
        { value: 'gu', label: 'Gujarati' },
        { value: 'ta', label: 'Tamil' },
    ];

    return (
        <div className="vendor-onboarding">
            <div className="onboarding-container">
                <div className="onboarding-header">
                    <h1>Street Vendor Digitalization Agent</h1>
                    <p>Transform your street business into a digital powerhouse</p>
                </div>

                {step === 1 && (
                    <div className="onboarding-step">
                        <h2>Welcome, Vendor!</h2>
                        <p>Let's get your business digitalized in just a few steps.</p>
                        <button
                            className="btn-primary"
                            onClick={() => setStep(2)}
                        >
                            Get Started <FiArrowRight />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="onboarding-step">
                        <h2>Basic Information</h2>
                        <form>
                            <div className="form-group">
                                <label>Business Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your shop/business name"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Business Type *</label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {businessTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit mobile number"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                                    Back
                                </button>
                                <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                                    Next <FiArrowRight />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="onboarding-step">
                        <h2>Business Details</h2>
                        <form>
                            <div className="form-group">
                                <label>What do you sell or offer? *</label>
                                <textarea
                                    name="productsServices"
                                    value={formData.productsServices}
                                    onChange={handleInputChange}
                                    placeholder="Describe your products/services"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Location (City/Area) *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Camp, Pune or Marine Drive, Mumbai"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>What makes your business unique?</label>
                                <input
                                    type="text"
                                    name="uniqueFeature"
                                    value={formData.uniqueFeature}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Fresh organic produce, 24/7 service"
                                />
                            </div>

                            <div className="form-group">
                                <label>Who is your target audience?</label>
                                <input
                                    type="text"
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Students, office workers, families"
                                />
                            </div>

                            <div className="form-group">
                                <label>Preferred Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                >
                                    {languages.map(lang => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? <FiLoader className="spinner" /> : 'Create My Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 4 && profile && (
                    <div className="onboarding-step success">
                        <h2>🎉 Profile Created Successfully!</h2>
                        <p>Your comprehensive business profile has been generated.</p>

                        <div className="profile-summary">
                            <div className="summary-card">
                                <h3>Business Profile</h3>
                                <p className="summary-snippet">
                                    {typeof profile.businessProfile === 'string'
                                        ? profile.businessProfile.substring(0, 150)
                                        : JSON.stringify(profile.businessProfile).substring(0, 150)
                                    }...
                                </p>
                            </div>

                            <div className="summary-card">
                                <h3>What's Included</h3>
                                <ul>
                                    <li>✓ Business Profile & USP</li>
                                    <li>✓ Local SEO Strategy</li>
                                    <li>✓ Pricing Recommendations</li>
                                    <li>✓ Marketing Materials</li>
                                    <li>✓ UPI Setup Guide</li>
                                    <li>✓ QR Code</li>
                                </ul>
                            </div>
                        </div>

                        <button className="btn-primary" onClick={() => window.location.href = '/vendor/dashboard'}>
                            Go to Dashboard <FiArrowRight />
                        </button>
                    </div>
                )}

                <div className="onboarding-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
                    <div className={`progress-line ${step >= 4 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>✓</div>
                </div>
            </div>
        </div>
    );
};

export default VendorOnboarding;
