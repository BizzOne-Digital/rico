# Fungtional Wellness

A production-ready, full-stack e-commerce website for **Fungtional Wellness** — functional mushroom products, wellness assessments, and performance-focused wellness.

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS 4** for styling
- **MongoDB Atlas** + Mongoose for data
- **Stripe Checkout** for payments
- **Nodemailer** for transactional emails
- **GSAP + ScrollTrigger** for cinematic scroll animations
- **Framer Motion** for page transitions and UI interactions
- **Lenis** for smooth scrolling
- **React Hook Form + Zod** for form validation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` — MongoDB Atlas connection string
- `AUTH_SECRET` — Random secret for admin sessions (e.g. `openssl rand -base64 32`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Initial admin credentials

Optional (for full functionality):
- Stripe keys for checkout
- SMTP credentials for emails

### 3. Seed the database

```bash
npm run seed
```

This creates the admin user, product catalogue, categories, services, FAQs, and default site settings.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin portal
│   └── api/               # API routes
├── components/
│   ├── admin/             # Admin components
│   ├── animations/        # GSAP, Framer Motion, Lenis
│   ├── home/              # Homepage sections
│   ├── layout/            # Header, Footer, Cart
│   ├── shop/              # Shop components
│   └── ui/                # Reusable UI
├── lib/                   # Utilities, auth, email, stripe
├── models/                # Mongoose models
├── store/                 # Zustand cart store
└── types/                 # TypeScript types
```

## Features

- Cinematic preloader, page transitions, and scroll animations
- Full product catalogue with filtering, search, and quick view
- Stripe Checkout with webhook order creation
- Booking system with email notifications
- Contact form with spam protection
- Newsletter signup
- Admin portal for products, orders, bookings, settings, and media
- MongoDB-based image upload (Vercel-compatible, no disk storage)

## Production

### Build & run locally

```bash
npm run lint
npm run build
npm run seed    # first deploy only — populates DB
npm start       # serves the production build on port 3000
```

### Deploy to Vercel (recommended)

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
2. Add all variables from `.env.example` in **Project → Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your live domain (e.g. `https://www.fungtionalwellness.com`).
4. After first deploy, run `npm run seed` locally (or via a one-off script) to populate MongoDB.
5. **Stripe:** Create a webhook pointing to `https://your-domain.com/api/webhooks/stripe` and add `STRIPE_WEBHOOK_SECRET`.

### Production checklist

| Variable | Required | Notes |
|----------|----------|-------|
| `MONGODB_URI` | Yes | MongoDB Atlas — allow Vercel IPs or `0.0.0.0/0` |
| `AUTH_SECRET` | Yes | Strong random string |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your production URL |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed only | Change password after first login |
| Stripe keys | For checkout | Webhook secret required for order confirmation |
| SMTP vars | Optional | Contact & booking email notifications |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed database |

## Brand

**Fungtional Wellness** — Fungtional living made simple.
