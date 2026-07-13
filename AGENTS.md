# AGENTS.md

## Project Rules

- Follow the approved architecture and roadmap.
- Implement one roadmap unit at a time.
- Keep commits small and focused.
- Do not add future-unit business logic early.
- Prefer production-quality configuration over temporary shortcuts.

## Current Unit Boundary

U08 implements only optional screenshot upload during public request submission, private storage, server-side upload validation, attachment metadata creation, and upload cleanup. It must not implement request tracking lookup, admin dashboard business UI, notifications, admin replies, internal-note workflows, status update workflows, admin download access, or other future-unit business logic.

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
