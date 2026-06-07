# Street Vendor Digitalization Agent

A comprehensive RAG-powered platform that helps street vendors and micro-entrepreneurs in India become digitally visible and grow their businesses.

**Powered by:** IBM Granite LLM + Retrieval-Augmented Generation (RAG)

---

## 🎯 Problem Statement

Local street vendors and micro-entrepreneurs struggle with:
- Digital visibility and online presence
- Complex payment solutions
- Pricing strategies
- Marketing and customer engagement
- Access to government schemes and support

**Our Solution:** An AI-driven agent that generates business profiles, digital setup guides, marketing strategies, and connects vendors to resources—all powered by RAG and IBM Granite.

---

## ✨ Key Features

### 1. **Comprehensive Business Profiling**
- Automatic generation of compelling business descriptions
- Unique selling point identification
- Target audience analysis
- Growth opportunity recommendations

### 2. **Digital Payment Integration**
- Step-by-step UPI setup guides
- Multiple language support
- QR code generation
- Payment security tips

### 3. **Local SEO Strategy**
- Location-based keyword optimization
- Google Business Profile recommendations
- Online directory listing suggestions
- Local citation building strategies

### 4. **Pricing Intelligence**
- Market-based price recommendations
- Competitor analysis
- Seasonal adjustment guidance
- Psychology-based pricing tactics

### 5. **Marketing & Engagement**
- Promotional material templates
- Social media strategies
- Customer engagement tips
- WhatsApp marketing guides

### 6. **Government Resources**
- MSME scheme information
- Credit access guides
- Digital onboarding steps
- Policy updates

### 7. **Geolocation Services**
- Market demographics analysis
- Peak hours identification
- Business hotspot mapping
- Location recommendations

### 8. **Multi-Language Support**
- English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi
- Automatic language detection
- Content localization

---

## 🏗️ Architecture

### Backend Stack
- **Framework:** Node.js + Express
- **Database:** MongoDB
- **AI/ML:** IBM Granite (via IBM Cloud Lite)
- **RAG Engine:** Custom knowledge base + retrieval system
- **Language Processing:** Google Translate API alternative

### Frontend Stack
- **Framework:** React 19 with Vite
- **Routing:** React Router v7
- **UI Components:** Custom styled components
- **QR Code:** qrcode.react
- **Markdown:** react-markdown

---

## 📦 Project Structure

```
street-vendor-agent/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── ibmGraniteService.js       # IBM Granite LLM integration
│   │   │   ├── ragEngine.js                # RAG knowledge base
│   │   │   ├── vendorProfileService.js     # Profile generation
│   │   │   ├── geolocationService.js       # Location insights
│   │   │   └── languageService.js          # Multi-language support
│   │   ├── controllers/
│   │   │   ├── vendorController.js         # Vendor endpoints
│   │   │   └── agentController.js          # AI agent endpoints
│   │   ├── models/
│   │   │   ├── VendorProfile.js            # Vendor schema
│   │   │   ├── Customer.js                 # Customer schema
│   │   │   ├── Bill.js                     # Bill schema
│   │   │   └── Expense.js                  # Expense schema
│   │   ├── routes/
│   │   │   └── vendorRoutes.js             # API routes
│   │   ├── config/
│   │   │   └── db.js                       # Database config
│   │   └── app.js                          # Express app
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VendorOnboarding.jsx        # Registration flow
│   │   │   ├── AgentChat.jsx               # AI chat interface
│   │   │   ├── VendorProfileDisplay.jsx    # Profile view
│   │   │   ├── KnowledgeBase.jsx           # Knowledge base UI
│   │   │   ├── LocalInsights.jsx           # Market insights
│   │   │   ├── Dashboard.jsx               # Admin dashboard
│   │   │   └── ...others
│   │   ├── styles/
│   │   │   ├── VendorOnboarding.css
│   │   │   ├── AgentChat.css
│   │   │   ├── VendorProfileDisplay.css
│   │   │   ├── KnowledgeBase.css
│   │   │   └── LocalInsights.css
│   │   ├── api/
│   │   │   └── axios.js                    # API client config
│   │   ├── App.jsx                         # Main app with routing
│   │   ├── App.css                         # Global styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── package.json (root)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- MongoDB (local or cloud)
- IBM Cloud account (for Granite)
- npm or yarn

### Environment Setup

#### Backend Setup

1. **Clone and navigate to backend:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/street-vendor-agent

# IBM Cloud Configuration (REQUIRED)
IBM_GRANITE_API_KEY=your_ibm_granite_api_key
IBM_GRANITE_PROJECT_ID=your_ibm_project_id
IBM_GRANITE_BASE_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/generation

# Server
PORT=5000
NODE_ENV=development

# Other configs...
```

4. **Get IBM Granite credentials:**
   - Visit [IBM Cloud](https://cloud.ibm.com)
   - Create a free Lite account
   - Set up Watsonx for Granite access
   - Generate API key

5. **Start backend:**
```bash
npm run dev
```

#### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
npm install
```

2. **Create `.env.local`:**
```env
VITE_API_URL=http://localhost:5000
```

3. **Start frontend:**
```bash
npm run dev
```

---

## 🔌 API Endpoints

### Vendor Endpoints
- `POST /api/vendor/create` - Create vendor profile
- `GET /api/vendor/:vendorId` - Get vendor profile
- `PUT /api/vendor/:vendorId` - Update vendor profile
- `GET /api/vendors/search` - Search vendors
- `GET /api/vendor/:vendorId/onboarding` - Get onboarding steps
- `GET /api/vendor/:vendorId/marketing-strategy` - Marketing strategy
- `GET /api/vendor/:vendorId/credit-guide` - Credit access guide
- `GET /api/location-insights` - Location insights
- `GET /api/knowledge-base` - Knowledge base articles

### Agent Endpoints
- `POST /api/agent/query` - Query the AI agent
- `POST /api/agent/recommendations` - Get recommendations
- `POST /api/agent/natural-language-profile` - Create profile from description
- `GET /api/agent/policies` - Search policies
- `POST /api/agent/multi-language` - Multi-language content

---

## 🤖 How RAG Works

### 1. **Knowledge Base Initialization**
The RAG engine initializes with documents covering:
- MSME schemes (Mudra, CLCSS, etc.)
- Digital onboarding guides
- Business pricing tips
- Payment solutions
- Customer engagement strategies

### 2. **Document Retrieval**
When a vendor queries:
1. Query is processed for keywords
2. Relevant documents are retrieved from knowledge base
3. Documents are ranked by relevance
4. Top-N documents are selected

### 3. **Context Building**
Retrieved documents are formatted as context:
```
Retrieved knowledge base documents:

Document 1: [Title]
Category: [Category]
Content: [Content...]
---

Document 2: [Title]
...
```

### 4. **LLM Generation**
Context is sent to IBM Granite along with the prompt:
- LLM reads the context
- Generates relevant, grounded response
- Response includes citations/references

### 5. **Response Enhancement**
- Action items are extracted
- Language translation (if needed)
- Caching for performance

---

## 🌐 Multi-Language Support

Supported languages:
- **English** (en)
- **Hindi** (hi)
- **Marathi** (mr)
- **Gujarati** (gu)
- **Tamil** (ta)
- **Telugu** (te)
- **Kannada** (kn)
- **Malayalam** (ml)
- **Bengali** (bn)
- **Punjabi** (pa)

Content is automatically translated using:
1. Primary generation in English
2. Translation to target language
3. Caching for repeated queries

---

## 💾 Database Models

### VendorProfile Schema
```javascript
{
  name: String,
  businessType: String,
  email: String,
  phone: String,
  location: Object,
  productsServices: String,
  experience: Number,
  uniqueFeature: String,
  targetAudience: String,
  businessProfile: Mixed,
  seoStrategy: Mixed,
  pricingStrategy: Mixed,
  promotionalMaterials: Mixed,
  qrCodeUrl: String,
  geographicInsights: Mixed,
  creditAccessGuide: Mixed,
  verificationStatus: String,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧠 IBM Granite Integration

### Configuration
```javascript
const ibmGraniteService = require('./services/ibmGraniteService');

// Generate profile
const profile = await ibmGraniteService.generateVendorProfile({
  name: 'Fresh Fruit Vendor',
  businessType: 'food',
  location: 'Camp, Pune',
  productsServices: 'Fresh fruit sales',
  experience: 5
});
```

### Model Details
- **Model ID:** `ibm/granite-13b-instruct-v2`
- **Max Tokens:** Configurable (1024-2000)
- **Temperature:** 0.7 (balanced creativity)
- **Cache:** 1 hour TTL for responses

---

## 📊 Features in Detail

### Vendor Onboarding Flow
1. Welcome screen
2. Basic info (name, business type, experience)
3. Business details (products, location, unique features)
4. Profile generation
5. Success screen with profile summary

### AI Agent Capabilities
- Answer vendor queries naturally
- Provide context from knowledge base
- Generate recommendations
- Support multiple languages
- Extract action items automatically

### Dashboard Features
- View comprehensive vendor profile
- Download QR codes
- Track onboarding progress
- View marketing materials
- Access knowledge base
- Get local market insights

---

## 🔐 Security Features

- API rate limiting
- Input validation
- Environment variable protection
- Secure password hashing
- JWT authentication ready
- CORS configuration
- SQL injection prevention (MongoDB)

---

## 📈 Performance Optimization

- **Caching:** 1-hour TTL for LLM responses
- **Document Indexing:** Fast keyword-based retrieval
- **Pagination:** Search results pagination
- **Lazy Loading:** Components load on demand
- **Image Optimization:** QR codes as data URLs

---

## 🧪 Testing

```bash
# Backend tests
npm run test

# Frontend tests
npm run test

# Build
npm run build
```

---

## 📝 Example Usage

### Create a Vendor Profile
```bash
curl -X POST http://localhost:5000/api/vendor/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Vegetables Stand",
    "businessType": "food",
    "phone": "9876543210",
    "location": "Main Market, Pune",
    "productsServices": "Fresh vegetables and fruits",
    "experience": 3,
    "uniqueFeature": "Organic and pesticide-free",
    "targetAudience": "Health-conscious families"
  }'
```

### Query the AI Agent
```bash
curl -X POST http://localhost:5000/api/agent/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I set up UPI payments for my vegetable shop?",
    "language": "hi"
  }'
```

---

## 🎓 Learning Resources

- [IBM Granite Documentation](https://www.ibm.com/products/granite-llm)
- [RAG Pattern](https://aws.amazon.com/blogs/machine-learning/retrieval-augmented-generation-with-amazon-bedrock/)
- [MSME India](https://msme.gov.in/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional knowledge base documents
- More geolocation data
- Enhanced RAG algorithms
- Mobile app
- Payment integration

---

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review GitHub issues
3. Contact support team

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

- **IBM Granite Team** for the LLM
- **Government of India** for MSME data
- **Community contributors** for feedback
- **Street vendors** for inspiring this project

---

## 🚀 Future Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Video tutorials in local languages
- [ ] Direct payment gateway integration
- [ ] Real-time customer reviews
- [ ] Inventory management
- [ ] Loyalty program tracking
- [ ] Government scheme application automation
- [ ] AI-powered pricing adjustments
- [ ] Community marketplace
- [ ] Regional expansion

---

**Empowering Street Vendors. Enabling Digital Growth. Unlocking Opportunities.**

**Transform your street business into a digital powerhouse today!**
