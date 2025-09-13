# Subscription Analytics & Recommendation System

A comprehensive system that provides AI-powered user recommendations and admin analytics for subscription management.

## Features

### User Features
- **AI-Powered Recommendations**: Get personalized subscription recommendations based on usage patterns and pricing preferences using Gemini 2.5 Pro
- **Usage Analytics**: View personal usage statistics and trends

### Admin Features
- **User Analytics Dashboard**: Comprehensive view of all users with subscription insights
- **Renewal Likelihood Prediction**: AI-powered analysis of user renewal probability
- **Cancellation Risk Assessment**: Identify users at risk of canceling subscriptions
- **Usage & Pricing Analytics**: Detailed breakdowns of user behavior patterns

## Tech Stack

- **Backend**: FastAPI with Python
- **Frontend**: HTML, CSS, JavaScript with modern UI components
- **AI**: Google Gemini 2.5 Pro API
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **Authentication**: JWT-based role management

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your Gemini API key to .env
   ```

3. Run the application:
   ```bash
   python main.py
   ```

## API Endpoints

### User Endpoints
- `GET /api/user/recommendations` - Get AI-powered recommendations
- `GET /api/user/usage` - Get user usage statistics

### Admin Endpoints
- `GET /api/admin/analytics` - Get comprehensive user analytics
- `GET /api/admin/renewal-predictions` - Get renewal likelihood predictions
- `GET /api/admin/users` - Get all users with subscription data

## Project Structure

```
subscription-analytics/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   ├── api/                 # API routes
│   └── utils/               # Utility functions
├── frontend/
│   ├── user/                # User-facing pages
│   ├── admin/               # Admin dashboard
│   └── static/              # CSS, JS, images
├── data/                    # Sample datasets
└── requirements.txt
```
