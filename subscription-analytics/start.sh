#!/bin/bash

# Subscription Analytics & Recommendation System Startup Script

echo "🚀 Starting Subscription Analytics & Recommendation System"
echo "=========================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update your Gemini API key in the .env file"
fi

# Import dataset if database doesn't exist
if [ ! -f "subscription_analytics.db" ]; then
    echo "📊 Importing dataset from Excel file..."
    python data/import_dataset.py
fi

# Start the application
echo "🌐 Starting the application on http://localhost:8000"
echo "📊 Demo accounts:"
echo "   Admin: admin@demo.com / admin123"
echo "   User: user@demo.com / password123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py
