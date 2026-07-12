# Changelog

## 2026-07-12

### U02: Database Schema and Migrations

- Added Prisma models and enums for the MVP database schema.
- Added SQL migration `20260712182000_u02_database_schema`.
- Added six MVP tables: `admin_profiles`, `issue_categories`, `support_requests`, `request_messages`, `request_attachments`, and `request_status_history`.
- Added database constraints, foreign keys, useful indexes, UUID defaults, timestamp defaults, and `updated_at` triggers.
- Added idempotent issue category seed data for Instagram, Facebook, YouTube, and Other.
- Added database-focused schema tests using an in-memory PostgreSQL-compatible test database.
- Added database documentation, architecture notes, and implementation plan notes.
- Installed/reached local PostgreSQL tooling and verified the migration against the `creator_support` development database.
- Verified migration reset/reapply and reseeded issue categories successfully.

### U02 Known Limitations

- Database tests verify the migration SQL against `pg-mem`; the test harness skips only PostgreSQL extension and trigger/function DDL that `pg-mem` cannot parse.

### U01: Project Foundation

- Created the monorepo foundation with `apps/web`, `apps/api`, and `packages/shared`.
- Configured Next.js, NestJS, TypeScript, ESLint, Prettier, Vitest, Prisma, Pino logging, JWT auth foundation, and S3-compatible storage foundation.
- Added root environment example, README, AGENTS, status tracking, and initial docs folders.
- Added a minimal frontend foundation page and backend health endpoint for startup verification only.
- Fixed backend environment loading so the API can read the root `.env` when launched through workspace scripts.
- Adjusted global backend error logging so 4xx responses log as warnings while 5xx responses log as errors.
- Verified install, format, lint, typecheck, tests, build, development startup, production startup, frontend response, and backend health response.

### Known Issues

- `npm install` reports dependency audit findings in third-party packages. No force upgrade was applied because it may introduce breaking changes.
- A live development watcher can become unhealthy if production build commands run at the same time, because both workflows write generated output. Stop dev servers before running production builds.
