import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiLoader, FiMessageCircle, FiCopy, FiCheck } from 'react-icons/fi';
import '../styles/AgentChat.css';

const AgentChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m your Street Vendor Digitalization Agent. I can help you with:\n\n• Business profiling & branding\n• UPI & digital payment setup\n• Local SEO strategies\n• Pricing recommendations\n• Marketing tips\n• Government schemes & policies\n• Customer engagement strategies\n\nWhat would you like help with today?',
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('English');
    const [copied, setCopied] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/query`,
                {
                    query: userMessage.content,
                    language: language === 'English' ? 'en' : language,
                }
            );

            const botMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: response.data.data.response,
                actionItems: response.data.data.actionItems,
                originalResponse: response.data.data.response,
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: `Sorry, I encountered an error: ${error.response?.data?.message || error.message}. Please try again.`,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyToClipboard = (messageId, content) => {
        navigator.clipboard.writeText(content);
        setCopied(messageId);
        setTimeout(() => setCopied(null), 2000);
    };

    const quickQuestions = [
        "How do I set up UPI payments?",
        "What are the best pricing strategies?",
        "How can I improve my local online presence?",
        "What government schemes am I eligible for?",
    ];

    return (
        <div className="agent-chat">
            <div className="chat-header">
                <div className="header-content">
                    <FiMessageCircle className="header-icon" />
                    <div>
                        <h1>Vendor Digitalization Agent</h1>
                        <p>Powered by IBM Granite & RAG</p>
                    </div>
                </div>
                <div className="language-selector">
                    <label>Language:</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                        <option>Gujarati</option>
                        <option>Tamil</option>
                    </select>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 1 && (
                    <div className="quick-questions">
                        <h3>Quick Questions</h3>
                        <div className="questions-grid">
                            {quickQuestions.map((q, index) => (
                                <button
                                    key={index}
                                    className="quick-question-btn"
                                    onClick={() => {
                                        setInput(q);
                                        setTimeout(() => handleSendMessage(), 100);
                                    }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.type}`}>
                        <div className="message-content">
                            <div className="message-text">
                                {message.type === 'bot' ? (
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                ) : (
                                    <p>{message.content}</p>
                                )}
                            </div>

                            {message.actionItems && message.actionItems.length > 0 && (
                                <div className="action-items">
                                    <h4>Action Items:</h4>
                                    <ul>
                                        {message.actionItems.map((item, idx) => (
                                            <li key={idx}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                className="copy-btn"
                                onClick={() => copyToClipboard(message.id, message.content)}
                                title="Copy to clipboard"
                            >
                                {copied === message.id ? (
                                    <FiCheck size={16} />
                                ) : (
                                    <FiCopy size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message bot">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <div className="input-wrapper">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about growing your digital presence... (Press Enter to send)"
                        rows="3"
                        disabled={loading}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSendMessage}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? <FiLoader className="spinner" /> : <FiSend />}
                    </button>
                </div>
                <p className="input-hint">Powered by IBM Granite & Retrieval-Augmented Generation</p>
            </div>
        </div>
    );
};

export default AgentChat;
