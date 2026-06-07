# IBM Granite & Cloud Lite Setup Guide

This document provides step-by-step instructions to set up IBM Granite and Cloud Lite services for the Street Vendor Digitalization Agent.

---

## 📋 Prerequisites

- IBM Cloud account (free tier available)
- Node.js 16+
- MongoDB (local or Atlas cloud)
- Git

---

## 🔧 Step 1: Create IBM Cloud Account

### 1.1 Sign Up
1. Visit [IBM Cloud](https://cloud.ibm.com)
2. Click **Create Account**
3. Choose **Lite Account** (free, no credit card required initially)
4. Complete email verification

### 1.2 Account Setup
1. Log in to IBM Cloud
2. Accept terms and conditions
3. Skip optional setup steps if needed

---

## 🤖 Step 2: Set Up IBM Granite (Watsonx)

### 2.1 Access Watsonx
1. In IBM Cloud console, click **Catalog** 
2. Search for **watsonx.ai**
3. Click on the Watsonx AI service
4. Click **Create** (Lite plan should be available)

### 2.2 Create API Key
1. In Watsonx dashboard, go to **Manage** section
2. Click **API Keys** on the left sidebar
3. Click **Create new API Key**
4. Name it: `vendor-agent-key`
5. Click **Create**
6. **Important:** Copy and save this key securely - you won't see it again!

### 2.3 Get Project ID
1. In Watsonx, go to **Projects** section
2. Create a new project or use existing one
3. In project settings, find **Project ID**
4. Copy the Project ID

### 2.4 Note Down Services
From Watsonx, note:
- **Project ID**: `xxxxx-xxxxx-xxxxx`
- **API Key**: `xxxx-xxxx-xxxx`
- **Region**: Usually `us-south`

---

## 💾 Step 3: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Try Free**
3. Sign up or log in
4. Create a cluster (Free tier available)
5. Set up database user credentials
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/street-vendor-agent
   ```

### Option B: MongoDB Local

1. Download and install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Connection string:
   ```
   mongodb://localhost:27017/street-vendor-agent
   ```

---

## 🚀 Step 4: Configure Backend Environment

### 4.1 Create .env File
```bash
cd backend
cp .env.example .env
```

### 4.2 Edit .env with Your Credentials

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/street-vendor-agent

# IBM Cloud Configuration (from Step 2)
IBM_GRANITE_API_KEY=your_api_key_from_step_2
IBM_GRANITE_PROJECT_ID=your_project_id_from_step_2
IBM_GRANITE_BASE_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/generation

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Other settings
JWT_SECRET=your_secret_key_here
LOG_LEVEL=info
CACHE_TTL=3600
```

### 4.3 Verify Credentials
1. Ensure all required fields are filled
2. No spaces around `=` sign
3. Check for typos

---

## 📦 Step 5: Install Dependencies

### 5.1 Backend Dependencies
```bash
cd backend
npm install
```

### 5.2 Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 🧪 Step 6: Test Configuration

### 6.1 Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
Server is running on port 5000
Database connected successfully
```

### 6.2 Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v... built in ... ms
> Local: http://localhost:5173/
```

### 6.3 Test the Application
1. Open browser to `http://localhost:5173`
2. Should see landing page
3. Click "Get Started" to test vendor onboarding

---

## 🔍 Troubleshooting

### Issue: "IBM Granite API Error: 401 Unauthorized"
**Solution:**
- Verify API key is correct
- Check API key hasn't expired
- Generate new API key if needed

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Verify MONGODB_URI is correct
- Check MongoDB service is running (for local)
- Verify network access (for Atlas) - add your IP to whitelist

### Issue: "Cannot find module..."
**Solution:**
```bash
# Reinstall dependencies
npm install

# Clear npm cache if persistent
npm cache clean --force
npm install
```

### Issue: Port 5000 or 5173 already in use
**Solution:**
```bash
# Change PORT in .env
PORT=5001

# Or kill process on port
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

---

## 📊 Testing API Endpoints

### Test IBM Granite Connection
```bash
curl -X POST http://localhost:5000/api/agent/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the benefits of UPI for street vendors?"
  }'
```

### Create a Vendor Profile
```bash
curl -X POST http://localhost:5000/api/vendor/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Vendor",
    "businessType": "food",
    "phone": "9876543210",
    "location": "Camp, Pune",
    "productsServices": "Fresh fruits",
    "language": "en"
  }'
```

---

## 📚 IBM Granite Documentation

- [Granite Models](https://www.ibm.com/products/granite-llm)
- [Watsonx API Docs](https://cloud.ibm.com/docs/watsonx?topic=watsonx-getting-started)
- [Authentication](https://cloud.ibm.com/docs/account?topic=account-iamoverview)

---

## 🎓 Understanding the Integration

### How IBM Granite is Used

1. **Service Initialization**
   ```javascript
   // In ibmGraniteService.js
   const apiKey = process.env.IBM_GRANITE_API_KEY;
   const projectId = process.env.IBM_GRANITE_PROJECT_ID;
   ```

2. **Content Generation**
   ```javascript
   const response = await axios.post(baseUrl, {
     model_id: 'ibm/granite-13b-instruct-v2',
     input: prompt,
     parameters: { max_tokens: 1024 }
   });
   ```

3. **Response Caching**
   - Responses cached for 1 hour
   - Reduces API calls and costs
   - Improves performance

### RAG (Retrieval-Augmented Generation)

1. **Knowledge Base**: Pre-loaded with MSME schemes, guides, tips
2. **Query Processing**: User query analyzed for keywords
3. **Document Retrieval**: Relevant documents from KB retrieved
4. **Context Building**: Retrieved docs formatted as context
5. **Prompt Enhancement**: Context added to user prompt
6. **LLM Generation**: Granite generates grounded response

---

## 💡 Best Practices

### Security
- ✅ Never commit .env file to Git
- ✅ Rotate API keys regularly
- ✅ Use strong JWT secrets
- ✅ Enable HTTPS in production

### Performance
- ✅ Enable response caching
- ✅ Use connection pooling
- ✅ Implement rate limiting
- ✅ Monitor API usage

### Development
- ✅ Use .env.example as template
- ✅ Test endpoints before production
- ✅ Log important operations
- ✅ Keep dependencies updated

---

## 📞 Getting Help

### If You're Stuck:

1. **Check Logs**: Look at terminal output for error messages
2. **Verify Credentials**: Double-check .env file
3. **Test Connectivity**: 
   ```bash
   # Check MongoDB
   mongo <your_connection_string>
   
   # Check IBM Cloud
   curl -X GET https://us-south.ml.cloud.ibm.com/status
   ```
4. **Read Documentation**: Check IBM Cloud and MongoDB docs
5. **Community Support**: 
   - IBM Cloud Support: https://cloud.ibm.com/unifiedsupport
   - MongoDB Support: https://support.mongodb.com

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Node.js installed and verified
- [ ] IBM Cloud account created
- [ ] Watsonx AI service created
- [ ] API Key and Project ID obtained
- [ ] MongoDB connection string available
- [ ] .env file created with all credentials
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Landing page displays correctly
- [ ] API endpoints respond successfully

---

## 🎉 You're Ready!

Once all items in the checklist are complete:

1. Visit http://localhost:5173
2. Click "Get Started"
3. Fill in vendor details
4. Watch your AI-powered profile generation
5. Explore all features
6. Start empowering street vendors!

---

**Happy Building! 🚀**

For questions or issues, refer to:
- VENDOR_AGENT_README.md - Full project documentation
- .env.example - Environment variables reference
- Backend logs - Check console for error details
