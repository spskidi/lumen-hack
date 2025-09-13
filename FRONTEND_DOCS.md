# Subscription Management Frontend Documentation

## Project Overview
A responsive, modern web application for managing subscriptions with a clean UI and smooth user experience.

## Tech Stack
- **Framework**: React 18
- **Styling**: Tailwind CSS with custom theme
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API + useReducer
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements (Button, Card, etc.)
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   └── home/            # Page-specific components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service layer
├── styles/              # Global styles and themes
└── utils/               # Utility functions
```

## Key Features Implemented

### 1. Responsive Layout
- Mobile-first design
- Responsive navigation
- Dark/light mode support
- Accessible components

### 2. UI Components
- **Button**: Customizable button with variants
- **Card**: Reusable card component
- **Loading Spinner**: Animated loading indicator
- **Error Boundary**: Graceful error handling
- **Testimonial Carousel**: Interactive testimonial slider

### 3. Pages
- **Home Page**: Hero section, features, pricing, testimonials
- **Dashboard**: Subscription overview (placeholder)
- **Pricing**: Subscription plans (placeholder)

### 4. Navigation
- Responsive header with mobile menu
- Smooth scrolling
- Active link highlighting

## Backend Integration Points

### Required API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

#### Subscriptions
- `GET /api/subscriptions` - Get all user subscriptions
- `POST /api/subscriptions` - Add new subscription
- `GET /api/subscriptions/:id` - Get subscription details
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

#### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update settings

## Environment Variables
Create a `.env` file in the project root with:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_ANALYTICS_ID=YOUR_GA_ID
```

## Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Deployment
Build for production:
```bash
npm run build
```

## Team Notes
- All API calls are centralized in the `services/` directory
- Use the custom `useApi` hook for API calls
- Follow the component structure for consistency
- Add PropTypes for all components
- Write tests for new components
