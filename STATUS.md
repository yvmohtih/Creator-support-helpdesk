# Project Status

## Current Unit

U02: Database Schema and Migrations

## Status

WORKING

## Last Verified

July 13, 2026

## What Exists

- Monorepo workspace structure
- Next.js frontend app shell
- NestJS backend app shell
- Shared package placeholder
- TypeScript configuration
- ESLint configuration
- Prettier configuration
- Vitest configuration
- Environment variable example
- Database connection service configuration
- Auth module foundation
- File storage service foundation
- Pino logging foundation
- Global error handling foundation
- README and AGENTS documentation
- Prisma schema with U02 database entities
- SQL migration for the MVP database schema
- Issue category seed script
- Database-focused schema tests
- Database schema documentation

## What Does Not Exist Yet

- Login
- Registration
- Ticket submission
- Dashboard
- Product APIs
- Business logic

## Verification

Completed successfully:

- `npm install`
- `npm run lint`
- `npm run format:check`
- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run start`
- `npm run dev`
- Frontend HTTP check: `http://127.0.0.1:3000` returned `200 OK`
- Backend health check: `http://127.0.0.1:4000/api/v1/health` returned `{"success":true,"data":{"status":"ok","service":"creator-support-api"}}`
- Database schema tests using in-memory PostgreSQL-compatible verification passed
- PostgreSQL runtime installed/reached locally
- `prisma migrate dev` applied U02 migration successfully
- `prisma migrate reset --force --skip-generate --skip-seed` reset and reapplied U02 migration successfully
- `prisma:seed` inserted issue categories successfully
- Live PostgreSQL verification confirmed 6 MVP tables, 18 issue categories, and 9 foreign keys

## Notes

U02 is WORKING. Live PostgreSQL migration, reset/reapply, seed, constraints, tests, build, and startup verification pass.

Implemented U02 work:

- Six-table MVP schema: admin profiles, issue categories, support requests, request messages, request attachments, request status history.
- Seed data for Instagram, Facebook, YouTube, and Other categories.
- Request number database format guard: `RB-YYYY-XXXXXX`.
- Database-level constraints for required values, allowed enums, foreign keys, category/platform consistency, internal-note safety, file size, and status-history changes.

Do not run production build commands while development watchers are active; Next.js and NestJS both write generated output during those workflows.
