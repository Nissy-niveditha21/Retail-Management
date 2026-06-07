import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VendorOnboarding from './components/VendorOnboarding';
import AgentChat from './components/AgentChat';
import VendorProfileDisplay from './components/VendorProfileDisplay';
import KnowledgeBase from './components/KnowledgeBase';
import LocalInsights from './components/LocalInsights';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [vendorId, setVendorId] = useState(localStorage.getItem('vendorId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'vendor');

  const handleProfileCreated = (profileData) => {
    setVendorId(profileData.profileId);
    localStorage.setItem('vendorId', profileData.profileId);
    localStorage.setItem('userRole', 'vendor');
  };

  return (
    <Router>
      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Vendor Onboarding */}
        <Route
          path="/vendor/onboarding"
          element={<VendorOnboarding onProfileCreated={handleProfileCreated} />}
        />

        {/* AI Agent Chat */}
        <Route path="/vendor/agent" element={<AgentChat />} />

        {/* Vendor Dashboard */}
        <Route
          path="/vendor/dashboard"
          element={vendorId ? <VendorDashboard vendorId={vendorId} /> : <Navigate to="/vendor/onboarding" />}
        />

        {/* Vendor Profile */}
        <Route
          path="/vendor/profile/:vendorId"
          element={<VendorProfileDisplay vendorId={vendorId} />}
        />

        {/* Knowledge Base */}
        <Route path="/knowledge-base" element={<KnowledgeBase />} />

        {/* Local Market Insights */}
        <Route path="/local-insights" element={<LocalInsights />} />

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Landing Page Component
function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🌐 Street Vendor Digitalization Agent</h1>
          </div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#technology">Technology</a></li>
            <li><a href="/vendor/onboarding" className="btn-primary">Get Started</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Street Business into a Digital Powerhouse</h1>
          <p>Powered by IBM Granite & Retrieval-Augmented Generation (RAG)</p>
          <a href="/vendor/onboarding" className="btn-primary btn-large">
            Start Your Digital Journey Today
          </a>
        </div>
      </section>

      <section id="features" className="features">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎯"
            title="Business Profiling"
            desc="Generate compelling business profiles automatically"
          />
          <FeatureCard
            icon="💳"
            title="UPI Setup Guide"
            desc="Easy digital payment integration"
          />
          <FeatureCard
            icon="📍"
            title="Local SEO Strategy"
            desc="Optimize your online presence locally"
          />
          <FeatureCard
            icon="💰"
            title="Pricing Strategy"
            desc="Data-driven pricing recommendations"
          />
          <FeatureCard
            icon="📱"
            title="Marketing Materials"
            desc="Ready-to-use promotional content"
          />
          <FeatureCard
            icon="🏛️"
            title="Gov Schemes"
            desc="Access to MSME policies & support"
          />
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <Step num="1" title="Tell Us About Your Business" desc="Simply describe what you sell and where" />
          <Step num="2" title="AI Generates Your Profile" desc="Our RAG-powered agent creates comprehensive strategies" />
          <Step num="3" title="Get Actionable Insights" desc="Receive marketing, pricing, and SEO recommendations" />
          <Step num="4" title="Go Digital" desc="Access guides for UPI, listings, and customer engagement" />
        </div>
      </section>

      <section id="technology" className="technology">
        <h2>Powered By</h2>
        <div className="tech-stack">
          <TechBadge name="IBM Granite" desc="Advanced LLM" />
          <TechBadge name="RAG Engine" desc="Knowledge Retrieval" />
          <TechBadge name="IBM Cloud" desc="Reliable Infrastructure" />
          <TechBadge name="Multi-Language" desc="Hindi, Marathi & More" />
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 Street Vendor Digitalization Agent. Empowering Informal Businesses.</p>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// Step Component
function Step({ num, title, desc }) {
  return (
    <div className="step">
      <div className="step-number">{num}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// Tech Badge Component
function TechBadge({ name, desc }) {
  return (
    <div className="tech-badge">
      <strong>{name}</strong>
      <small>{desc}</small>
    </div>
  );
}

// Vendor Dashboard Component
function VendorDashboard({ vendorId }) {
  return (
    <div className="vendor-dashboard">
      <nav className="dashboard-nav">
        <h2>Vendor Dashboard</h2>
        <ul>
          <li><a href={`/vendor/profile/${vendorId}`}>My Profile</a></li>
          <li><a href="/vendor/agent">AI Agent</a></li>
          <li><a href="/knowledge-base">Knowledge Base</a></li>
          <li><a href="/local-insights">Local Insights</a></li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <VendorProfileDisplay vendorId={vendorId} />
      </main>
    </div>
  );
}
