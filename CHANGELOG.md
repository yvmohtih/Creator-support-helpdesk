# Changelog

## 2026-07-13

### U06: Submit Problem Details Form

- Added the `/submit-request` details form with mobile-first fields for name, platform username/channel/page, mobile, email, description, preferred language, and consent.
- Added shared validation and normalization helpers for problem details in `packages/shared`.
- Added English/Telugu labels, helper text, validation errors, loading text, preview copy, and placeholder copy.
- Added temporary session-state preview flow without sensitive details in URL query parameters.
- Added masked mobile number and masked email display on `/submit-request/preview`.
- Added Edit Details restore behavior and a non-submitting `/submit-request/complete` placeholder.
- Added tests for valid data, required fields, Indian mobile normalization, email validation, description limits, Telugu text, optional Other-platform handle, and masking.

### U05: Problem Category Selection

- Added `/get-help` with safe platform validation for Instagram, Facebook, YouTube, and Other.
- Added English/Telugu language switching for problem category selection.
- Added large touch-friendly problem category cards with icons, descriptions, and selected state.
- Added `/submit-request` placeholder that preserves platform, language, and category without creating a request.
- Updated homepage platform cards to navigate into the U05 category flow.
- Added invalid-platform and missing-category fallback screens.
- Updated shared content tests, README, architecture notes, implementation plan, AGENTS, and status tracking.

### U04: Public Homepage and Platform Selection

- Replaced the foundation placeholder homepage with a mobile-first public support entry screen.
- Added simple English and Telugu copy for first-time and rural users.
- Added large Instagram, Facebook, and YouTube platform selection buttons.
- Added client-side selected-platform feedback without API calls or request creation.
- Updated homepage metadata, styling, tests, README, architecture notes, implementation plan, AGENTS, and status tracking.

### U03: Admin Authentication and Authorization

- Added secure admin login and logout endpoints using Argon2 password verification and JWT session cookies.
- Added protected admin route guards and role authorization for `admin` and `support_agent`.
- Added admin login, authenticated placeholder, unauthorized, and loading-state UI screens.
- Added admin seed command for local administrator setup.
- Added `password_hash` to `admin_profiles` through migration `20260713010000_u03_admin_auth`.
- Added auth-focused API tests covering valid login, invalid email/password, protected routes, support-agent access, and logout.
- Updated environment examples, architecture notes, README, and status tracking for U03.

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
