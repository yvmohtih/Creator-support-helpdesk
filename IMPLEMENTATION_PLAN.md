# Implementation Plan

## Current Roadmap

- U01: Project Foundation - complete
- U02: Database Schema and Migrations - complete
- U03: Admin Authentication and Authorization - complete
- U04: Public Homepage and Platform Selection - complete
- U05: Problem Category Selection - complete
- U06: Submit Problem Details Form - complete
- U07: Save Request, Generate Request Number, and Confirmation - complete
- U08: Screenshot Upload - complete

## U08 Boundary

U08 includes only:

- Optional screenshot selection on the preview step
- Client-side file count, type, size, combined size, and duplicate checks
- Image previews with remove action
- Server-side file count, type, extension, size, combined size, duplicate, and magic-byte checks
- Private S3-compatible storage using generated storage paths
- Attachment metadata stored in `request_attachments`
- Cleanup of uploaded objects when upload or database processing fails
- Confirmation attachment count
- Unit tests for upload validation, safe paths, metadata, idempotency, and cleanup

U08 excludes:

- Public user registration or login
- Request tracking pages
- Admin dashboard business UI
- Admin replies
- Admin screenshot viewing or signed download URLs
- Support request workflows
- Internal notes and status update workflows
- Any future-unit business flow
