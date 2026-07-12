# Creator Support

Mobile-first social media technical support platform for rural users, small creators, and influencers.

## Current Status

Unit U01 project foundation is implemented. The app contains infrastructure-level startup code only. Login, ticket submission, dashboards, product APIs, database tables, and business logic are intentionally not implemented yet.

## Stack

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL via Prisma
- Auth foundation: Passport/JWT dependencies and secure config placeholders
- File storage foundation: S3-compatible storage client placeholder
- Logging: Pino
- Testing: Vitest
- Linting: ESLint
- Formatting: Prettier

## Setup

```bash
npm install
cp .env.example .env
npm run build
npm run lint
npm run typecheck
npm run test
```

## Start

Development:

```bash
npm run dev
```

Production-style after build:

```bash
npm run start
```

Frontend runs on `http://localhost:3000`.
Backend runs on `http://localhost:4000`.

## U01 Boundaries

Included:

- Monorepo project foundation
- Folder structure
- TypeScript, ESLint, Prettier, Vitest
- Minimal Next.js app shell
- Minimal NestJS app shell
- Environment validation
- Database connection service configuration
- Auth module placeholder
- File upload storage module placeholder
- Logging
- Global error handling

Not included:

- Login
- Registration
- Ticket submission
- Admin dashboard
- Product APIs
- Database tables
- Business logic
