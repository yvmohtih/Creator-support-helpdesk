# Changelog

## 2026-07-12

### U01: Project Foundation

- Created the monorepo foundation with `apps/web`, `apps/api`, and `packages/shared`.
- Configured Next.js, NestJS, TypeScript, ESLint, Prettier, Vitest, Prisma, Pino logging, JWT auth foundation, and S3-compatible storage foundation.
- Added root environment example, README, AGENTS, status tracking, and initial docs folders.
- Added a minimal frontend foundation page and backend health endpoint for startup verification only.
- Fixed backend environment loading so the API can read the root `.env` when launched through workspace scripts.
- Adjusted global backend error logging so 4xx responses log as warnings while 5xx responses log as errors.
- Verified install, format, lint, typecheck, tests, build, development startup, production startup, frontend response, and backend health response.

### Known Issues

- `npm install` reports dependency audit findings in third-party packages. No force upgrade was applied because it may introduce breaking changes.
- A live development watcher can become unhealthy if production build commands run at the same time, because both workflows write generated output. Stop dev servers before running production builds.
