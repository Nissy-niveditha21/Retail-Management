
# Street Vendor Digitalization Agent 

Professional, production-oriented implementation of a Street Vendor Digitalization Agent. This project demonstrates building a practical, high-impact full-stack application that combines Retrieval-Augmented Generation (RAG), IBM Granite LLM, geolocation insights, and a voice-first vendor administration experience.

**Project Goals**

- Empower informal and micro businesses (street vendors) to quickly adopt digital payments and simple online presence strategies.
- Generate actionable, localized business profiles and onboarding guidance using RAG-grounded LLM responses.
- Deliver a lightweight voice-enabled admin interface for fast, low-friction daily operations.

**Highlights (What Makes This Internship Project Stand Out)**

- RAG + LLM integration: Uses a retrieval system to ground Granite model outputs in verified knowledge (MSME schemes, onboarding guides, payment workflows).
- Multi-language support: Content and interaction flows designed to support local languages for better adoption.
- Geolocation-aware recommendations: Local SEO, peak-hour insights, and location-specific business tips.
- Production-ready patterns: Environment-driven configuration, response caching, modular services, and clear separation of concerns.

**Live Local Preview**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

**Key Features**

- AI-generated vendor profiles and onboarding guides (IBM Granite)
- Searchable knowledge base (RAG) with MSME policy references
- Voice-first admin interface for quick payments and confirmations
- UPI setup guidance and QR code generation
- Local SEO and pricing strategy recommendations
- Vendor profile persistence (MongoDB) and CRUD APIs

**Architecture Overview**

The application follows a modular service architecture:

- Backend: Express + Node.js with service modules (ibmGraniteService, ragEngine, languageService, geolocationService, vendorProfileService)
- Frontend: React + Vite with focused components (VendorOnboarding, AgentChat, VendorProfileDisplay, KnowledgeBase, LocalInsights)
- Data: MongoDB with a comprehensive `VendorProfile` schema

**Tech Stack**

- Node.js, Express, MongoDB, Mongoose
- React (Vite), Axios
- IBM Granite (watsonx / Granite LLM)
- RAG (custom retrieval engine), node-cache

**Quick Start — Development**

1. Clone the repository

```bash
git clone <your-repo-url>
cd Retail-Management
```

2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, IBM_GRANITE_API_KEY, IBM_GRANITE_PROJECT_ID
npm install
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

**Important Environment Variables (backend/.env)**

- `MONGODB_URI` — MongoDB connection string
- `IBM_GRANITE_API_KEY` — IBM Cloud Watsonx API key (required for full AI functionality)
- `IBM_GRANITE_PROJECT_ID` — Watsonx project identifier
- `PORT`, `CORS_ORIGIN`, `JWT_SECRET` — runtime configuration

**Selected API Endpoints**

- `POST /api/vendor/create` — Create vendor profile (triggers AI profile generation)
- `GET /api/vendor/:id` — Fetch vendor profile
- `POST /api/agent/query` — Query the AI agent (RAG + Granite)
- `GET /api/knowledge-base` — Browse RAG documents

Example: Create a vendor (curl)

```bash
curl -X POST http://localhost:5000/api/vendor/create \
	-H "Content-Type: application/json" \
	-d '{
		"name":"Ram",
		"businessType":"fruit-vendor",
		"phone":"9876543210",
		"location":"Camp, Pune",
		"productsServices":"Fresh fruits",
		"language":"en"
	}'
```

**Notes for Evaluation / Interview**

- Be prepared to explain the RAG prompt construction flow and how retrieved docs improve LLM outputs.
- Discuss trade-offs for caching LLM responses and the approach to cost-control with API rate limiting.
- Highlight accessibility choices made for voice-first interactions and how they aid real users.

**Future Roadmap**

- Production hardening (HTTPS, rate-limiting, secrets management)
- Expand regional language support and offline voice recognition fallbacks
- Mobile-first client or progressive web app
- Integrations with payment providers and MSME onboarding portals

**Contributing & Contact**

If you want to review the code or need a demo for your interview, reach out to the project owner or open an issue.

**License**

This repository is provided for demo and evaluation purposes. Include license details here if required by your organization.

---

Built for internship showcase — optimized for clarity, impact, and technical depth.

---

<!-- Badges -->
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org/)
[![IBM Granite](https://img.shields.io/badge/IBM-Granite-purple.svg)](https://www.ibm.com/products/granite-llm)

![Hero](https://img.shields.io/badge/Street%20Vendor%20Digitalization-Agent-667eea?style=for-the-badge&logo=appveyor)

## Quick Visual Summary

- Theme: Gradient purple (🔵 #667eea → 🟣 #764ba2)
- UX focus: Voice-first admin, minimal controls, clear CTAs
- Core capability: RAG-grounded LLM generation (IBM Granite) + Local insights

---

## Table of Contents

- [Project Goals](#project-goals)
- [Highlights](#highlights-what-makes-this-internship-project-stand-out)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Quick Start — Development](#quick-start--development)
- [Demo Commands](#demo-commands)
- [Interview Notes](#notes-for-evaluation--interview)
- [Roadmap](#future-roadmap)

---

