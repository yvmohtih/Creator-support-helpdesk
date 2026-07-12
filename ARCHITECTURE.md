# Architecture

## Stack

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL with Prisma
- Authentication foundation: Nest JWT and Passport dependencies
- File storage foundation: S3-compatible storage client
- Logging: Pino
- Testing: Vitest

## Current Scope

U02 adds the database schema only. It does not add authentication flows, ticket submission, admin dashboards, or business APIs.

## Database Overview

The MVP database has six application tables:

- `admin_profiles`
- `issue_categories`
- `support_requests`
- `request_messages`
- `request_attachments`
- `request_status_history`

Authentication user identity is represented by `admin_profiles.auth_user_id`, which is intended to reference the external/auth-provider user ID. No duplicate password table is introduced.

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
