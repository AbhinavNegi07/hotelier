# Otelier - Hotel Search & Comparison Platform

A modern, production-ready hospitality frontend application built with React 18, featuring secure authentication, hotel search with filters, and an interactive comparison engine.

![React](https://img.shields.io/badge/React-18.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF)

## 🌟 Features

- **🔐 Secure Authentication** - Login/Signup with Supabase (JWT-based)
- **🔍 Advanced Hotel Search** - Filter by location, dates, guests, price, and rating
- **📊 Comparison Engine** - Compare up to 4 hotels with interactive charts
- **💾 Persistent Selections** - Comparison list saved to localStorage
- **📱 Responsive Design** - Mobile-first, works on all devices
- **🎨 Premium UI** - Glassmorphism, animations, dark theme

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) Supabase account for authentication
- (Optional) Amadeus API credentials for live data

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd otelier-assignment

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase (Required for real auth)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Amadeus API (Optional - uses mock data if not set)
VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id
VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

# API Mode
VITE_API_MODE=mock  # 'mock' or 'live'
```

> **Note:** The app runs in **Demo Mode** without Supabase credentials, allowing you to test all features with mock data and simulated auth.

## 📁 Project Structure

```
src/
├── api/                 # API integration layer
│   ├── supabase.js      # Supabase client
│   ├── hotelApi.js      # Hotel API service
│   └── mockData.js      # Mock hotel data
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature components
│   └── layout/          # Layout components
├── context/             # React Context providers
├── hooks/               # Custom hooks
├── pages/               # Route views
└── utils/               # Helper functions
```

## 🛠️ Tech Stack

| Category   | Technology          |
| ---------- | ------------------- |
| Framework  | React 18 (Hooks)    |
| Build Tool | Vite 6              |
| Styling    | Tailwind CSS 4      |
| Routing    | React Router 7      |
| Auth       | Supabase            |
| Charts     | Recharts            |
| State      | Context API + Hooks |

## 📋 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Authentication

The app uses Supabase for authentication:

1. **Sign Up** - Create account with email/password
2. **Sign In** - Login with credentials
3. **Protected Routes** - Dashboard and Comparison require auth
4. **JWT Tokens** - Automatically handled by Supabase client

### Demo Mode

Without Supabase credentials, the app runs in Demo Mode:

- Enter any email/password to simulate login
- All features work with mock data

## 🏨 Hotel Search

Features:

- **Location Search** - Search by city name
- **Date Selection** - Check-in/Check-out dates
- **Guest Count** - Select number of guests
- **Price Filter** - Min/max price range
- **Star Rating** - Filter by hotel stars
- **Sorting** - Price, rating, name
- **Pagination** - Load More button

## 📊 Comparison Engine

Compare up to 4 hotels with:

- **Price Bar Chart** - Side-by-side price comparison
- **Rating Chart** - User rating vs star rating
- **Amenities Radar** - Feature comparison
- **Detailed Table** - All attributes compared

Selections persist in localStorage across sessions.

## 🎨 Design System

The app uses a custom design system with:

- **Colors** - Amber primary, Navy secondary, Teal accents
- **Typography** - Inter/Outfit fonts
- **Effects** - Glassmorphism, blur, shadows
- **Animations** - Smooth transitions and micro-interactions

## 📱 Responsive Breakpoints

| Breakpoint | Width          |
| ---------- | -------------- |
| Mobile     | < 640px        |
| Tablet     | 640px - 1024px |
| Desktop    | > 1024px       |

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy /dist folder
```

### Environment Variables

Set the following in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_MODE`

## 📝 API Integration

### Current: Mock Data

The app uses realistic mock data (20 hotels) that mirrors the Amadeus API structure.

### Future: Amadeus API

To enable live data:

1. Get Amadeus API credentials
2. Set `VITE_API_MODE=live`
3. Add API credentials to `.env`

## 🧪 Testing Checklist

- [x] Login with valid credentials
- [x] Signup with new account
- [x] Protected route redirect
- [x] Search hotels by location
- [x] Apply filters (price, rating)
- [x] Pagination works
- [x] Add hotels to comparison
- [x] View comparison charts
- [x] LocalStorage persistence
- [x] Logout functionality
- [x] Responsive on mobile


