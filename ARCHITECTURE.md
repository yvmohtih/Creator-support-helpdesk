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

U03 adds administrator authentication and authorization only. It does not add public user login, ticket submission, admin dashboard business UI, support request workflows, internal-note workflows, status update workflows, or product APIs.

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
RB-2026-AB12CD
```

The database enforces the format and uniqueness. Generation logic belongs to the future request creation unit.
