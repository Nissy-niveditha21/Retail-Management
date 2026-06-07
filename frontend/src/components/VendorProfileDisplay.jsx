import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { FiDownload, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import '../styles/VendorProfileDisplay.css';

const VendorProfileDisplay = ({ vendorId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
    const qrRef = React.useRef();

    useEffect(() => {
        if (vendorId) {
            fetchProfile();
        }
    }, [vendorId]);

    useEffect(() => {
        if (profile && !profile.qrCodeUrl) {
            generateQRCode();
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vendor/${vendorId}`
            );
            setProfile(response.data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateQRCode = async () => {
        try {
            if (!profile) return;
            const qrData = JSON.stringify({
                name: profile.name,
                business: profile.businessType,
                location: profile.location?.fullLocation,
            });
            const dataUrl = await QRCode.toDataURL(qrData, { width: 200 });
            setQrCodeDataUrl(dataUrl);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const downloadQRCode = () => {
        const url = qrCodeDataUrl || profile?.qrCodeUrl;
        if (!url) return;
        const link = document.createElement('a');
        link.download = `qr-code-${profile.name}.png`;
        link.href = url;
        link.click();
    };

    if (loading) {
        return <div className="loading"><FiLoader className="spinner" /> Loading profile...</div>;
    }

    if (error) {
        return <div className="error"><FiAlertCircle /> {error}</div>;
    }

    if (!profile) {
        return <div className="error">No profile found</div>;
    }

    return (
        <div className="vendor-profile-display">
            <div className="profile-header">
                <div className="profile-title">
                    <h1>{profile.name}</h1>
                    <p className="business-type">{profile.businessType.toUpperCase()}</p>
                    <p className="location">📍 {profile.location?.fullLocation || 'Location not specified'}</p>
                </div>

                <div className="qr-section">
                    <h3>Your Business QR Code</h3>
                    <div className="qr-code-container" ref={qrRef}>
                        {profile.qrCodeUrl ? (
                            <img src={profile.qrCodeUrl} alt="Business QR Code" />
                        ) : qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="Business QR Code" />
                        ) : (
                            <div className="qr-placeholder">Generating QR Code...</div>
                        )}
                    </div>
                    <button className="download-btn" onClick={downloadQRCode}>
                        <FiDownload /> Download QR
                    </button>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seo')}
                >
                    Local SEO
                </button>
                <button
                    className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pricing')}
                >
                    Pricing Strategy
                </button>
                <button
                    className={`tab ${activeTab === 'marketing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('marketing')}
                >
                    Marketing
                </button>
                <button
                    className={`tab ${activeTab === 'upi' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upi')}
                >
                    UPI Setup
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <section className="profile-section">
                            <h2>Business Profile</h2>
                            <div className="profile-info">
                                {typeof profile.businessProfile === 'string' ? (
                                    <p>{profile.businessProfile}</p>
                                ) : (
                                    <div className="profile-json">
                                        {Object.entries(profile.businessProfile || {}).map(([key, value]) => (
                                            <div key={key} className="info-item">
                                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                <p>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="profile-section">
                            <h2>Geographic Insights</h2>
                            {profile.geographicInsights && (
                                <div className="insights-grid">
                                    <div className="insight-card">
                                        <h4>Age Group</h4>
                                        <p>{profile.geographicInsights.ageGroup}</p>
                                    </div>
                                    <div className="insight-card">
                                        <h4>Income Level</h4>
                                        <p>{profile.geographicInsights.incomeLevel}</p>
                                    </div>
                                    <div className="insight-card">
                                        <h4>Population</h4>
                                        <p>{profile.geographicInsights.population}</p>
                                    </div>
                                    <div className="insight-card">
                                        <h4>Tourist Density</h4>
                                        <p>{profile.geographicInsights.touristDensity}</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="tab-content">
                        <section className="profile-section">
                            <h2>Local SEO Strategy</h2>
                            {profile.seoStrategy && (
                                <div className="strategy-content">
                                    {Object.entries(profile.seoStrategy).map(([key, value]) => (
                                        <div key={key} className="strategy-item">
                                            <h3>{key.replace(/_/g, ' ').toUpperCase()}</h3>
                                            {Array.isArray(value) ? (
                                                <ul>
                                                    {value.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{JSON.stringify(value)}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="tab-content">
                        <section className="profile-section">
                            <h2>Pricing Strategy</h2>
                            {profile.pricingStrategy ? (
                                <div className="pricing-content">
                                    {Object.entries(profile.pricingStrategy).map(([key, value]) => (
                                        <div key={key} className="pricing-item">
                                            <h3>{key.replace(/_/g, ' ').toUpperCase()}</h3>
                                            {Array.isArray(value) ? (
                                                <ul>
                                                    {value.map((item, idx) => (
                                                        <li key={idx}>• {item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{JSON.stringify(value)}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Pricing strategy not yet generated. Add product details to your profile.</p>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'marketing' && (
                    <div className="tab-content">
                        <section className="profile-section">
                            <h2>Promotional Materials</h2>
                            {profile.promotionalMaterials && (
                                <div className="marketing-content">
                                    {Object.entries(profile.promotionalMaterials).map(([key, value]) => (
                                        <div key={key} className="marketing-item">
                                            <h3>{key.replace(/_/g, ' ').toUpperCase()}</h3>
                                            {Array.isArray(value) ? (
                                                <ul>
                                                    {value.map((item, idx) => (
                                                        <li key={idx}>
                                                            <em>"{item}"</em>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="tagline">"{value}"</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'upi' && (
                    <div className="tab-content">
                        <section className="profile-section">
                            <h2>UPI Setup Guide</h2>
                            {profile.upiSetupGuide ? (
                                <div className="upi-guide">
                                    {profile.upiSetupGuide.split('\n').map((line, idx) => (
                                        line.trim() && (
                                            <p key={idx} className={line.match(/^[\d]+\./) ? 'step' : ''}>
                                                {line}
                                            </p>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <p>UPI setup guide not available</p>
                            )}
                        </section>
                    </div>
                )}
            </div>

            <div className="profile-footer">
                <p>Last Updated: {new Date(profile.lastProfileUpdate).toLocaleDateString()}</p>
                <button className="refresh-btn" onClick={fetchProfile}>
                    Refresh Profile
                </button>
            </div>
        </div>
    );
};

export default VendorProfileDisplay;
