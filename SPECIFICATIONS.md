# Job Board Platform — Full Project Breakdown

A comprehensive reference for every phase, feature, technology decision, package, endpoint, and component. Written so your friend can learn *why* things are done the way they are, not just follow instructions.

---

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Technology Stack](#2-technology-stack)
3. [Repository & Project Setup](#3-repository--project-setup)
4. [Database Design](#4-database-design)
5. [Authentication](#5-authentication)
6. [Phase Breakdown](#6-phase-breakdown)
7. [API Layer — Routes & Endpoints](#7-api-layer--routes--endpoints)
8. [Component Architecture](#8-component-architecture)
9. [State Management](#9-state-management)
10. [File Uploads](#10-file-uploads)
11. [Email System](#11-email-system)
12. [Search & Filtering](#12-search--filtering)
13. [Deployment](#13-deployment)
14. [Testing Strategy](#14-testing-strategy)
15. [Learning Path for Your Friend](#15-learning-path-for-your-friend)

---

## 1. Project Overview & Philosophy

### What You're Building

A full-stack job board where:
- **Employers** can create accounts, post jobs, review applications, and manage their listings.
- **Job Seekers** can browse jobs, create a profile, upload a CV, and apply.
- **Admins** can moderate listings, manage users, and view analytics.

### Why Next.js for This

Next.js is an excellent choice for a job board specifically because of how it handles **rendering strategies**. A job board has:
- Public pages that should be fast and SEO-indexed (job listings) → **Static Generation (SSG) / Incremental Static Regeneration (ISR)**
- User-specific pages that need fresh data (dashboard, applications) → **Server-Side Rendering (SSR)**
- Interactive client-side features (search filters, form state) → **Client Components**

This natural mix of rendering needs makes a job board one of the best teaching projects for Next.js's App Router.

---

## 2. Technology Stack

### Core

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | File-system routing, server components, built-in API routes, ISR support |
| Language | **TypeScript** | Type safety catches bugs early, especially important for API contracts and DB queries |
| Styling | **Tailwind CSS** | Utility-first, no context switching, works perfectly with component-based architecture |
| UI Components | **shadcn/ui** | Headless, accessible, copy-paste components you own — not a black-box library |
| Database | **PostgreSQL** | Relational data fits perfectly (jobs → applications → users), mature, production-ready |
| ORM | **Prisma** | Type-safe DB queries generated from your schema, excellent DX, auto-migrations |
| Auth | **Auth.js (NextAuth v5)** | OAuth + credentials, first-class Next.js support, session management |
| File Storage | **Cloudinary or Supabase Storage** | CV uploads, company logos — don't store files in your DB |
| Email | **Resend + React Email** | Transactional emails (application received, status update) via API, templates in React |
| Validation | **Zod** | Schema validation on both client (forms) and server (API routes) — single source of truth |
| Forms | **React Hook Form** | Performant, integrates with Zod via `@hookform/resolvers` |
| Search | **Prisma full-text search** (basic) or **Meilisearch** (advanced) | Start with Prisma; upgrade to Meilisearch if search becomes a core feature |

### Dev Tooling

| Tool | Why |
|---|---|
| **ESLint + Prettier** | Code consistency, catch errors early |
| **Husky + lint-staged** | Run linting/formatting before every commit |
| **Commitlint** | Enforce conventional commit messages (good practice for collaboration) |
| **Docker Compose** | Local PostgreSQL without installing Postgres globally |
| **Prisma Studio** | Visual DB browser during development |

---

## 3. Repository & Project Setup

### Folder Structure

```
job-board/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group — no shared layout with main site
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/                   # Route group — shares site header/footer
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Homepage / job listing feed
│   │   ├── jobs/
│   │   │   ├── page.tsx          # All jobs (SSR or ISR)
│   │   │   └── [slug]/page.tsx   # Single job detail
│   │   ├── companies/
│   │   │   └── [slug]/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard-specific sidebar layout
│   │       ├── page.tsx
│   │       ├── jobs/             # Employer: manage listings
│   │       ├── applications/     # Seeker: track applications
│   │       └── settings/
│   └── api/                      # API Routes
│       ├── auth/[...nextauth]/
│       ├── jobs/
│       ├── applications/
│       └── upload/
├── components/
│   ├── ui/                       # shadcn primitives (Button, Input, etc.)
│   ├── jobs/                     # Job-domain components
│   ├── auth/                     # Auth-domain components
│   ├── dashboard/
│   └── shared/                   # Navbar, Footer, etc.
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── validations/              # Zod schemas
│   │   ├── job.ts
│   │   └── user.ts
│   └── utils.ts                  # Helper functions (cn(), formatDate(), etc.)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   └── index.ts                  # Custom TypeScript types
├── hooks/                        # Custom React hooks
├── public/
├── .env.local
├── docker-compose.yml
└── next.config.ts
```

**Teaching point for your friend:** Route groups `(auth)` and `(main)` are folders whose names are wrapped in parentheses. Next.js ignores them in the URL — they're purely for organizing layouts. `(main)` pages share a header/footer; `(auth)` pages don't.

### Initial Setup Commands

```bash
npx create-next-app@latest job-board --typescript --tailwind --eslint --app
cd job-board

# UI
npx shadcn@latest init
npx shadcn@latest add button input label card badge select textarea dialog

# Core packages
npm install prisma @prisma/client
npm install next-auth@beta @auth/prisma-adapter
npm install react-hook-form @hookform/resolvers zod
npm install resend @react-email/components
npm install uploadthing  # or use Cloudinary SDK

# Dev tools
npm install -D prettier eslint-config-prettier
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx prisma init
```

---

## 4. Database Design

### Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Users & Auth ───────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(SEEKER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Auth.js required relations
  accounts      Account[]
  sessions      Session[]

  // App relations
  profile       SeekerProfile?
  company       Company?
  applications  Application[]

  @@map("users")
}

enum Role {
  SEEKER
  EMPLOYER
  ADMIN
}

model Account { /* Auth.js standard */ }
model Session { /* Auth.js standard */ }
model VerificationToken { /* Auth.js standard */ }

// ─── Job Seeker Profile ──────────────────────────────────────────

model SeekerProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  headline    String?
  bio         String?
  cvUrl       String?   // URL from file storage
  cvFileName  String?
  skills      String[]  // PostgreSQL array
  location    String?
  linkedinUrl String?
  portfolioUrl String?
  updatedAt   DateTime @updatedAt

  @@map("seeker_profiles")
}

// ─── Companies ───────────────────────────────────────────────────

model Company {
  id          String   @id @default(cuid())
  ownerId     String   @unique
  owner       User     @relation(fields: [ownerId], references: [id])
  name        String
  slug        String   @unique
  logoUrl     String?
  website     String?
  description String?
  size        CompanySize?
  industry    String?
  location    String?
  createdAt   DateTime @default(now())
  jobs        Job[]

  @@map("companies")
}

enum CompanySize {
  STARTUP        // 1–10
  SMALL          // 11–50
  MEDIUM         // 51–200
  LARGE          // 201–1000
  ENTERPRISE     // 1000+
}

// ─── Jobs ─────────────────────────────────────────────────────────

model Job {
  id           String      @id @default(cuid())
  companyId    String
  company      Company     @relation(fields: [companyId], references: [id])
  title        String
  slug         String      @unique
  description  String      // Rich text / Markdown
  requirements String?
  location     String
  type         JobType
  category     String
  salaryMin    Int?
  salaryMax    Int?
  salaryCurrency String?   @default("USD")
  experienceLevel ExperienceLevel
  status       JobStatus   @default(DRAFT)
  featured     Boolean     @default(false)
  expiresAt    DateTime?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  applications Application[]

  @@index([status, createdAt])   // For fast feed queries
  @@index([category])
  @@map("jobs")
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  INTERNSHIP
  REMOTE
}

enum ExperienceLevel {
  ENTRY
  MID
  SENIOR
  LEAD
  EXECUTIVE
}

enum JobStatus {
  DRAFT
  ACTIVE
  CLOSED
  EXPIRED
}

// ─── Applications ─────────────────────────────────────────────────

model Application {
  id          String            @id @default(cuid())
  jobId       String
  job         Job               @relation(fields: [jobId], references: [id])
  applicantId String
  applicant   User              @relation(fields: [applicantId], references: [id])
  coverLetter String?
  cvUrl       String?           // Can override profile CV
  status      ApplicationStatus @default(PENDING)
  notes       String?           // Internal employer notes
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@unique([jobId, applicantId])  // One application per job per user
  @@map("applications")
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  SHORTLISTED
  INTERVIEW
  OFFER
  REJECTED
  WITHDRAWN
}
```

**Why this schema design:**
- `@@unique([jobId, applicantId])` prevents duplicate applications at the database level, not just app level.
- `@@index` on `[status, createdAt]` speeds up the most common query: fetching active jobs sorted by recency.
- Slugs on `Company` and `Job` enable human-readable, SEO-friendly URLs (`/jobs/senior-react-developer-acme-corp`) instead of `/jobs/cldxyz123`.

---

## 5. Authentication

### Auth.js (NextAuth v5) Setup

Auth.js is configured in `lib/auth.ts` and provides:
- **OAuth login** (Google, GitHub) — reduces friction, no password management
- **Credentials login** — email/password for users who prefer it
- **Session handling** — JWT-based sessions stored in cookies
- **Role access** — the session carries the user's `role`, used for middleware protection

```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        // Validate credentials, hash check, return user or null
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role  // Inject role into session
      return session
    }
  }
})
```

### Route Protection with Middleware

```typescript
// middleware.ts (at root)
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isDashboard = nextUrl.pathname.startsWith("/dashboard")
  const isEmployerRoute = nextUrl.pathname.startsWith("/dashboard/jobs/new")

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isEmployerRoute && session?.user?.role !== "EMPLOYER") {
    return NextResponse.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/api/jobs/:path*"]
}
```

**Teaching point:** Middleware runs on the Edge — before any page or API route renders. It's the right place for auth guards because it's the earliest interception point.

---

## 6. Phase Breakdown

### Phase 1 — Foundation (Week 1–2)

Goal: Running app skeleton with auth, DB, and basic routing.

- [ ] Repo setup (Git, ESLint, Prettier, Husky, commitlint)
- [ ] Docker Compose for local Postgres
- [ ] Prisma schema + first migration
- [ ] Auth.js with Google OAuth + Credentials
- [ ] `middleware.ts` protecting dashboard routes
- [ ] Basic layout: Navbar, Footer
- [ ] Homepage placeholder
- [ ] `/register` page with role selection (Seeker or Employer)

**Your friend learns:** App Router layout hierarchy, route groups, Auth.js setup, environment variables, Prisma migrations.

---

### Phase 2 — Job Listings (Week 3–4)

Goal: Public job feed, detail pages, with ISR.

- [ ] Job listing page (`/jobs`) — server component, ISR (`revalidate: 3600`)
- [ ] Job card component
- [ ] Job detail page (`/jobs/[slug]`) — SSG with `generateStaticParams`
- [ ] Category + type filter (URL search params, not state)
- [ ] Salary range display
- [ ] Company info section on job detail
- [ ] "Apply Now" button (disabled if not logged in)
- [ ] Seed script with 20 realistic fake jobs

**Your friend learns:** `generateStaticParams`, ISR, server vs. client components, `searchParams` in server components, `next/link`.

---

### Phase 3 — Employer Dashboard (Week 5–6)

Goal: Employers can post and manage jobs.

- [ ] Dashboard layout with sidebar
- [ ] Job creation form (multi-step or single page)
  - Title, description (rich text with `@uiw/react-md-editor` or `tiptap`)
  - Type, category, location, salary, experience level
  - Preview before submit
- [ ] Job list with status badges (Draft, Active, Closed)
- [ ] Edit/delete job
- [ ] Applications inbox per job
- [ ] Application status updates (Pending → Reviewing → Shortlisted, etc.)
- [ ] Company profile setup page

**Your friend learns:** Forms with React Hook Form + Zod, API route handlers, optimistic UI with `useTransition`, revalidating cache with `revalidatePath`.

---

### Phase 4 — Seeker Features (Week 7–8)

Goal: Seekers can build profiles and apply.

- [ ] Seeker profile page (bio, skills, headline, links)
- [ ] CV upload (PDF only, max 5MB)
- [ ] Application form (cover letter + CV selection)
- [ ] "My Applications" list with status tracking
- [ ] Saved jobs (bookmark feature) — stored in DB
- [ ] Profile completeness indicator

**Your friend learns:** File uploads, `useFormStatus`, conditional rendering based on session role, data mutations.

---

### Phase 5 — Search & Discovery (Week 9)

Goal: Users can find relevant jobs quickly.

- [ ] Search bar with debounce (keyword search)
- [ ] Filters: location, type, category, experience, salary range
- [ ] URL-based filter state (`?q=react&type=REMOTE&category=Engineering`)
- [ ] Sort: Newest, Salary High–Low, Relevance
- [ ] Pagination or infinite scroll
- [ ] "No results" empty state

**Your friend learns:** URL search params as state (the Next.js way), `useSearchParams`, `useRouter`, server-side filtering with Prisma `where` clauses.

---

### Phase 6 — Notifications & Email (Week 10)

Goal: Keep users informed automatically.

- [ ] Email on application submitted (to seeker: confirmation; to employer: new application alert)
- [ ] Email on application status change
- [ ] React Email templates for each type
- [ ] In-app notification bell (optional, stored in DB)

**Your friend learns:** Server actions calling third-party APIs, background tasks, React Email component design.

---

### Phase 7 — Admin Panel (Week 11)

Goal: Moderate content and view analytics.

- [ ] Admin-only route group (`/admin`)
- [ ] Job approval queue (jobs start as PENDING_REVIEW before going ACTIVE)
- [ ] User list with role management
- [ ] Basic analytics: jobs posted this month, applications this week, active employers
- [ ] Flag/remove inappropriate listings

**Your friend learns:** Role-based access control, server-side authorization checks in route handlers.

---

### Phase 8 — Polish & Launch (Week 12)

Goal: Production-ready.

- [ ] SEO: `generateMetadata` for all public pages, OpenGraph images
- [ ] Sitemap (`app/sitemap.ts`)
- [ ] Robots.txt
- [ ] Error boundaries and `not-found.tsx` / `error.tsx` pages
- [ ] Loading skeletons (`loading.tsx`)
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (keyboard nav, ARIA labels, color contrast)
- [ ] Rate limiting on API routes (with `@upstash/ratelimit` + Redis)
- [ ] Deployment to Vercel

---

## 7. API Layer — Routes & Endpoints

All routes live in `app/api/`. Next.js App Router uses **Route Handlers** (`route.ts` files).

### Jobs

```
GET    /api/jobs                    List jobs (with filters via query params)
POST   /api/jobs                    Create a job (employer only)
GET    /api/jobs/[id]               Get single job
PATCH  /api/jobs/[id]               Update job (employer, owner only)
DELETE /api/jobs/[id]               Delete job
PATCH  /api/jobs/[id]/status        Change job status (open/close/draft)
```

### Applications

```
GET    /api/applications            Get applications (scoped by role)
POST   /api/applications            Submit application (seeker only)
PATCH  /api/applications/[id]       Update status (employer only)
DELETE /api/applications/[id]       Withdraw application (seeker only)
```

### Users & Profiles

```
GET    /api/users/me                Get current user + profile
PATCH  /api/users/me                Update profile
GET    /api/users/[id]              Public seeker profile (employer view)
```

### Companies

```
GET    /api/companies/[slug]        Get company public profile
POST   /api/companies               Create company (employer only)
PATCH  /api/companies/[slug]        Update company
```

### Uploads

```
POST   /api/upload/cv               Upload CV (returns URL)
POST   /api/upload/logo             Upload company logo (returns URL)
```

### Example Route Handler Pattern

```typescript
// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { jobCreateSchema } from "@/lib/validations/job"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const type = searchParams.get("type")
  const q = searchParams.get("q")

  const jobs = await db.job.findMany({
    where: {
      status: "ACTIVE",
      ...(category && { category }),
      ...(type && { type: type as JobType }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ]
      })
    },
    include: { company: { select: { name: true, logoUrl: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(jobs)
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = jobCreateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Get employer's company
  const company = await db.company.findUnique({
    where: { ownerId: session.user.id }
  })

  if (!company) {
    return NextResponse.json({ error: "Create a company profile first" }, { status: 400 })
  }

  const job = await db.job.create({
    data: {
      ...parsed.data,
      companyId: company.id,
      slug: generateSlug(parsed.data.title, company.name),
    }
  })

  return NextResponse.json(job, { status: 201 })
}
```

**Teaching points:**
- Always check auth inside route handlers — middleware protects routes at a macro level, but handler-level checks enforce ownership (e.g., only the job owner can edit it).
- `safeParse` from Zod returns a discriminated union: `{ success: true, data }` or `{ success: false, error }`. Never use `parse` in API handlers (it throws).

---

## 8. Component Architecture

### Breakdown by Domain

```
components/
├── ui/                   # shadcn — Buttons, Inputs, Cards, Dialogs, Badges, etc.
│
├── shared/
│   ├── Navbar.tsx        # Client: handles mobile menu state
│   ├── Footer.tsx        # Server
│   ├── Logo.tsx
│   ├── UserMenu.tsx      # Client: dropdown with session-aware links
│   └── LoadingSkeleton.tsx
│
├── jobs/
│   ├── JobCard.tsx       # Compact card for listing feed
│   ├── JobList.tsx       # Maps over jobs, handles empty state
│   ├── JobDetail.tsx     # Full job view (server component)
│   ├── JobFilters.tsx    # Client: manages filter state via URL params
│   ├── JobForm.tsx       # Client: create/edit form with RHF + Zod
│   ├── JobStatusBadge.tsx
│   └── SalaryDisplay.tsx # Formats "₦450k–₦600k" or "Negotiable"
│
├── applications/
│   ├── ApplicationForm.tsx   # Client: apply modal/page
│   ├── ApplicationCard.tsx   # Seeker's view of their applications
│   ├── ApplicationRow.tsx    # Employer's inbox row
│   └── StatusSelect.tsx      # Employer: change application status
│
├── dashboard/
│   ├── Sidebar.tsx
│   ├── StatsCard.tsx
│   └── DashboardHeader.tsx
│
└── auth/
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    └── OAuthButtons.tsx
```

### Server vs. Client Component Decision Rule

Ask: **does this component need interactivity, browser APIs, or hooks?**

- **Yes** → `"use client"` at the top
- **No** → Leave it as a Server Component (default in App Router)

Server Components can fetch data directly from the DB without an API call, and they have zero JavaScript bundle cost on the client. Use them for anything display-only.

```typescript
// ✅ Server Component — no 'use client' needed
// app/(main)/jobs/[slug]/page.tsx
import { db } from "@/lib/db"

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await db.job.findUnique({
    where: { slug: params.slug },
    include: { company: true }
  })

  if (!job) notFound()

  return <JobDetail job={job} />
}
```

---

## 9. State Management

### The Approach: URL First, Then React State, Then Global State

1. **URL search params** — for filters, search queries, and pagination. Shareable, bookmarkable, works on refresh.
2. **React `useState` / `useReducer`** — for local UI state (modal open/closed, tab selection, form step).
3. **React Cache / `unstable_cache`** — for deduplicating DB calls across server components.
4. **No global state library needed** for this project — Redux/Zustand would be overkill. If you find yourself needing it, reach for Zustand (simpler, hooks-based).

### Server Actions (the Next.js 14 way for mutations)

Server Actions let you call server-side code directly from client components — no API route needed for simple mutations.

```typescript
// lib/actions/jobs.ts
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteJob(jobId: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const job = await db.job.findUnique({ where: { id: jobId } })
  if (job?.company.ownerId !== session.user.id) throw new Error("Forbidden")

  await db.job.delete({ where: { id: jobId } })
  revalidatePath("/dashboard/jobs")  // Clears the cache for this page
}
```

```tsx
// components/jobs/DeleteJobButton.tsx
"use client"

import { deleteJob } from "@/lib/actions/jobs"
import { useTransition } from "react"

export function DeleteJobButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteJob(jobId))}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}
```

**Teaching point:** `useTransition` marks the action as non-urgent, preventing the UI from locking up. `isPending` gives you a loading state for free.

---

## 10. File Uploads

### Strategy: UploadThing (or Cloudinary)

Never store binary files in PostgreSQL. Use a dedicated service and store only the URL.

**UploadThing** is the simplest integration for Next.js:

```typescript
// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  cvUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save file.url to user's SeekerProfile
      await db.seekerProfile.update({
        where: { userId: metadata.userId },
        data: { cvUrl: file.url, cvFileName: file.name }
      })
    }),
} satisfies FileRouter
```

---

## 11. Email System

### Resend + React Email

**Why Resend:** Simple API, generous free tier, excellent Next.js integration. **Why React Email:** Write email templates in JSX — no more wrestling with inline CSS tables.

```tsx
// emails/ApplicationReceived.tsx
import { Html, Body, Heading, Text, Button } from "@react-email/components"

interface Props {
  applicantName: string
  jobTitle: string
  companyName: string
  dashboardUrl: string
}

export function ApplicationReceivedEmail({ applicantName, jobTitle, companyName, dashboardUrl }: Props) {
  return (
    <Html>
      <Body>
        <Heading>Application Submitted!</Heading>
        <Text>
          Hi {applicantName}, your application for <strong>{jobTitle}</strong> at {companyName} has been received.
        </Text>
        <Button href={dashboardUrl}>Track your application</Button>
      </Body>
    </Html>
  )
}
```

```typescript
// Sending the email (in a Server Action or Route Handler)
import { Resend } from "resend"
import { render } from "@react-email/render"
import { ApplicationReceivedEmail } from "@/emails/ApplicationReceived"

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: "noreply@yourjobboard.com",
  to: applicant.email,
  subject: `Application received — ${job.title}`,
  html: render(ApplicationReceivedEmail({ ... }))
})
```

---

## 12. Search & Filtering

### URL-Param-Driven Filtering (the Right Way in Next.js)

```typescript
// app/(main)/jobs/page.tsx — Server Component
export default async function JobsPage({
  searchParams
}: {
  searchParams: { q?: string; type?: string; category?: string; page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const take = 20
  const skip = (page - 1) * take

  const jobs = await db.job.findMany({
    where: {
      status: "ACTIVE",
      ...(searchParams.q && {
        OR: [
          { title: { contains: searchParams.q, mode: "insensitive" } },
          { description: { contains: searchParams.q, mode: "insensitive" } },
        ]
      }),
      ...(searchParams.type && { type: searchParams.type as JobType }),
      ...(searchParams.category && { category: searchParams.category }),
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
    include: { company: { select: { name: true, logoUrl: true, slug: true } } }
  })

  return <JobList jobs={jobs} />
}
```

```tsx
// components/jobs/JobFilters.tsx — Client Component
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete("page")  // Reset pagination on filter change
    router.push(`/jobs?${params.toString()}`)
  }, [searchParams, router])

  return (
    <div>
      <select onChange={(e) => updateFilter("type", e.target.value)}>
        <option value="">All Types</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="REMOTE">Remote</option>
        {/* ... */}
      </select>
    </div>
  )
}
```

**Teaching point:** The filter state lives in the URL, not in React state. This means filters survive page refresh, can be shared via link, and don't cause the server component to be a client component just to hold state.

---

## 13. Deployment

### Vercel (Recommended)

Vercel is the natural home for Next.js — built by the same team. Free tier is sufficient for a project like this.

**Steps:**
1. Push to GitHub.
2. Connect repo to Vercel.
3. Add environment variables in Vercel dashboard (same as `.env.local`).
4. Set up a production Postgres database — use **Neon** (serverless Postgres, free tier, Vercel integration).
5. Run `prisma migrate deploy` via Vercel's build command or a deploy hook.

**Environment variables needed:**
```
DATABASE_URL=
AUTH_SECRET=          # nextauth secret, generate with: openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
RESEND_API_KEY=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
NEXT_PUBLIC_APP_URL=  # https://yoursite.vercel.app
```

---

## 14. Testing Strategy

### What to Test and How

| Layer | Tool | What to Test |
|---|---|---|
| Unit | **Vitest** | Utility functions (`generateSlug`, `formatSalary`), Zod schemas |
| Integration | **Vitest + Prisma mock** | API route handlers, server actions |
| E2E | **Playwright** | Critical user flows: register → post job → apply → status update |

Start with Playwright E2E for the highest ROI — it tests the whole system and catches regressions.

```typescript
// tests/e2e/apply-job.spec.ts
test("seeker can apply to a job", async ({ page }) => {
  await page.goto("/jobs/senior-react-developer-acme")
  await page.click("text=Apply Now")
  await page.fill('[name="coverLetter"]', "I am a great fit...")
  await page.click("text=Submit Application")
  await expect(page.locator("text=Application submitted")).toBeVisible()
})
```

---

## 15. Learning Path for Your Friend

Structure the collaboration so he's learning incrementally, not drowning.

### Week 1–2 Concepts to Master First
- **App Router fundamentals**: layouts, pages, route groups, `loading.tsx`, `error.tsx`
- **Server vs Client components**: when to add `"use client"`, why it matters
- **`Link` and `useRouter`**: navigation in Next.js
- **Environment variables**: `process.env`, `.env.local`, `NEXT_PUBLIC_` prefix

### Week 3–4
- **Data fetching in server components**: direct `async/await` in components
- **Route handlers**: `GET`, `POST` in `route.ts`
- **Prisma basics**: `findMany`, `findUnique`, `create`, `update`, `delete`

### Week 5–6
- **React Hook Form + Zod**: form validation end-to-end
- **Server Actions**: `"use server"`, `revalidatePath`, `useTransition`
- **Auth**: sessions, `auth()` in server and client, middleware

### Week 7–9
- **URL search params**: `searchParams` in server components, `useSearchParams` in client
- **ISR and `generateStaticParams`**: understanding Next.js caching
- **Optimistic UI**: `useOptimistic` for instant feedback

### Pairing Strategy
- **You own:** Schema design, auth setup, deployment, code review
- **He owns:** Building UI components, implementing CRUD routes, wiring up forms
- Do code reviews together — not to fix his code, but to explain *why* something is done differently
- Have him explain back to you what a server component is vs a client component after Week 2 — teaching forces understanding

---

## Quick Reference — Key Package Summary

| Package | Purpose |
|---|---|
| `next` | Framework |
| `typescript` | Type safety |
| `tailwindcss` | Styling |
| `@prisma/client` | Type-safe DB queries |
| `next-auth` | Authentication |
| `@auth/prisma-adapter` | Links Auth.js to Prisma |
| `zod` | Schema validation |
| `react-hook-form` | Form state |
| `@hookform/resolvers` | Connects RHF to Zod |
| `resend` | Email delivery |
| `@react-email/components` | Email templates in JSX |
| `uploadthing` | File uploads |
| `bcryptjs` | Password hashing |
| `slugify` | Generate URL-safe slugs |
| `date-fns` | Date formatting |
| `lucide-react` | Icons |
| `@uiw/react-md-editor` | Rich text for job descriptions |
| `vitest` | Unit/integration testing |
| `@playwright/test` | End-to-end testing |
