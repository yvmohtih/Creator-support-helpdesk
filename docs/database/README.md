# Database Schema

## Migration

Current migration:

```text
apps/api/prisma/migrations/20260712182000_u02_database_schema/migration.sql
```

## Tables

### admin_profiles

Stores application-level administrator profile data.

Columns:

- `id`
- `auth_user_id`
- `full_name`
- `role`
- `is_active`
- `created_at`
- `updated_at`

Roles:

- `admin`
- `support_agent`

Indexes:

- `admin_profiles_auth_user_id_key`
- `idx_admin_profiles_role`
- `idx_admin_profiles_is_active`

### issue_categories

Stores selectable support problem categories.

Columns:

- `id`
- `platform`
- `name_en`
- `name_te`
- `description_en`
- `description_te`
- `is_active`
- `sort_order`
- `created_at`
- `updated_at`

Platforms:

- `instagram`
- `facebook`
- `youtube`
- `other`

Indexes:

- `idx_issue_categories_platform_active_sort`
- `uq_issue_categories_platform_name_en`
- `uq_issue_categories_id_platform`

### support_requests

Stores the main user problem submission.

Columns:

- `id`
- `request_number`
- `platform`
- `category_id`
- `user_name`
- `platform_username`
- `mobile_number`
- `email`
- `description`
- `preferred_language`
- `status`
- `priority`
- `assigned_admin_id`
- `created_at`
- `updated_at`
- `resolved_at`

Statuses:

- `received`
- `checking`
- `need_more_details`
- `solution_provided`
- `completed`

Priorities:

- `low`
- `normal`
- `high`
- `urgent`

Indexes:

- `support_requests_request_number_key`
- `idx_support_requests_status`
- `idx_support_requests_platform`
- `idx_support_requests_mobile_number`
- `idx_support_requests_created_at`
- `idx_support_requests_category_id`
- `idx_support_requests_assigned_admin_id`

### request_messages

Stores user, admin, and system messages for a support request.

Columns:

- `id`
- `support_request_id`
- `sender_type`
- `sender_admin_id`
- `message`
- `is_internal_note`
- `created_at`

Sender types:

- `user`
- `admin`
- `system`

Rules:

- User messages cannot be internal notes.
- Admin messages require an admin reference.
- Internal notes are not intended for user-facing responses.

Indexes:

- `idx_request_messages_request_created_at`
- `idx_request_messages_sender_admin_id`

### request_attachments

Stores uploaded file metadata only.

Columns:

- `id`
- `support_request_id`
- `request_message_id`
- `storage_path`
- `original_file_name`
- `mime_type`
- `file_size`
- `uploaded_by`
- `created_at`

Upload sources:

- `user`
- `admin`

Indexes:

- `idx_request_attachments_request_id`
- `idx_request_attachments_message_id`

### request_status_history

Stores audit history for support request status changes.

Columns:

- `id`
- `support_request_id`
- `old_status`
- `new_status`
- `changed_by_admin_id`
- `note`
- `created_at`

Indexes:

- `idx_request_status_history_request_created_at`
- `idx_request_status_history_admin_id`

## Request Number Strategy

Format:

```text
RB-YYYY-XXXXXX
```

Example:

```text
RB-2026-AB12CD
```

Rules:

- Must be unique.
- Must be easy to read and share.
- Must not rely only on sequential database IDs.
- The database validates the format.
- Generation logic will be implemented in a later support request unit.

## Commands

Generate Prisma Client:

```bash
npm run prisma:generate -w apps/api
```

Apply migrations to development database:

```bash
npm run prisma:migrate:dev -w apps/api
```

Apply migrations in deployed environments:

```bash
npm run prisma:migrate:deploy -w apps/api
```

Seed issue categories:

```bash
npm run prisma:seed -w apps/api
```

Reset local database:

```bash
npm run prisma:migrate:reset -w apps/api
```

## Verification Notes

This repository includes database-focused tests that execute the migration SQL against an in-memory PostgreSQL-compatible database. The test harness skips only PostgreSQL trigger/function DDL and extension setup that `pg-mem` cannot parse, while preserving table, enum, relationship, index, and constraint verification.
