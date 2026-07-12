# Project Status

## Current Unit

U04: Public Homepage and Platform Selection

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
- Admin password hash migration
- Admin seed script
- Admin login endpoint
- Admin logout endpoint
- Admin session validation endpoint
- Protected admin API route foundation
- Role-based authorization for `admin` and `support_agent`
- Mobile-friendly admin login page
- Authenticated admin placeholder page
- Unauthorized page
- Auth loading state
- Public mobile-first homepage
- Instagram, Facebook, and YouTube platform selection buttons
- English and Telugu public helper copy
- Client-side selected-platform feedback

## What Does Not Exist Yet

- Registration
- Problem selection
- Ticket submission
- Database request creation
- Request tracking page
- Dashboard business UI
- Product APIs
- Business logic
- Public user authentication
- Support request workflows
- Internal note workflows
- Status update workflows

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
- `prisma migrate status` confirmed the U03 database schema is up to date
- `admin:seed` created/updated local administrator `admin@example.com`
- Production app startup succeeded at `http://127.0.0.1:3000` and `http://127.0.0.1:4000`
- Admin login page returned `200 OK`
- Unauthenticated `/admin` redirected to `/admin/login?next=%2Fadmin`
- Valid admin login returned `201 Created` and set an HTTP-only `admin_session` cookie
- Invalid email returned `400 Bad Request`
- Invalid password returned `401 Unauthorized`
- Authenticated `/api/v1/admin/auth/me` returned the admin profile
- Authenticated protected admin ping returned `200 OK`
- Invalid session token returned `401 Unauthorized`
- Logout cleared the session cookie
- Post-logout `/api/v1/admin/auth/me` returned `401 Unauthorized`
- Public homepage returned `200 OK` at `http://127.0.0.1:3000`
- Homepage displayed Instagram, Facebook, and YouTube support options
- Homepage displayed English and Telugu helper copy
- Platform selection updated local feedback without navigation or API request creation
- Mobile viewport check at 390px confirmed full-width large buttons and no horizontal overflow
- Desktop viewport check at 1024px confirmed three-column platform layout and no horizontal overflow

## Notes

U04 is WORKING. Public homepage, platform selection feedback, tests, build, startup, and visual verification pass.

Implemented U02 work:

- Six-table MVP schema: admin profiles, issue categories, support requests, request messages, request attachments, request status history.
- Seed data for Instagram, Facebook, YouTube, and Other categories.
- Request number database format guard: `RB-YYYY-XXXXXX`.
- Database-level constraints for required values, allowed enums, foreign keys, category/platform consistency, internal-note safety, file size, and status-history changes.

Implemented U03 work:

- Admin JWT session cookie with HTTP-only, SameSite Lax settings.
- Argon2 admin password hash storage and verification.
- In-memory login attempt rate limiting.
- Admin guards for session validation and role checks.
- Protected admin route foundation for later dashboard/support-request units.
- Mobile-friendly admin login UI and unauthorized page.

Implemented U04 work:

- Public homepage for rural, non-technical, mobile-first users.
- Large platform selection buttons for Instagram, Facebook, and YouTube.
- Bilingual English/Telugu helper text.
- Local platform selection feedback with no API call and no request creation.

Do not run production build commands while development watchers are active; Next.js and NestJS both write generated output during those workflows.
