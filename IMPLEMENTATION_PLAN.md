# Implementation Plan

## Current Roadmap

- U01: Project Foundation - complete
- U02: Database Schema and Migrations - complete
- U03: Admin Authentication and Authorization - complete
- U04: Public Homepage and Platform Selection - complete
- U05: Problem Category Selection - complete
- U06: Submit Problem Details Form - complete

## U06 Boundary

U06 includes only:

- `/submit-request` problem details form
- Client-side and shared validation
- English and Telugu form labels, helpers, errors, preview copy, and loading copy
- Temporary session-state preview flow
- Masked mobile and email preview
- Edit Details restore behavior
- Non-submitting continue placeholder
- Invalid platform/category fallback states
- Validation and masking tests

U06 excludes:

- Public user registration or login
- Screenshot upload
- Database request creation
- Request-number generation
- Request tracking pages
- Ticket submission APIs
- File upload APIs
- Admin dashboard business UI
- Support request workflows
- Internal notes and status update workflows
- Any future-unit business flow
