# Project Status

## Current Unit

U08: Screenshot Upload

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
- Public `/get-help` category selection route
- Safe platform validation for Instagram, Facebook, YouTube, and Other
- English and Telugu problem category content
- Large touch-friendly category cards
- `/submit-request` placeholder that shows selected platform and category
- Invalid platform and missing category fallback screens
- Public `/submit-request` problem details form
- Shared problem details validation helpers
- English and Telugu form labels, helper text, validation errors, loading text, preview text, and placeholder text
- Temporary session-state preview flow
- Masked mobile number and masked email preview
- Edit Details restore behavior
- Public support request save API
- Server-side request validation before database write
- Request-number generation using readable `RB-YYYY-XXXXXX` format
- Idempotent public request submission using a browser-generated key
- Initial `received` status history creation in the same transaction as request creation
- Public `/request-submitted` confirmation page with copy action
- Non-tracking `/track-request` placeholder linked from confirmation
- Submit attempt rate limiting foundation
- Optional screenshot upload on the preview screen
- Client-side screenshot previews with remove action
- Server-side screenshot validation for count, size, MIME type, extension, and magic bytes
- Private S3-compatible screenshot storage through generated storage paths
- Screenshot attachment metadata saved in `request_attachments`
- Upload cleanup when storage or database processing fails

## What Does Not Exist Yet

- Registration
- Request tracking page
- Notifications
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
- `/get-help?platform=instagram` displayed the Instagram category screen
- `/get-help?platform=bad` displayed a friendly invalid-platform message and home button
- `/get-help?platform=instagram&lang=te` displayed Telugu screen text and categories
- Selecting a category routed to `/submit-request?platform=instagram&category=account-disabled&lang=te`
- `/submit-request` placeholder displayed the selected platform/category and no form inputs
- `/submit-request?platform=instagram` displayed the missing-category fallback
- Mobile viewport check at 390px confirmed category cards are full-width, at least 96px tall, and have no horizontal overflow
- Homepage platform cards now navigate to `/get-help`
- `/submit-request?platform=instagram&category=account-disabled&lang=en` displayed the details form
- Empty form submission showed clear inline errors and focused the name field
- Invalid mobile number and very short problem description were blocked while preserving entered values
- Telugu interface switch preserved entered values
- Valid Telugu and English mixed text reached preview
- Preview route displayed selected platform, category, name, handle, masked mobile number, masked email, description, and preferred language
- Preview URL did not contain mobile, email, name, or problem description
- Edit Details restored saved form values and preserved Telugu interface language
- Continue action opened `/submit-request/complete` placeholder without submitting a request
- Invalid platform and invalid category URLs showed simple fallback screens
- Mobile, tablet, and desktop viewport checks confirmed no horizontal overflow and 56px submit button height
- Public request save API returned a generated request number after valid details
- Database write created one `support_requests` row and one initial `request_status_history` row
- Reusing the same idempotency key returned the same request number without creating a second row
- Invalid category and invalid mobile submissions were rejected before writing
- Confirmation page displayed request number, selected platform/category, masked mobile, submitted date, and action buttons
- Confirmation URL did not contain name, mobile, email, description, or request number
- Copy Request Number copied the generated request number to the browser clipboard and showed a success message
- Track Request opened a simple placeholder instead of a 404
- Request submission without screenshots still succeeds
- Valid PNG/JPEG/WEBP screenshots pass server-side validation
- Unsupported files, misleading extensions, duplicate selections, oversized files, too many files, and combined oversize selections are rejected
- Screenshot storage paths use generated IDs and do not include original filenames
- Attachment metadata links to the correct support request
- Failed upload/database paths trigger cleanup of already-uploaded private objects
- Local app startup succeeded for U08 at `http://127.0.0.1:3000` and `http://127.0.0.1:4000`
- Temporary local S3-compatible endpoint accepted private upload objects through the app storage service
- Multipart submission with one valid PNG screenshot returned a request number and `attachmentCount: 1`
- Retrying the same idempotency key returned the same request number and did not duplicate attachments
- Multipart submission with three valid screenshots returned `attachmentCount: 3`
- Database verification confirmed attachment rows, status history, generated storage paths, original filename metadata, MIME type, file size, and `uploaded_by = user`
- Private storage verification confirmed generated objects existed under request-specific paths
- Browser verification confirmed mobile upload UI copy, privacy warning, Select Photos button, file count, and Telugu upload copy

## Notes

U08 is WORKING. Optional screenshot upload, client preview/remove UI, server validation, private storage upload, attachment metadata creation, cleanup behavior, no-screenshot submission, tests, build, startup, and manual verification pass.

Known U07 limitation:

- Public submit idempotency and rate limiting are in-memory MVP safeguards. They prevent repeat clicks in the running process, but they reset on server restart.

Known U08 limitations:

- Upload idempotency follows the same in-memory MVP model as U07 and resets on server restart.
- Image metadata stripping is not implemented.
- Admin screenshot viewing and signed download URLs are not implemented yet.
- Manual upload verification used a temporary local S3-compatible test endpoint because no real local S3 service was running at `localhost:9000`.

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

Implemented U05 work:

- Public category selection for Instagram, Facebook, YouTube, and Other.
- Safe query validation for platform, language, and category.
- English/Telugu category names, descriptions, buttons, and error messages.
- Submit-request placeholder with no inputs, upload, API call, or database write.

Implemented U06 work:

- Public problem details form for selected platform and category.
- Shared validation for required fields, Indian mobile numbers, optional email, description length, preferred language, and consent.
- Temporary session-state preview without sensitive URL parameters.
- Masked mobile/email preview and Edit Details restore.
- Continue placeholder only; no database write, screenshot upload, request number, tracking, or notifications.

Implemented U07 work:

- Public support request API for saving validated form data.
- Safe category slug mapping from public UI choices to persisted issue categories.
- Request numbers generated server-side in the `RB-YYYY-XXXXXX` format with ambiguous suffix characters avoided.
- Transactional support request creation plus initial `received` status history.
- Idempotency key support to prevent duplicate rows on repeat submit.
- Confirmation page that shows only safe details and clears temporary form/preview state after success.
- Track Request placeholder only; no request lookup is implemented yet.
- Seed data aligned with all public category cards.

Implemented U08 work:

- Optional screenshot picker on the preview step before final submission.
- Client validation for 3 files maximum, 5 MB per file, 12 MB combined, allowed image types, and duplicate selections.
- Server validation for count, size, MIME type, extension, and image signatures.
- Private S3-compatible upload using generated storage paths: `support-requests/{request-id}/{generated-file-id}.{extension}`.
- Attachment metadata stored in `request_attachments`; raw image data is never stored in the database.
- All-or-nothing attachment strategy: when screenshots are selected, all must upload and all attachment rows must save, or the request returns an error and uploaded objects are cleaned up.

Do not run production build commands while development watchers are active; Next.js and NestJS both write generated output during those workflows.
