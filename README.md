# Creator Support

Mobile-first social media technical support platform for rural users, small creators, and influencers.

## Current Status

Unit U02 database schema work is implemented but still needs verification against a live PostgreSQL development database. Login, ticket submission, dashboards, product APIs, and business logic are intentionally not implemented yet.

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

## Database

The API uses Prisma with PostgreSQL.

Useful commands:

```bash
npm run prisma:generate -w apps/api
npm run prisma:migrate:dev -w apps/api
npm run prisma:seed -w apps/api
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
- Auth module placeholder
- File upload storage module placeholder
- Logging
- Global error handling
- Database schema for admin profiles, issue categories, support requests, messages, attachments, and status history
- Issue category seed data
- Database-focused schema tests

Not included:

- Login
- Registration
- Ticket submission
- Admin dashboard
- Product APIs
- Business logic
