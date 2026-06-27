<div align="center">

# 🛠️ HunarLink AI

### AI-Powered Local Services Marketplace for Pakistan

*Connecting skilled professionals with the customers who need them — powered by AI.*

[![Live Demo](https://img.shields.io/badge/Live-Demo-0F766E?style=for-the-badge&logo=vercel&logoColor=white)](https://hunar-link-ai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

**🔗 Live:** [hunar-link-ai.vercel.app](https://hunar-link-ai.vercel.app/)

</div>

---

## 📖 Overview

In Pakistan, many talented electricians, plumbers, carpenters, painters, mechanics, and tutors struggle to find customers — while customers struggle to find trustworthy, qualified professionals. **HunarLink AI** bridges this gap with a smart, centralized marketplace where customers can describe their problem in plain language and let AI find the right professional for them.

---

## ✨ Key Features

### 🤖 AI-Powered (Google Gemini)
- **Smart Service Detection** — turns a plain request like *"my AC is not cooling"* into the correct service category.
- **AI-Enhanced Job Descriptions** — converts a short request into a clear, professional job description for providers.
- **Smart Recommendations** — ranks the best providers by category match, city, rating, and verification status.

### 👤 For Customers
- Browse & search services by category, city, and keyword
- Post a job using AI and get instant provider recommendations
- Book services and track booking status
- Rate and review providers after a completed job

### 🔧 For Service Providers
- Build a professional profile (skills, experience, rate, area)
- List and manage services (add / activate / deactivate / delete)
- Receive, accept, complete, or cancel booking requests
- Grow reputation through customer ratings

### 🛡️ For Admins
- Verify or un-verify service providers
- Manage service categories
- View platform statistics (users, providers, bookings)

### 🎨 Platform-wide
- **3 Themes** — Light, Dark, and Brand (Purple)
- **3 Languages** — English, Roman Urdu, and Urdu (with full RTL support)
- Secure authentication with Row Level Security on every table

---

## 🧪 Demo Accounts

> Use these ready-made accounts to explore the platform.
> **Password for all accounts:** `demo1234`

| Role | Email | Password |
|------|-------|----------|
| 🛡️ **Admin** | `admin@demo.hunarlink.com` | `demo1234` |
| 🔧 **Provider** (Electrician) | `ali@demo.hunarlink.com` | `demo1234` |
| 🔧 **Provider** (Plumber) | `sana@demo.hunarlink.com` | `demo1234` |
| 🔧 **Provider** (Carpenter) | `bilal@demo.hunarlink.com` | `demo1234` |
| 👤 **Customer** | `ahmed@demo.hunarlink.com` | `demo1234` |

> ℹ️ **Note:** These are demo/testing accounts only. They are tagged with the `@demo.hunarlink.com` domain so they can be safely removed in one step once the platform goes live with real users — real user data is never affected.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (App Router) + Tailwind CSS |
| **Backend** | Next.js API Routes (Node.js) |
| **Database & Auth** | Supabase (PostgreSQL) |
| **AI** | Google Gemini API |
| **Deployment** | Vercel |

---

## 🔐 Admin Access

Admin accounts are **not** created through the public registration page — this prevents unauthorized users from gaining admin rights (a security best practice).

To create an admin:
1. Go to `/admin-signup`
2. Fill in the details
3. Enter the **admin secret code** (stored in `NEXT_PUBLIC_ADMIN_CODE`)

The admin can then access `/dashboard/admin` to verify providers, manage categories, and view statistics.

---

## 👥 User Roles

| Role | How to register | Access |
|------|-----------------|--------|
| **Customer** | `/register` → select *Customer* | Browse, book, review |
| **Provider** | `/register` → select *Service Provider* | Manage services, handle bookings |
| **Admin** | `/admin-signup` (with secret code) | Verify providers, manage categories |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Malaika262005/HunarLink-AI.git
cd HunarLink-AI

# 2. Install dependencies
npm install

# 3. Add environment variables (see below)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_ADMIN_CODE=your-admin-secret-code
```

### Database Setup

Run the SQL in `database/schema.sql` in your Supabase SQL Editor to create all tables, security policies, and seed categories.

---

## 📂 Project Structure

```
src/
├── app/                  # Pages (App Router) + API routes
│   ├── api/              # Backend endpoints (Node.js)
│   ├── dashboard/        # Customer / Provider / Admin dashboards
│   └── ...               # Home, login, register, services, post-job…
├── components/           # Reusable UI components
├── context/              # Auth, Theme, and Language providers
├── lib/                  # Supabase & Gemini clients
├── ai/                   # AI logic (detection, enhancement, recommendation)
└── locales/              # Translations (English, Roman Urdu, Urdu)

database/
└── schema.sql            # Database schema + RLS policies
```

---

## 🔮 Future Enhancements

- Google / social login
- In-app chat between customers and providers
- Online payments
- Provider document (CNIC) verification
- Dedicated mobile app

---

<div align="center">

### Built with ❤️ for Pakistan's skilled workforce

*Empowering local talent · Simplifying the search for trusted services*

</div>
