# Architecture

## Stack

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL with Prisma
- Authentication: Nest JWT with HTTP-only admin session cookies
- File storage foundation: S3-compatible storage client
- Logging: Pino
- Testing: Vitest

## Current Scope

U08 adds optional screenshot upload to public request submission. It stores screenshots in private S3-compatible object storage, saves metadata in `request_attachments`, and keeps request tracking lookup, admin dashboard business UI, notifications, admin replies, internal-note workflows, status update workflows, and admin download access out of scope.

## Public Homepage Overview

The root web route `/` introduces the service in simple English and Telugu. It provides large tap targets for Instagram, Facebook, and YouTube. Selecting a platform updates local UI state only; no API call or database write occurs in U04.

## Problem Category Selection Overview

The `/get-help` route validates the `platform` query parameter for `instagram`, `facebook`, `youtube`, or `other`. It renders localized English/Telugu category choices from shared frontend content based on the issue categories created in U02. Selecting a category navigates to `/submit-request` with safe query parameters. U05 keeps `/submit-request` as a placeholder and performs no API call or database write.

## Problem Details Form Overview

The `/submit-request` route validates platform and category query parameters, then renders a client-side form for user details. Validation logic lives in `packages/shared` and is reused by the server before saving. Preview data is stored temporarily in `sessionStorage` and sensitive fields are not placed in URLs. The preview masks mobile numbers and email addresses.

## Public Request Submission Overview

The preview Submit Request action calls `POST /api/v1/public/support-requests` with the selected platform, category slug, problem details, consent, a browser-generated idempotency key, and optional screenshot files. The API validates the input, maps the category slug to the persisted category name, confirms the category is active, generates a request number, and creates the support request plus initial status history inside one database transaction.

On success, the frontend clears temporary form, preview, and file state, then stores only safe confirmation details in `sessionStorage`: request number, platform, category, masked mobile, submitted date, and attachment count. The confirmation URL does not include user contact details, description, request number, or storage paths.

## Screenshot Upload Overview

Screenshots are selected on the preview screen and stay in temporary browser memory until final submission. The API accepts multipart form data when screenshots are present and JSON when they are not.

Validation happens on both client and server. Server validation is authoritative and checks:

- Maximum 3 files
- Maximum 5 MB per file
- Maximum 12 MB combined
- JPEG, PNG, and WEBP MIME types
- Matching extension
- Image magic bytes
- Duplicate file selection

Storage uses private S3-compatible objects with generated paths:

```text
support-requests/{request-id}/{generated-file-id}.{extension}
```

The original filename is saved only as metadata. If screenshots are selected, the strategy is all-or-nothing: all screenshots must upload and all attachment rows must be saved. If a later upload or database insert fails, uploaded objects from that submission are deleted and the request is not reported as successful.

## Authentication Overview

Administrator sessions use a signed JWT stored in an HTTP-only `admin_session` cookie. The API validates the cookie on protected admin routes, reloads the active admin profile from PostgreSQL, and checks role metadata before allowing access.

Supported admin roles:

- `admin`
- `support_agent`

Both roles can access protected admin routes prepared in U03. Passwords are stored only as Argon2 hashes in `admin_profiles.password_hash`, with `PASSWORD_HASH_PEPPER` applied before verification. Login attempts are rate-limited in memory as a practical MVP safeguard.

## Database Overview

The MVP database has six application tables:

- `admin_profiles`
- `issue_categories`
- `support_requests`
- `request_messages`
- `request_attachments`
- `request_status_history`

Authentication user identity is represented by `admin_profiles.auth_user_id`. U03 stores the admin password hash on the same profile table so the MVP can authenticate administrators without adding public user accounts.

## Relationships

- One admin profile can be assigned to many support requests.
- One issue category can have many support requests.
- One support request can have many messages.
- One support request can have many attachments.
- One request message can have many attachments.
- One support request can have many status history rows.

Important history tables use restrictive deletion rules so support history is not accidentally deleted.

## Request Number Strategy

Use:

```text
RB-YYYY-XXXXXX
```

Example:

```text
RB-2026-AB2CDE
```

The database enforces the format and uniqueness. The API generates request numbers with an ambiguous-character-safe suffix and retries when a unique collision occurs.
