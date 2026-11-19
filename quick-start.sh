#!/bin/bash

# STEPS Public - Quick Start Script
# This script helps you get the project running quickly

set -e

echo "════════════════════════════════════════════════════════════════"
echo "  STEPS Public - Quick Start Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your OpenAI API credentials:"
    echo "   OPENAI_API_KEY=your-api-key-here"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Show next steps
echo "════════════════════════════════════════════════════════════════"
echo "  Next Steps:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. Configure your OpenAI API key in .env:"
echo "   nano .env  # or use your preferred editor"
echo ""
echo "2. Start the development server:"
echo "   npm run start:dev"
echo ""
echo "3. Open the API documentation:"
echo "   http://localhost:3001/api"
echo ""
echo "📚 For more information, see:"
echo "   - README.md - Detailed project documentation"
echo "   - SETUP_GUIDE.md - Installation and troubleshooting"
echo "   - PROJECT_SUMMARY.md - Architecture and structure"
echo ""
echo "════════════════════════════════════════════════════════════════"
