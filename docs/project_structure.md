# 🏗️ Project Structure - Khadum

## 📁 Project Overview

**Khadum** is a smart freelancer platform connecting clients with freelancers through WhatsApp, featuring secure payments and intelligent matching.

## 📂 Directory Structure

```
khadum/
├── 📁 docs/                          # Project documentation
│   ├── 📄 changelog.md               # Historical change tracking
│   └── 📄 project_structure.md       # Current architecture documentation
│
├── 📁 src/                           # Source code
│   ├── 📁 components/                # React components
│   │   ├── 📁 dashboard/             # Dashboard-specific components
│   │   │   ├── 📄 ExpandableSidebar.tsx
│   │   │   └── 📁 notifications/
│   │   ├── 📁 landing/               # Landing page components
│   │   │   ├── 📄 FAQSection.tsx     # FAQ section
│   │   │   ├── 📄 FeaturedGrid.tsx   # Featured items grid
│   │   │   ├── 📄 FeaturesEnhanced.tsx   # Enhanced features with multiple layouts
│   │   │   ├── 📄 Footer.tsx         # Page footer
│   │   │   ├── 📄 HeroEnhanced.tsx   # Enhanced hero with interactive calculator
│   │   │   ├── 📄 HowItWorksEnhanced.tsx   # Enhanced with visual timeline
│   │   │   ├── 📄 NavbarEnhanced.tsx   # Enhanced navigation bar
│   │   │   ├── 📄 PartnersSection.tsx      # Partner/client logos section
│   │   │   ├── 📄 PricingSection.tsx       # Pricing/subscription section
│   │   │   ├── 📄 StatisticsSection.tsx    # Statistics/trust metrics section
│   │   │   └── 📄 TestimonialsSection.tsx  # Testimonials/social proof section
│   │   ├── 📁 ui/                    # Reusable UI components (shadcn/ui)
│   │   ├── 📄 AuthGuard.tsx          # Authentication guard
│   │   ├── 📄 ThemeToggle.tsx        # Theme switcher
│   │   └── 📄 VerificationPending.tsx
│   │
│   ├── 📁 hooks/                     # Custom React hooks
│   ├── 📁 lib/                       # Utility libraries and services
│   │   ├── 📄 emailService.ts        # Email functionality
│   │   ├── 📄 profileService.ts      # User profile management
│   │   ├── 📄 projectsService.ts     # Projects management
│   │   ├── 📄 projectTagsService.ts  # Project tags management
│   │   ├── 📄 searchUtils.ts         # Search utilities
│   │   ├── 📄 supabase.ts            # Supabase client
│   │   └── 📄 utils.ts               # General utilities
│   │
│   ├── 📁 pages/                     # Page components
│   │   ├── 📁 administrator/         # Admin pages
│   │   ├── 📁 authentication/        # Auth pages
│   │   ├── 📁 dashboard/             # Dashboard pages
│   │   └── 📄 Index.tsx              # Landing page
│   │
│   ├── 📄 App.tsx                    # Main app component
│   ├── 📄 main.tsx                   # App entry point
│   └── 📄 index.css                  # Global styles
│
├── 📁 whatsapp-bot/                  # WhatsApp bot implementation (NOW TRACKED IN GIT)
│   ├── 📁 src/
│   │   ├── 📁 config/                # Bot configuration
│   │   ├── 📁 controllers/           # Bot controllers
│   │   ├── 📁 middleware/            # Bot middleware
│   │   ├── 📁 routes/                # Bot routes
│   │   │   ├── 📄 health.js          # Health check endpoint
│   │   │   ├── 📄 myfatoorah.js      # Payment processing routes
│   │   │   └── 📄 webhook.js         # Webhook handlers
│   │   ├── 📁 services/              # Bot services
│   │   │   ├── 📄 myfatoorahService.js   # MyFatoorah payment integration
│   │   │   ├── 📄 paymentExpirationService.js  # Payment expiration logic
│   │   │   └── 📄 whatsappService.js      # WhatsApp API integration
│   │   ├── 📁 utils/                 # Bot utilities
│   │   │   └── 📄 logger.js          # Logging functionality
│   │   └── 📄 index.js               # Bot entry point
│   └── 📄 package.json
│
├── 📁 supabase/                      # Supabase backend
│   └── 📁 functions/                 # Edge functions
│       └── 📁 send-review-notification/  # Email notification function
│           └── 📄 index.ts           # Sends review approval/rejection emails
│
├── 📄 package.json                   # Project dependencies
├── 📄 tsconfig.json                  # TypeScript config
├── 📄 vite.config.ts                 # Vite config
├── 📄 tailwind.config.ts             # Tailwind CSS config
└── 📄 vercel.json                    # Vercel deployment config
```

## 🎨 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **State Management**: React Hooks & Contexts

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Edge Functions**: Supabase Functions
- **Real-time**: Supabase Realtime

### WhatsApp Bot
- **Runtime**: Node.js
- **AI Integration**: Google Gemini
- **Payment**: MyFatoorah
- **Database**: Supabase

## 🌐 Landing Page Architecture - Modern SaaS Design

The landing page (`src/pages/Index.tsx`) features a completely redesigned modern SaaS aesthetic inspired by tarmeez.co with 10 modular sections:

1. **NavbarEnhanced** - Navigation with language toggle and theme switcher
2. **HeroEnhanced** - Rich hero section with interactive calculator/form
   - Dual-tab interface (Cost Calculator & Freelancer Search)
   - Real-time cost estimation with sliders and selects
   - Dark teal/green gradient background (#1a4d3e)
3. **StatisticsSection** - Dedicated trust metrics section
   - 6 prominent metric cards with animated counters
   - Color-coded icons for visual appeal
4. **FeaturesEnhanced** - Multi-layout features showcase
   - 3 main features with large cards and badges
   - 8 additional features in grid layout
   - 3 "Why Choose Us" items in alternating layout
5. **HowItWorksEnhanced** - Visual timeline/flow diagram
   - Separate 6-step timelines for Clients and Freelancers
   - Desktop horizontal timeline with connection lines
   - Mobile-optimized vertical timeline
6. **PricingSection** - Comprehensive pricing/subscription
   - 3-tier pricing structure (Free, Professional, Enterprise)
   - Detailed feature comparison with checkmarks
   - Highlighted "Most Popular" plan
7. **TestimonialsSection** - Social proof and reviews
   - 6 customer testimonials with avatars and ratings
   - Trust badges (500+ reviews, 4.9/5 rating, 98% satisfaction)
8. **PartnersSection** - Partner/client logos
   - 8 partner cards with category icons
   - Trust indicators (200+ companies, 500+ clients)
9. **FeaturedGrid** - Featured items showcase
10. **FAQSection** - Frequently asked questions
11. **Footer** - Footer with links and information

### Design System Enhancements
- **Color Palette**: Rich teal/green inspired by esdaar.com
  - Primary: #1a4d3e (Rich teal green)
  - Primary Dark: #0f3b2f (Deep forest green)
  - Primary Light: #2d6654 (Medium teal)
  - Accent Gold: #d4af37
  - Accent Orange: #ff6b35

- **Shadow System**: 6-level shadow system (sm, md, lg, xl, 2xl, glow)
- **Animations**: Float, pulse-glow, shimmer, slide-up, hover-lift, hover-glow
- **Utilities**: Gradient text, glass effect, hover-scale

### Language Support
- Arabic (default)
- English
- Bilingual content managed through translation objects
- RTL support for Arabic layout

## 🔐 Authentication Flow

1. User registration/login
2. Email verification
3. Profile setup
4. Dashboard access

## 📱 Responsive Design

The application is designed to work across:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large displays (1440px+)

## 🎯 Key Features

- WhatsApp-based client-freelancer matching
- Secure payment processing
- Real-time notifications
- Multilingual support
- Admin dashboard
- User profiles and project management

## 🚀 Deployment

- **Platform**: Vercel
- **Environment**: Production
- **Build Command**: `vite build`
- **Output Directory**: `dist`
