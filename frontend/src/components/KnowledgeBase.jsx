import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLoader, FiSearch, FiFilter, FiExternalLink } from 'react-icons/fi';
import '../styles/KnowledgeBase.css';

const KnowledgeBase = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchKnowledgeBase();
    }, []);

    const fetchKnowledgeBase = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/knowledge-base`
            );

            if (response.data.data.categories) {
                setCategories(response.data.data.categories);
            } else {
                setArticles(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching knowledge base:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/knowledge-base`,
                {
                    params: {
                        query: searchQuery,
                        category: selectedCategory,
                    },
                }
            );
            setArticles(response.data.data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="knowledge-base">
            <div className="kb-header">
                <h1>Knowledge Base</h1>
                <p>Resources for growing your digital presence</p>
            </div>

            <div className="kb-search">
                <form onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search MSME schemes, digital setup, pricing tips..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </div>
                </form>

                <div className="filters">
                    <FiFilter />
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                    >
                        <option value="">All Categories</option>
                        <option value="msme_schemes">MSME Schemes</option>
                        <option value="digital_onboarding">Digital Onboarding</option>
                        <option value="local_business_tips">Business Tips</option>
                        <option value="payment_solutions">Payment Solutions</option>
                    </select>
                </div>
            </div>

            <div className="kb-content">
                {loading ? (
                    <div className="loading-state">
                        <FiLoader className="spinner" />
                        <p>Loading resources...</p>
                    </div>
                ) : articles.length > 0 ? (
                    <div className="articles-grid">
                        {articles.map((article) => (
                            <div key={article.id} className="article-card">
                                <div className="article-header">
                                    <h3>{article.title}</h3>
                                    <span className="category-badge">{article.category}</span>
                                </div>

                                <p className="article-excerpt">
                                    {article.content.substring(0, 150)}...
                                </p>

                                <div className="article-footer">
                                    <span className="relevance">
                                        {article.relevanceScore && `Match: ${article.relevanceScore}%`}
                                    </span>
                                    <a href="#" className="read-more">
                                        Read More <FiExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No articles found. Try a different search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBase;
