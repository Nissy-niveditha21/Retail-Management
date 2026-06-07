
<div align="center">

# 🛍️ Street Vendor Digitalization Agent

**Empowering informal economies with digital visibility, automated payments, and context-aware customer engagement.**

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with](https://img.shields.io/badge/Built%20with-IBM%20Granite%20%7C%20RAG-purple.svg)](#-core-features--capabilities)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 🎯 Project Overview

A production‑oriented, full‑stack implementation designed to empower street vendors and micro‑businesses. By combining **Retrieval‑Augmented Generation (RAG)**, the **IBM Granite LLM**, geolocation tracking, and a voice‑first admin dashboard, this solution delivers practical, high‑impact digital tools to informal businesses.

### 💡 Key Goals
* **Financial & Digital Inclusion:** Enable informal businesses to adopt digital payments & build an automated online storefront.
* **Localized Contextualization:** Generate hyper-localized business profiles and onboarding guides using RAG-grounded LLM responses.
* **Low-Friction Operation:** Provide a hands-free, voice-enabled admin interface designed for fast daily operations by vendors on the move.

---

## 🚀 Core Features & Capabilities

### 🧠 RAG-Grounded AI Engine (IBM Granite)
* Utilizes **IBM Granite LLM** to generate accurate, context-aware business responses.
* Implements **Retrieval-Augmented Generation (RAG)** to ingest localized marketplace data, legal compliance steps, and municipal guidelines, completely mitigating AI hallucinations.

### 📍 Geolocation Insights
* Automatically tags vendor locations to map out local micro-marketplaces.
* Helps customers find nearby street vendors in real-time while providing vendors with helpful foot-traffic data.

### 🎙️ Voice-First Admin Interface
* Built with native speech-to-text functionality to allow busy vendors to update daily inventory, changing prices, or update locations hands-free.
* Supports multi-lingual and localized dialect processing to lower the technological barrier to entry.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Vendor Voice/Web Input] -->|FastAPI API Gateway| B(FastAPI Backend)
    B -->|Query / Vector Search| C{RAG Orchestrator}
    C -->|Context Retrieval| D[(Vector DB / pgvector)]
    C -->|Augmented Prompt| E[IBM Granite LLM]
    E -->|Structured Output| B
    B -->|Real-Time Sync| F[Client Mobile Web UI]

```

---

## 🛠️ Tech Stack & Dependencies

* **Frontend UI:** React.js / Next.js (Styled beautifully via Tailwind CSS for a mobile-first UI)
* **Backend Server:** FastAPI / Python 3.10+
* **LLM Orchestration:** IBM Granite via IBM watsonx.ai / LangChain
* **Vector Database:** ChromaDB / pgvector (for localized vector embeddings)
* **Core DB:** PostgreSQL (for vendor user profiles and transaction logs)

---

## 💻 Getting Started

### Installation & Local Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/Nissy-niveditha21/Retail-Management.git](https://github.com/Nissy-niveditha21/Retail-Management.git)
cd Retail-Management

```


2. **Backend Engine Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

```


3. **Configure Environment Variables (.env):**
Create a `.env` file in the `backend` root directory:
```env
WATSONX_APIKEY=your_ibm_api_key_here
PROJECT_ID=your_watsonx_project_id_here
DATABASE_URL=postgresql://user:password@localhost:5432/retail_db

```


4. **Frontend UI Setup:**
```bash
cd ../frontend
npm install
npm run dev

```



---

## 📊 API Reference Engine

| Method | Endpoint | Description | Target |
| --- | --- | --- | --- |
| **POST** | `/api/v1/vendor/register` | Registers a new street vendor profile | Vendor Database |
| **POST** | `/api/v1/agent/query` | Interacts with the RAG-grounded IBM Granite Agent | Core LLM Model |
| **PUT** | `/api/v1/vendor/location` | Updates vendor GPS coordinates in real-time | PostGIS / Map |
| **POST** | `/api/v1/voice/process` | Transcribes and executes voice commands for inventory | Speech Pipeline |

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.

```

```
