# Nexus — Modern Job Board

A full-stack job board platform built with Next.js, Prisma, and Tailwind CSS.

## Features

- **Job Seekers**: Browse jobs, create profiles, upload CVs, and apply.
- **Employers**: Create accounts, post jobs, review applications, and manage listings.
- **Admins**: Moderate listings, manage users, and view analytics.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth)
- **File Storage**: Uploadthing
- **Email**: Resend + React Email
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL (or Docker)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in the required values.

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
nexus/
├── app/                  # Next.js App Router
├── components/           # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions, Prisma client, auth config
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Learn More

To learn more about the technologies used, check out:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

MIT
