<div align="center">
  
# 🚀 Pranav R — Full-Stack Portfolio & Custom CMS Platform

<p align="center">
  A high-performance, production-grade <b>Personal Portfolio, Content Management System (CMS), and Analytics Engine</b> built from the ground up with <b>Next.js 16 (App Router)</b>, <b>React 19</b>, <b>TypeScript</b>, and <b>Supabase</b>.
</p>

[![Live Demo](https://img.shields.io/badge/Live_Site-pranavr.netlify.app-000000?style=for-the-badge&logo=google-chrome&logoColor=white)](https://pranavr.netlify.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Status](https://img.shields.io/badge/Status-Active_Production-success?style=for-the-badge)](https://pranavr.netlify.app/)

</div>

---

## 📖 Overview

This repository powers **[pranavr.netlify.app](https://pranavr.netlify.app)**, the personal engineering portfolio, project showcase, and professional case study hub of **Pranav R**.

Unlike typical static portfolio templates, this platform is an **enterprise-grade, dynamic web application** featuring a custom administrative CMS, server-side rate limiting, multi-layer security auditing, Google OAuth-verified testimonials, real-time Recharts traffic analytics, and a native `/llms.txt` knowledge-base route optimized for modern AI search engines and LLM crawlers.

---

## 🌟 Key Features & Architecture

### 1. 🧑‍💻 Public Showcase & Engineering Hub
* **Dynamic Entity Management:** Projects, Technical Case Studies, Certificates, and Blogs are fetched dynamically with Next.js Server Components and client-side fallbacks.
* **Professional Journey Case Studies (`/experiences/professional-journey/[slug]`):** In-depth write-ups (such as *Nexathon 2026*, *MY Bharat Budget Quest*, *AIC Nitte*, and *IICT Summer Internship*) with automatic Table of Contents extraction, responsive image grids, custom video players, and theme-adaptive captions.
* **Undergraduate Projects Hub (`/projects/college-projects`):** Curated multi-year academic milestones with downloadable verification reports, tech stack badges, and GitHub source links.
* **Verified Testimonial Hub (`/testimonials`):** Community reviews with manual admin review moderation, verified badges, and Google OAuth user authentication.
* **Interactive Community Sticky Wall (`/wall`):** A digital corkboard canvas where visitors can stick colorful notes, feedback, shoutouts, or fun thoughts without requiring any login or sign-in. Built with real-time pastel sticky notes, reaction hearts, color filtering, search, and IP rate limiting.
* **Modern UI & Dark/Light Mode:** Seamless zero-flicker theme switching with system-preference detection and persistence.

### 2. 🔐 Secure Admin Dashboard (`/admin`)
* **Content Management System (CMS):** Full CRUD for projects, blogs, certificates, experiences, and notes with instant publish/draft/archive states.
* **Trash & Soft-Delete Engine (`/admin/trash`):** Accidental deletion protection with one-click restore and permanent purge capabilities.
* **Slidable Recent Activity Feed:** Real-time audit stream displaying admin logins, rate-limit warnings, inquiry submissions, and testimonial authentications with expandable metadata inspection drawers and horizontal touch/mouse sliding.
* **Supabase Storage Integration:** Direct multipart evidence uploads for certificate PDFs and high-resolution WebP project graphics with automated bucket provisioning.

### 3. 🛡️ Security, Rate Limiting & Audit Logging
* **Server-Side IP Rate Limiting:** Sliding-window protection for login endpoints, contact forms, and testimonial submissions to prevent brute force and spam attacks.
* **Edge IP Extraction:** Extracts authentic client IPs from Netlify and Cloudflare proxy headers (`x-nf-client-connection-ip`, `cf-connecting-ip`, `x-real-ip`).
* **Cryptographic Cookie Sessions:** Secure session validation via `@supabase/ssr` with edge route guards blocking unauthorized privilege escalation.
* **Comprehensive Audit Trail (`activity_logs`):** Stores exact client IP, email ID, user-agent device strings, action status (`success`, `warning`, `blocked`), and structured JSON metadata.
* **Cloudflare Turnstile & Profanity Filter:** Bot verification and automated profanity cleaning across public form submissions.

### 4. 📊 Real-Time Analytics & Traffic Insights (`/admin/analytics`)
* **Timeframe Filtering:** Switch between **Today**, **Last 7 Days**, **Last 30 Days**, **Last 90 Days**, and **All Time** records.
* **Traffic Trends:** Interactive Recharts line charts mapping unique daily visitor trajectories.
* **Engagement Metrics:** Tracks page views, unique sessions, resume downloads, and average dwell times per content section.
* **Demographics & Devices:** Automated device breakdown (Desktop, Mobile, Tablet) and top visited page rankings.

### 5. 🤖 AI & Search Engine Optimization (SEO)
* **LLM Knowledge Base (`/llms.txt`):** Structured markdown endpoint optimized for ChatGPT, Claude, Gemini, and Perplexity crawlers detailing all projects, skills, and background.
* **Dynamic Sitemaps & Feeds (`/sitemap.xml`):** Automatically indexes all published blogs, projects, certificates, and case studies.
* **OpenGraph & Twitter Cards:** Dynamic metadata generation for rich social embeds.

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Framework & Core** | **Next.js 16.3.5** (App Router, Turbopack, Server Actions), **React 19.2.4**, **TypeScript 5** |
| **Styling & UI** | **Tailwind CSS**, Vanilla CSS Modules, **Lucide React** Icons |
| **Database & Auth** | **Supabase** (PostgreSQL, Row-Level Security, Edge Functions), `@supabase/ssr` (Cookie Auth) |
| **Data Visualization** | **Recharts 3.8.1** (Analytics, Responsive Charts, Dwell-time metrics) |
| **Security & Validation** | **Cloudflare Turnstile**, Web Cryptography API, SHA-256 IP Hashing, Server-Side Rate Limiter |
| **Markdown & Content** | `react-markdown`, `rehype-raw`, `rehype-slug`, `react-syntax-highlighter` |
| **Hosting & CI/CD** | **Netlify** (Production Hosting), GitHub Actions |

---

## 📁 Repository Structure

```text
pranav-r-portfolio/
├── app/                               # Next.js App Router
│   ├── admin/                         # Secure Admin Dashboard & CMS
│   │   ├── analytics/                 # Recharts traffic & engagement charts
│   │   ├── blogs/                     # Blog authoring & draft manager
│   │   ├── certificates/              # Certificate verification manager
│   │   ├── contacts/                  # Contact messages & inquiries inbox
│   │   ├── experiences/               # Professional experience editor
│   │   ├── projects/                  # Project showcase editor
│   │   ├── testimonials/              # Testimonial review queue
│   │   └── trash/                     # Soft-deleted records recovery
│   ├── api/                           # Secure Serverless Backend Handlers
│   │   ├── admin/                     # Admin authentication & mutation endpoints
│   │   ├── contact/                   # Contact form with rate-limiting & Turnstile
│   │   ├── testimonials/              # Public submission & OAuth login logging
│   │   └── wall/                      # Public sticky note creation & heart reactions
│   ├── blogs/                         # Public Blog reading hub
│   ├── certificates/                  # Public Certificate showcase
│   ├── experiences/                   # Professional Journey & Case Studies
│   ├── projects/                      # Public Projects & College Projects hub
│   ├── testimonials/                  # Testimonial Wall & submission form
│   ├── wall/                          # Community Sticky Notes Corkboard Wall
│   ├── llms.txt/                      # AI Crawler Knowledge Base endpoint
│   ├── globals.css                    # Unified light/dark theme styles
│   └── sitemap.ts                     # Dynamic XML sitemap generator
├── components/                        # Reusable React UI Components
│   ├── cards/                         # Experience, Project, & Testimonial cards
│   ├── sections/                      # Homepage section modules
│   ├── ui/                            # Modals, Toast notifications, Form inputs
│   └── TestimonialForm.tsx            # Google OAuth-powered submission canvas
├── lib/                               # Core Engine & Utilities
│   ├── activityLogger.ts              # Universal audit logger (IP, email, metadata)
│   ├── rateLimiter.ts                 # Server-side sliding-window rate limiter
│   ├── supabase.ts                    # Client-side Supabase client
│   └── supabaseServer.ts              # Server-side cookie authenticated client
├── scripts/                           # Database Migrations & Prebuild Scripts
│   ├── alter_activity_logs.sql        # Migration for audit logging schema
│   ├── create_wall_notes.sql          # Migration for community sticky wall schema
│   └── generate-assets-manifest.js    # Prebuild asset manifest generator
├── .env.example                       # Environment variables template
├── .gitignore                         # Hardened git ignore definitions
└── package.json                       # Dependencies & build scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (Recommended)
* **npm** or **pnpm**
* A free **[Supabase](https://supabase.com/)** account with a PostgreSQL project

### 1. Clone the Repository
```bash
git clone https://github.com/Pranavr06/pranav-r-portfolio.git
cd pranav-r-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the provided example environment template:
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_email@example.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Execute the migration scripts located in [`scripts/`](./scripts/) inside your **Supabase SQL Editor**:
* Run [`scripts/alter_activity_logs.sql`](./scripts/alter_activity_logs.sql) to provision tracking columns for IPs, emails, and audit statuses.

### 5. Run the Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### 6. Production Build & Typecheck
```bash
# Typecheck with TypeScript
npx tsc --noEmit

# Compile production bundle with Turbopack
npm run build
```

---

## 🔐 Environment Variables Guide

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Supabase Project API endpoint URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Public anonymous API key for public queries |
| `SUPABASE_SERVICE_ROLE_KEY` | **Private / Server** | High-privilege key for admin auth, rate limiting, and mutations |
| `ADMIN_EMAIL` | **Private / Server** | Primary email authorized for admin dashboard entry |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`| Public / Client | Cloudflare Turnstile public widget site key |
| `TURNSTILE_SECRET_KEY` | **Private / Server** | Cloudflare Turnstile server verification secret |
| `NEXT_PUBLIC_APP_URL` | Public / Client | Canonical URL base for emails, redirects, and sitemaps |

---

## 🤝 Connect & Inquiries

* **Portfolio:** [pranavr.netlify.app](https://pranavr.netlify.app/)
* **LinkedIn:** [linkedin.com/in/pranavr06](https://linkedin.com/in/pranavr06/)
* **GitHub:** [github.com/Pranavr06](https://github.com/Pranavr06)
* **X / Twitter:** [@PranavR2006](https://x.com/PranavR2006)
* **Email:** [pranavkundapura18@gmail.com](mailto:pranavkundapura18@gmail.com)

---

## 🙏 Acknowledgements

* Initial visual inspiration adapted from tutorial patterns by [JavaScript Mastery](https://www.youtube.com/watch?v=ldwlOzRvYOU).
* Expanded, re-architected, and maintained with a custom Next.js 16 App Router architecture, Supabase backend, rate-limiting security engine, and personal CMS by **Pranav R**.

---

<div align="center">
  <b>© 2026 Pranav R. All Rights Reserved.</b>
</div>
