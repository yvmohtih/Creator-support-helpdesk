# AGENTS.md

## Project Rules

- Follow the approved architecture and roadmap.
- Implement one roadmap unit at a time.
- Keep commits small and focused.
- Do not add future-unit business logic early.
- Prefer production-quality configuration over temporary shortcuts.

## Current Unit Boundary

U06 implements only the public problem details form, client-side validation, preview, and non-submitting continue placeholder. It must not implement database request creation, request-number generation, screenshot storage, request tracking pages, admin dashboard business UI, notifications, support request workflows, internal-note workflows, status update workflows, file upload APIs, or other future-unit business logic.

## Development Commands

```bash
npm install
npm run build
npm run lint
npm run typecheck
npm run test
npm run dev
npm run prisma:migrate:dev -w apps/api
npm run prisma:seed -w apps/api
npm run admin:seed -w apps/api
```

## Architecture Notes

- `apps/web` contains the Next.js frontend.
- `apps/api` contains the NestJS backend.
- `packages/shared` is reserved for shared constants, types, and validation schemas.
- Environment variables must be documented in `.env.example`.
- Secrets must never be committed.
