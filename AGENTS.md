# AGENTS.md

## Project Rules

- Follow the approved architecture and roadmap.
- Implement one roadmap unit at a time.
- Keep commits small and focused.
- Do not add future-unit business logic early.
- Prefer production-quality configuration over temporary shortcuts.

## Current Unit Boundary

U02 creates only the database schema, migrations, seed data, and database-focused tests. It must not implement login, registration, ticket submission, admin dashboard, product APIs, file upload APIs, or business logic.

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
```

## Architecture Notes

- `apps/web` contains the Next.js frontend.
- `apps/api` contains the NestJS backend.
- `packages/shared` is reserved for shared constants, types, and validation schemas.
- Environment variables must be documented in `.env.example`.
- Secrets must never be committed.
