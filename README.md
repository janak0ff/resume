# Resume Studio

A production-oriented Next.js App Router starter for database-backed, shareable resumes. The original resume content is preserved in `prisma/seed.ts` as the default profile; public pages render records from PostgreSQL rather than hard-coded HTML.

## Stack

Next.js App Router + TypeScript, Tailwind CSS, Prisma/PostgreSQL, Zod validation, server actions, and a secure HTTP-only cookie session abstraction using bcrypt.

## Local setup

1. Copy `.env.example` to `.env` and set a long random `AUTH_SECRET`.
2. Install dependencies with `npm install`.
3. Start the local PostgreSQL container: `npm run db:up`.
4. Apply schema and seed locally: `npm run db:push && npm run db:seed` (the seed password defaults to `change-me-now`; set `SEED_PASSWORD` in your shell for a different one). For deployment, use `npm run db:deploy` instead of `db:push`.
5. Start with `npm run dev`, then visit `/janak`, `/register`, or `/dashboard`.

## Routes and API

- `/` product landing page
- `/[username]` public responsive resume; print/download uses browser print
- `/register`, `/login`, `/dashboard` authenticated editing
- `GET /api/profile?username=janak` or `GET /api/profile` with a username route extension
- `PATCH /api/profile` updates the signed-in user's basics and returns validation errors

The dashboard edits profile basics, skills, links, experience, projects, education, and certifications. The resource API supports authenticated `POST`, `PATCH`, and `DELETE` operations at `/api/profile/{links|experiences|projects|educations|certifications|skills}`.

## Production and security notes

Use a managed PostgreSQL instance, a high-entropy `AUTH_SECRET`, HTTPS, secure cookies, and `npm run db:deploy` in deployment. Add rate limiting/WAF in front of auth endpoints, email verification/password reset, CSRF protection for any cross-origin mutation, audit logging, backups, and observability before public launch. Never commit `.env` or seed credentials. Validate every mutation with Zod and scope database writes to the authenticated profile.

## GitHub Student Developer Pack

Use the pack selectively rather than adding unnecessary services:

- **GitHub Codespaces**: add a `.devcontainer` later for a reproducible Next.js + Prisma development environment.
- **GitHub Actions**: run type-checking, Prisma validation, build, and dependency audits on every pull request; deploy only from the protected `main` branch.
- **Azure student credits**: a good production path is Azure Container Apps or App Service for Next.js, Azure Database for PostgreSQL for Prisma, Blob Storage for profile images, and Key Vault for secrets.
- **GitHub Pro/Copilot**: use private repositories, code review, Dependabot, secret scanning, and faster development—not as runtime dependencies.
- **Student domain offer**: point a verified custom domain at the production deployment and use `NEXT_PUBLIC_APP_URL` for canonical links.

Benefits and partner limits change, so confirm current eligibility and amounts at [education.github.com/pack](https://education.github.com/pack). Keep PostgreSQL as the primary database; MongoDB or a second cloud database is not needed for this schema.
