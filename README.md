# 🚀 trainly - Hybrid Athlete Training Platform

A full-stack, AI-powered training platform for hybrid athletes built with Next.js 14, Supabase, and modern web technologies.

## ✨ Features

### 🔐 Authentication

- **Email/Password login** via Supabase Auth
- **Strava OAuth** integration for seamless onboarding
- Secure session management

### 📊 Core Functionality

- **AI-Powered Training Plans** - Personalized plans generated with OpenAI GPT-4
- **Strava Integration** - Automatic activity sync and analysis
- **Smart Calendar** - Intelligent training schedule with adaptation
- **Real-time Dashboard** - Overview of training progress and metrics
- **Nutrition Tracking** - Optional fueling and recovery guidance
- **Performance Analytics** - Deep insights into training effectiveness

### 🏃‍♂️ Multi-Sport Support

- Running, Cycling, Swimming, Triathlon
- Weight Lifting, CrossFit, Climbing
- Martial Arts and other hybrid sports

### 💳 Subscription Model

- **Free tier** with basic features
- **Premium subscription** via Stripe integration
- Feature gating and billing management

### 📱 Mobile-First Design

- Responsive layout optimized for mobile
- Dark mode by default
- PWA-ready for mobile installation
- Clean, modern UI with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-4o for training plan generation
- **Payments**: Stripe for subscription management
- **OAuth**: Strava API integration
- **Deployment**: Railway-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Strava API credentials
- OpenAI API key
- Stripe account (for payments)

### 1. Installation

```bash
# Clone and install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 2. Environment Setup

Create `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Strava OAuth
NEXT_PUBLIC_STRAVA_CLIENT_ID=your-strava-client-id
STRAVA_CLIENT_SECRET=your-strava-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# App
# Local: use http://localhost:3000
# Prod: set to https://www.trainly.app in your environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL schema in your Supabase dashboard:

```bash
# Execute the schema file in Supabase SQL editor
cat supabase/schema.sql
```

### 4. Configure OAuth Providers

**Strava OAuth:**

1. Create app at [Strava Developers](https://developers.strava.com/)
2. Set callback URL (dev): `http://localhost:3000/auth/callback`
   Set callback URL (prod): `https://www.trainly.app/auth/callback`
3. Add client ID/secret to environment variables

**Supabase Auth:**

1. Enable email provider in Supabase Auth settings
2. Configure Strava OAuth provider with your credentials

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
trainly/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard routes
│   ├── onboarding/        # User onboarding flow
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── onboarding/       # Onboarding flow
│   ├── providers/        # Context providers
│   ├── strava/           # Strava integration
│   ├── training/         # Training components
│   └── ui/               # UI component library
├── lib/                  # Utility functions
├── supabase/            # Database schema
└── types/               # TypeScript definitions
```

## 🔑 Key Components

### Authentication Flow

1. **Landing Page** - Marketing page with feature overview
2. **Login/Register** - Email or Strava OAuth options
3. **Onboarding** - Goal setting, sport selection, experience level
4. **Dashboard** - Main application interface

### Database Schema

- **profiles** - User data and preferences
- **training_plans** - AI-generated or manual training plans
- **training_sessions** - Individual workout sessions
- **strava_activities** - Synced Strava data

### API Integration

- **Strava API** - Activity sync and athlete data
- **OpenAI API** - Training plan generation and adaptation
- **Stripe API** - Subscription and payment management

## 🌟 Features in Detail

### AI Training Plans

- Analyzes user goals, experience, and activity data
- Generates periodized training schedules
- Adapts based on performance and recovery
- Supports multiple sports and training phases

### Strava Integration

- OAuth login and account linking
- Automatic activity import
- Training load analysis
- Session completion tracking

### Smart Calendar

- Visual training schedule
- Session type indicators
- Completion status tracking
- Intensity and duration display

### Analytics Dashboard

- Weekly/monthly progress tracking
- Training load distribution
- Performance trend analysis
- Goal achievement metrics

## 🚀 Deployment

### Vercel Deployment

```bash
# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
# Update OAuth redirect URLs for production
```

### Environment Configuration

1. Update Strava OAuth redirect URLs
2. Configure Supabase production environment
3. Set up Stripe webhooks for production
4. Configure OpenAI API rate limits

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript validation
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

## 📝 License

Private project - All rights reserved.

## 🤝 Contributing

This is a private project. For issues or feature requests, please contact the development team.

---

**trainly** - Train smarter, not harder. 🏋️‍♂️🏃‍♀️🚴‍♂️
