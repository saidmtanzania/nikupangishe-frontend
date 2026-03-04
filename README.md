# Nikupangishe — Frontend (Web)

> Tanzania's trusted platform for verified long-term rentals.
> Owner-led, agent-powered, tenant-first.

A **Next.js 16** web application powering the Nikupangishe rental marketplace — property browsing, role-based dashboards, real-time chat, house exchanges, and interactive maps.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [API Client](#api-client)
- [Authentication](#authentication)
- [Features](#features)
- [Theming & Design System](#theming--design-system)
- [Scripts](#scripts)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19, RSC) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | Tailwind CSS v4, CSS custom properties |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (New York style) + Radix UI primitives |
| Icons | [Lucide React](https://lucide.dev/) + Material Symbols |
| Forms | React Hook Form + Zod validation |
| Maps | Leaflet 1.9 + React-Leaflet 5 |
| Charts | Recharts 2.15 |
| Notifications | Sonner (toast) |
| Font | Work Sans (Google Fonts) |
| Package Manager | pnpm |
| Analytics | Vercel Analytics |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm i -g pnpm`)
- Running instance of the [Nikupangishe API](../nikupangishe-api/) (NestJS backend)

### Install & Run

```bash
# Clone the repo (if not already)
cd nikupangishe/nikupangishe-ui

# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local to point to your running backend

# Start the dev server
pnpm dev
```

The app will be available at **http://localhost:3001** (or the next available port).

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |

---

## Project Structure

```
nikupangishe-ui/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (header, footer, auth provider)
│   ├── page.tsx                # Landing / home page
│   ├── globals.css             # Tailwind config & CSS custom properties
│   ├── auth/                   # Authentication pages
│   │   ├── login/              # Sign in
│   │   ├── register/           # Create account
│   │   ├── verify/             # OTP phone verification
│   │   ├── forgot-password/    # Request password reset
│   │   └── reset-password/     # Set new password
│   ├── browse/                 # Property search & filtering
│   ├── chat/                   # Real-time messaging
│   ├── exchange/               # House exchange feature
│   ├── properties/[id]/        # Property detail page
│   ├── onboarding/owner/       # Owner onboarding flow
│   ├── dashboard/              # Role-based dashboards
│   │   ├── layout.tsx          # Dashboard shell (sidebar)
│   │   ├── owner/              # Owner dashboard
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── houses/         # Property management
│   │   │   │   ├── page.tsx    # List my properties
│   │   │   │   └── new/        # Add new property (5-step wizard)
│   │   │   ├── agents/         # Manage agents
│   │   │   └── verification/   # Owner verification
│   │   ├── tenant/             # Tenant dashboard
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── exchange/       # Exchange requests
│   │   │   └── verification/   # Tenant verification
│   │   └── agent/              # Agent dashboard
│   │       ├── page.tsx        # Dashboard home
│   │       ├── viewings/       # Manage scheduled viewings
│   │       └── commissions/    # Commission tracking
│   └── api/                    # API route handlers (proxies)
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, input, dialog…)
│   ├── layout/                 # Header, Footer, MobileNav
│   ├── auth/                   # LoginForm, RegisterForm
│   ├── properties/             # PropertyCard, PropertyMap, LocationPickerMap, etc.
│   ├── chat/                   # ChatList, ChatWindow
│   ├── dashboard/              # DashboardSidebar, StatCard
│   ├── exchange/               # ExchangeCard
│   └── home/                   # HeroSearch
├── context/
│   └── auth-context.tsx        # AuthProvider (JWT tokens, user state)
├── hooks/
│   ├── use-mobile.ts           # Responsive breakpoint hook
│   └── use-toast.ts            # Toast notification hook
├── lib/
│   ├── api.ts                  # Typed API client (auth, properties, chat, etc.)
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── utils.ts                # Utility functions (cn, formatTZS, etc.)
│   └── mock-data.ts            # Development mock data
├── public/images/              # Static images (hero, illustrations)
├── styles/globals.css          # Additional global styles
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── components.json             # shadcn/ui configuration
├── postcss.config.mjs          # PostCSS / Tailwind
└── package.json
```

---

## Pages & Routes

### Public Routes

| Route | Description |
| --- | --- |
| `/` | Landing page — hero, featured listings, CTA sections |
| `/browse` | Property search with filters (city, price range, type, bedrooms), grid/list views, sorting |
| `/properties/[id]` | Property detail — gallery, map, amenities, contact owner |
| `/exchange` | House exchange info & step-by-step flow |

### Auth Routes

| Route | Description |
| --- | --- |
| `/auth/login` | Email + password sign-in |
| `/auth/register` | Create account (owner / tenant / agent roles) |
| `/auth/verify` | OTP phone number verification |
| `/auth/forgot-password` | Request password reset link |
| `/auth/reset-password` | Set new password |

### Dashboard Routes (Protected)

#### Owner

| Route | Description |
| --- | --- |
| `/dashboard/owner` | Stats overview — active listings, views, messages |
| `/dashboard/owner/houses` | Manage listed properties |
| `/dashboard/owner/houses/new` | Add new property (5-step wizard: Basic → Location → Features → Media → Review) |
| `/dashboard/owner/agents` | Assign & manage agents |
| `/dashboard/owner/verification` | Owner identity verification |

#### Tenant

| Route | Description |
| --- | --- |
| `/dashboard/tenant` | Stats overview — saved properties, applications |
| `/dashboard/tenant/exchange` | Manage house exchange requests |
| `/dashboard/tenant/verification` | Tenant identity verification |

#### Agent

| Route | Description |
| --- | --- |
| `/dashboard/agent` | Stats overview — assigned properties, viewings |
| `/dashboard/agent/viewings` | Scheduled property viewings |
| `/dashboard/agent/commissions` | Commission tracking & history |

### Other Protected Routes

| Route | Description |
| --- | --- |
| `/chat` | Real-time messaging (conversations list + chat window) |
| `/onboarding/owner` | Owner onboarding flow |

---

## API Client

All backend communication goes through a typed API client at `lib/api.ts`.

The backend wraps every response in a `{ success, data, timestamp }` envelope — the client's `unwrap()` strips it automatically.

### Modules

```typescript
authApi.login(email, password)           // POST /auth/login
authApi.register(data)                   // POST /auth/register
authApi.verifyPhone(phone, otp)          // POST /auth/verify-phone
authApi.resendOtp(phone)                 // POST /auth/resend-otp/:phone
authApi.me(token)                        // GET  /auth/me
authApi.refreshToken(refreshToken)       // POST /auth/refresh

propertiesApi.list(params?, token?)      // GET  /houses (filterable, paginated)
propertiesApi.get(id, token?)            // GET  /houses/:id
propertiesApi.myHouses(token)            // GET  /houses/my-houses
propertiesApi.create(payload, token)     // POST /houses
propertiesApi.uploadPhotos(id, files, t) // POST /houses/:id/images (multipart)

viewingsApi.list(token)                  // GET  /viewings
viewingsApi.create(payload, token)       // POST /viewings

exchangeApi.list(token)                  // GET  /exchanges
exchangeApi.create(payload, token)       // POST /exchanges

chatApi.conversations(token)             // GET  /chat/conversations
chatApi.messages(conversationId, token)  // GET  /chat/conversations/:id/messages
```

---

## Authentication

Authentication is managed by `context/auth-context.tsx` which provides:

- **JWT-based auth** — access token + refresh token stored in `localStorage`
- **`useAuth()` hook** — exposes `user`, `token`, `isAuthenticated`, `login()`, `register()`, `verifyPhone()`, `logout()`
- **OTP phone verification** — required after registration
- **Auto-restore** — session persisted across page reloads via stored tokens
- **Role-based access** — `owner`, `tenant`, `agent` (and `admin`) roles determine dashboard routing

Storage keys:
- `nkp_access_token` — JWT access token
- `nkp_refresh_token` — JWT refresh token
- `nkp_user` — Serialized user object

---

## Features

### Property Browsing
- Grid and list view toggle
- Filterable by city, price range, house type, bedrooms, verification status, exchange eligibility
- Full-text search
- Sort by newest, price, popularity

### Add Property Wizard (Owner)
5-step form with validation:
1. **Basic Details** — title, description, type, furnishing, rent, deposit, currency
2. **Location** — city, neighborhood, street address, GPS coordinates, interactive map with:
   - Click-to-pin location selection
   - **Address search** (Nominatim/OpenStreetMap geocoding, scoped to Tanzania)
   - **"Use My Location"** button (browser geolocation + reverse geocoding)
   - Auto-fills city, address, and area fields from search/geolocation results
3. **Features & Amenities** — bedrooms, bathrooms, parking, square meters, utilities (water/electricity/wifi), amenities checkboxes, custom house rules
4. **Media** — drag-and-drop photo upload with previews (max 10 images)
5. **Review** — summary of all entered data before submission

### Interactive Maps
- **Property detail maps** — shows exact property location
- **Location picker** — click to place a pin, search by address, use current location
- Powered by Leaflet + React-Leaflet with custom orange pin markers

### House Exchange
- Tenants can propose exchanging their current rental for another listing
- Step-by-step flow: Browse → Submit Request → Verification → Move In

### Real-Time Chat
- Conversation list grouped by property
- Message thread view
- Requires authentication

### Role-Based Dashboards
- **Owner**: property management, agent assignment, stats
- **Tenant**: saved properties, exchange management, verification
- **Agent**: viewings schedule, commission tracking

### Responsive Design
- Mobile-first with bottom navigation bar on mobile
- Desktop sidebar navigation for dashboards
- Fully responsive property cards, forms, and layouts

---

## Theming & Design System

### Brand Colors

| Token | Light | Dark |
| --- | --- | --- |
| Primary | `#ec5413` (Burnt Orange) | `#f06b30` |
| Background | `#f8f6f4` (Warm Off-White) | `#1a1210` |
| Secondary | `#f3ece7` | `#3d2e22` |
| Accent | `#fef1eb` | `#b83d0d` |
| Muted | `#f0ebe6` | `#7a6b5d` |

### UI Framework
- **shadcn/ui** (New York variant) with Radix UI primitives
- CSS custom properties for theming (light/dark mode via `.dark` class)
- `next-themes` for theme switching
- `tw-animate-css` for animations
- Border radius: `0.5rem`

### Icons
- **Lucide React** — primary icon library
- **Material Symbols Outlined** — supplementary icons (loaded via Google Fonts CDN)

---

## Scripts

```bash
pnpm dev        # Start development server (with hot reload)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## License

Private — All rights reserved.
