import React, { useState } from 'react';
import axios from 'axios';
import { FiLoader, FiMapPin, FiUsers, FiTrendingUp, FiClock } from 'react-icons/fi';
import '../styles/LocalInsights.css';

const LocalInsights = () => {
    const [location, setLocation] = useState('');
    const [businessType, setBusinessType] = useState('general');
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetInsights = async (e) => {
        e.preventDefault();
        if (!location.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/location-insights`,
                {
                    params: {
                        location,
                        businessType,
                    },
                }
            );
            setInsights(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch insights');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="local-insights">
            <div className="insights-header">
                <h1>Local Market Insights</h1>
                <p>Understand your local market and optimize your business location</p>
            </div>

            <form className="insights-form" onSubmit={handleGetInsights}>
                <div className="form-group">
                    <label>Your Location</label>
                    <input
                        type="text"
                        placeholder="e.g., Camp, Pune or Marine Drive, Mumbai"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Business Type</label>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                        <option value="general">General</option>
                        <option value="food">Food & Beverages</option>
                        <option value="apparel">Apparel</option>
                        <option value="electronics">Electronics</option>
                        <option value="services">Services</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? <FiLoader className="spinner" /> : 'Get Insights'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {insights && (
                <div className="insights-results">
                    {/* Demographics Section */}
                    {insights.demographics && (
                        <section className="insights-section">
                            <h2>
                                <FiUsers /> Market Demographics
                            </h2>
                            <div className="insights-grid">
                                <div className="insight-item">
                                    <span className="label">Primary Age Group</span>
                                    <span className="value">{insights.demographics.ageGroup}</span>
                                </div>
                                <div className="insight-item">
                                    <span className="label">Income Level</span>
                                    <span className="value">{insights.demographics.incomeLevel}</span>
                                </div>
                                <div className="insight-item">
                                    <span className="label">Total Population</span>
                                    <span className="value">{insights.demographics.population}</span>
                                </div>
                                <div className="insight-item">
                                    <span className="label">Tourist Density</span>
                                    <span className="value">{insights.demographics.touristDensity}</span>
                                </div>
                            </div>

                            {insights.demographics.recommendations && (
                                <div className="recommendations">
                                    <h3>Recommendations</h3>
                                    <ul>
                                        {insights.demographics.recommendations.map((rec, idx) => (
                                            <li key={idx}>✓ {rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Peak Hours Section */}
                    {insights.peakHours && (
                        <section className="insights-section">
                            <h2>
                                <FiClock /> Peak Operating Hours
                            </h2>
                            <div className="peak-hours">
                                <div className="hour-item">
                                    <span>Opening Time:</span>
                                    <strong>{insights.peakHours.start}</strong>
                                </div>
                                <div className="hour-item">
                                    <span>Closing Time:</span>
                                    <strong>{insights.peakHours.end}</strong>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Hotspots Section */}
                    {insights.hotspots && insights.hotspots.length > 0 && (
                        <section className="insights-section">
                            <h2>
                                <FiMapPin /> Business Hotspots
                            </h2>
                            <div className="hotspots-list">
                                {insights.hotspots.map((hotspot, idx) => (
                                    <div key={idx} className="hotspot-item">
                                        <span className="hotspot-number">{idx + 1}</span>
                                        <span className="hotspot-name">{hotspot}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Location Suggestion Section */}
                    {insights.locationSuggestion && (
                        <section className="insights-section">
                            <h2>
                                <FiTrendingUp /> Location Recommendation
                            </h2>
                            {insights.locationSuggestion.success === false ? (
                                <p>{insights.locationSuggestion.message}</p>
                            ) : (
                                <div className="suggestion-content">
                                    <div className="suggestion-item">
                                        <h3>Recommended Areas</h3>
                                        <ul>
                                            {insights.locationSuggestion.recommendedAreas?.map((area, idx) => (
                                                <li key={idx}>{area}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="suggestion-item">
                                        <h3>Operating Hours</h3>
                                        <p>
                                            {insights.locationSuggestion.peakOperatingHours?.start} -{' '}
                                            {insights.locationSuggestion.peakOperatingHours?.end}
                                        </p>
                                    </div>

                                    <div className="suggestion-item">
                                        <h3>Expected Foot Traffic</h3>
                                        <p className="traffic-badge">
                                            {insights.locationSuggestion.expectedFootTraffic}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocalInsights;
