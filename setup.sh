#!/bin/bash

# Street Vendor Digitalization Agent - Quick Setup Guide
# This script helps you set up the complete environment

echo "🌟 Street Vendor Digitalization Agent - Setup"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
npm install

echo ""
echo "📝 Creating .env file for backend..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env created. Please edit it with your IBM Granite credentials:"
    echo "   - IBM_GRANITE_API_KEY"
    echo "   - IBM_GRANITE_PROJECT_ID"
    echo "   - MONGODB_URI"
else
    echo "✅ .env already exists"
fi

cd ..
echo ""

# Frontend Setup
echo "🎨 Setting up Frontend..."
cd frontend
npm install

echo ""
echo "📝 Creating .env.local for frontend..."
if [ ! -f .env.local ]; then
    echo "VITE_API_URL=http://localhost:5000" > .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

cd ..
echo ""

echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure backend/.env with your IBM Granite credentials"
echo "2. Ensure MongoDB is running"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo "5. Visit http://localhost:5173"
echo ""
echo "📖 Read VENDOR_AGENT_README.md for detailed documentation"
