# Implementation Plan

## Current Roadmap

- U01: Project Foundation - complete
- U02: Database Schema and Migrations - complete
- U03: Admin Authentication and Authorization - complete
- U04: Public Homepage and Platform Selection - complete
- U05: Problem Category Selection - complete
- U06: Submit Problem Details Form - complete
- U07: Save Request, Generate Request Number, and Confirmation - complete

## U07 Boundary

U07 includes only:

- Public support request save API
- Server-side validation using shared problem-details rules
- Safe category slug to persisted issue category mapping
- Active category verification before insert
- Server-side request-number generation
- Transactional support request and initial status-history creation
- Idempotency key handling for repeated submit attempts
- Submit attempt rate limiting foundation
- `/request-submitted` confirmation page with request number, masked mobile, and submitted date
- Confirmation copy action with fallback message
- Seed data alignment with all public category cards
- Unit tests for save, defaults, request number format, collisions, invalid input, idempotency, and transaction failure

U07 excludes:

- Public user registration or login
- Screenshot upload
- Request tracking pages
- File upload APIs
- Admin dashboard business UI
- Admin replies
- Support request workflows
- Internal notes and status update workflows
- Any future-unit business flow
