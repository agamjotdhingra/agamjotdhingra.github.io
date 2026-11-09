# Agamjot Dhingra — Personal Portfolio

Production-ready developer portfolio built with React, TypeScript, Vite, and Tailwind CSS, integrated with Supabase and deployed as a GitHub user site at [https://agamjotdhingra.github.io/](https://agamjotdhingra.github.io/).

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Bundler / Dev Server:** Vite 6
- **Styling:** Tailwind CSS + PostCSS
- **Backend & Auth:** Supabase (`@supabase/supabase-js`)

## Getting Started

### Prerequisites

- Node.js (>= 18)
- npm (>= 9)

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase project credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Security Note:** Only supply the Supabase publishable `anon` key. Never expose your `service_role` key.

### Installation

```bash
npm install
```

### Development Server

Run local dev server with hot module replacement:

```bash
npm run dev
```

### Production Build

Type-check and build the production bundle into `/dist`:

```bash
npm run build
```

### Preview Build

Preview the production build locally:

```bash
npm run preview
```

## Admin Portal Routes

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Developer portfolio homepage |
| `/admin/login` | Public / Admin | Administrative sign-in form via Supabase Auth |
| `/admin` | Protected | Private admin console; restricted to configured admin UUID (`855f8ee7-54e7-4137-b86a-ad6e1bc53f96`) |

## Database Schemas

### 1. `public.profile` (Single Record: `id = 1`)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `integer` | Primary key (`1`) |
| `full_name` | `text` | Display name of the developer |
| `headline` | `text` | Professional role / headline |
| `bio` | `text` | Personal bio and summary |
| `avatar_url` | `text` (nullable) | Direct image URL for the avatar |
| `email` | `text` (nullable) | Contact email address |
| `github_url` | `text` (nullable) | GitHub profile URL |
| `linkedin_url` | `text` (nullable) | LinkedIn profile URL |
| `updated_at` | `timestamptz` | Last updated timestamp |

### 2. `public.projects`

The dynamic Projects section queries the `projects` table for records where `is_published = true`:

| Column | Type | Description |
| :--- | :--- | :--- |
| `title` | `text` | Name of the project |
| `description` | `text` | High-level summary of the work |
| `tech_stack` | `text[]` / `text` | Technologies used (array or comma-delimited) |
| `github_url` | `text` (nullable) | URL to GitHub repository |
| `live_url` | `text` (nullable) | URL to live demo or production deployment |
| `is_published` | `boolean` | Flag controlling public visibility |

## Project Structure

```
agamjotdhingra.github.io/
├── public/               # Static assets served at root
│   └── favicon.svg
├── src/
│   ├── assets/           # Images, SVGs, and bundled media
│   ├── components/
│   │   ├── common/       # Reusable UI primitives
│   │   ├── layout/       # Shell layouts (Navbar, Footer)
│   │   ├── projects/     # Dynamic projects showcase & state components
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectsEmptyState.tsx
│   │   │   ├── ProjectsErrorState.tsx
│   │   │   ├── ProjectsLoadingState.tsx
│   │   └── sections/     # Core portfolio page sections
│   │       ├── AboutSection.tsx
│   │       ├── ContactSection.tsx
│   │       └── HeroSection.tsx
│   ├── context/          # Application-wide React contexts
│   │   ├── AuthContext.tsx    # Supabase Auth state & strict admin UID verification
│   │   └── RouterContext.tsx  # Zero-dependency client-side SPA router
│   ├── lib/              # Client SDK configurations (Supabase)
│   │   └── supabase.ts
│   ├── pages/            # Page-level route views
│   │   ├── AdminDashboardPage.tsx  # Protected admin layout & logout
│   │   ├── AdminLoginPage.tsx      # Admin sign-in form
│   │   └── HomePage.tsx            # Public portfolio view
│   ├── services/         # API & database service layer
│   │   ├── profileService.ts
│   │   └── projectsService.ts
│   ├── types/            # TypeScript interfaces & types
│   ├── utils/            # Shared helper functions (formatters)
│   ├── App.tsx           # Application route router & orchestrator
│   ├── main.tsx          # DOM entry point
│   └── index.css         # Global styles & Tailwind directives
├── .env.example          # Template for environment variables
├── index.html            # Main HTML document
├── package.json          # Project scripts and dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript configuration for Vite/Node
└── vite.config.ts        # Vite configuration (base: '/', path alias '@')
```
