# Creator Support

Mobile-first social media technical support platform for rural users, small creators, and influencers.

## Current Status

Unit U06 problem details form and preview is implemented and verified. Database request creation, request-number generation, screenshot upload/storage, request tracking, dashboards, product APIs, and notifications are intentionally not implemented yet.

## Stack

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL via Prisma
- Auth: Nest JWT sessions with HTTP-only admin cookies
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

## Database

The API uses Prisma with PostgreSQL.

Useful commands:

```bash
npm run prisma:generate -w apps/api
npm run prisma:migrate:dev -w apps/api
npm run prisma:seed -w apps/api
npm run admin:seed -w apps/api
```

U02 migration:

```text
apps/api/prisma/migrations/20260712182000_u02_database_schema/migration.sql
```

Request numbers should be generated later in application logic using this format:

```text
RB-YYYY-XXXXXX
```

Example:

```text
RB-2026-AB12CD
```

The field and database check constraint are prepared in U02; request creation logic belongs to a later unit.

## Admin Authentication

Seed a local administrator before testing login:

```bash
DATABASE_URL=postgresql://yvmohith@localhost:5432/creator_support \
PASSWORD_HASH_PEPPER=local-development-pepper-value \
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD=AdminPass123 \
ADMIN_FULL_NAME="System Admin" \
ADMIN_ROLE=admin \
npm run admin:seed -w apps/api
```

Admin login is available at:

```text
http://127.0.0.1:3000/admin/login
```

Protected admin routes redirect unauthenticated users to the login page. The dashboard screen is intentionally only an authenticated placeholder in U03.

## Public Homepage

The public homepage is available at:

```text
http://127.0.0.1:3000
```

It introduces the service in simple English and Telugu and lets users choose Instagram, Facebook, YouTube, or Other. Platform selection routes to `/get-help`.

## Problem Category Selection

Problem category selection is available at:

```text
http://127.0.0.1:3000/get-help?platform=instagram
```

Supported platforms are `instagram`, `facebook`, `youtube`, and `other`. The page supports English and Telugu with `lang=en` or `lang=te`.

Selecting a category routes to:

```text
/submit-request?platform=instagram&category=account-disabled&lang=en
```

In U06 this route collects and validates details, then navigates to `/submit-request/preview` using temporary browser session state. It does not create a support request.

Preview route:

```text
/submit-request/preview?platform=instagram&category=account-disabled&lang=en
```

The preview masks mobile number and email. The Continue action goes to a placeholder page stating that request submission will be completed in the next step.

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

## Current Boundaries

Included:

- Monorepo project foundation
- Folder structure
- TypeScript, ESLint, Prettier, Vitest
- Minimal Next.js app shell
- Minimal NestJS app shell
- Environment validation
- Database connection service configuration
- Admin authentication module
- File upload storage module placeholder
- Logging
- Global error handling
- Database schema for admin profiles, issue categories, support requests, messages, attachments, and status history
- Issue category seed data
- Database-focused schema tests
- Admin login, logout, session validation, and role authorization for `admin` and `support_agent`
- Public homepage with mobile-first platform selection
- Public problem category selection and submit-request placeholder
- Public problem details form, validation, masked preview, and edit restore

Not included:

- Registration
- Screenshot upload
- Ticket submission and database request creation
- Request-number generation
- Request tracking
- Admin dashboard business UI
- Product APIs
- Business logic
