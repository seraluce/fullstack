# Next.js Full-Stack Template

A production-ready **Next.js 16** starter wired with i18n, authentication, Prisma, Zustand, testing, and code-quality tooling. Clone it and start building — no scaffolding required.

## Tech Stack

| Area            | Choice                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router, Turbopack)                                           |
| Language        | TypeScript 5                                                                                       |
| UI              | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (radix-nova style) |
| i18n            | [next-intl](https://next-intl-docs.vercel.app) (`en` / `zh`)                                       |
| Auth            | [Auth.js v5](https://authjs.dev) (NextAuth, JWT + Credentials)                                     |
| ORM             | [Prisma 7](https://www.prisma.io) + better-sqlite3 (driver adapter)                                |
| State           | [Zustand](https://github.com/pmndrs/zustand) (with `persist`)                                      |
| Unit tests      | [Vitest](https://vitest.dev) + Testing Library                                                     |
| E2E tests       | [Playwright](https://playwright.dev)                                                               |
| Lint / Format   | ESLint (flat config) + Prettier + `prettier-plugin-tailwindcss`                                    |
| Git hooks       | Husky + lint-staged + commitlint (conventional)                                                    |
| Package manager | pnpm                                                                                               |

## Quick Start

```bash
# 1. Clone the template
git clone <your-repo-url> my-app
cd my-app

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env — at minimum set AUTH_SECRET (use `openssl rand -base64 32`)

# 4. Set up the database
pnpm db:generate   # generate the Prisma client
pnpm db:push       # create tables (SQLite)
pnpm db:seed       # seed demo user + posts

# 5. Run the dev server
pnpm dev
```

Open <http://localhost:3000>. You'll be redirected to `/en`.

**Demo login:** `demo@example.com` / `demo1234`

## Available Scripts

```bash
pnpm dev              # start dev server (Turbopack)
pnpm build            # production build
pnpm start            # run the production build
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint .
pnpm lint:fix         # eslint . --fix
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .

pnpm test             # vitest (watch)
pnpm test:run         # vitest run (CI mode)
pnpm test:ui          # vitest --ui
pnpm test:e2e         # playwright test
pnpm test:e2e:ui      # playwright test --ui

pnpm db:generate      # prisma generate
pnpm db:push          # push schema to DB (dev)
pnpm db:seed          # seed demo data
pnpm db:studio        # prisma studio
pnpm db:migrate       # prisma migrate dev
pnpm db:reset         # prisma migrate reset
```

## Project Structure

```
.
├── messages/                 # i18n translation files (en.json, zh.json)
├── prisma/
│   ├── schema.prisma         # Prisma 7 schema (User, Account, Session, Post, …)
│   └── seed.ts               # demo data seeder
├── prisma.config.ts          # Prisma 7 datasource URL + driver adapter config
├── public/                   # static assets
├── src/
│   ├── app/
│   │   ├── [locale]/         # localized routes (en, zh)
│   │   │   ├── layout.tsx    # root layout (html/body, providers)
│   │   │   ├── page.tsx      # home / landing
│   │   │   ├── login/        # auth login flow (server action)
│   │   │   ├── dashboard/    # protected page (requireAuth + Prisma + Zustand)
│   │   │   └── not-found.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # Auth.js handlers
│   │       └── posts/route.ts                # example REST API
│   ├── auth.ts               # NextAuth config (Credentials + JWT)
│   ├── components/           # app components + shadcn/ui primitives
│   ├── i18n/                 # next-intl routing, request, navigation
│   ├── lib/
│   │   ├── prisma.ts         # PrismaClient singleton (driver adapter)
│   │   ├── auth-guard.ts     # requireAuth() helper
│   │   ├── actions/          # shared server actions
│   │   └── utils.ts          # cn() helper
│   ├── store/                # Zustand stores
│   ├── types/                # ambient type augmentations
│   ├── generated/            # Prisma client output (gitignored)
│   └── proxy.ts              # Next.js 16 proxy (was middleware.ts)
├── tests/
│   ├── setup.ts              # vitest setup (jest-dom, cleanup)
│   ├── unit/                 # vitest specs
│   └── e2e/                  # playwright specs
├── eslint.config.mjs         # ESLint flat config
├── .prettierrc.json
├── .lintstagedrc.json
├── commitlint.config.json
├── vitest.config.ts
├── playwright.config.ts
├── components.json           # shadcn/ui config
└── next.config.ts
```

## Feature Walkthroughs

### Internationalization (next-intl)

- Locales are declared once in [`src/i18n/routing.ts`](src/i18n/routing.ts) and flow through the proxy, navigation helpers, and the typed `<Link>`.
- Add a new locale by extending `locales` and creating a matching `messages/<locale>.json`.
- All URLs are locale-prefixed (`/en/...`, `/zh/...`) via `localePrefix: "always"`.
- Server components fetch translations with `getTranslations` / `getMessages`; client components use `NextIntlClientProvider` + `useTranslations`.

### Authentication (Auth.js v5)

- Config lives in [`src/auth.ts`](src/auth.ts) — JWT sessions + a Credentials provider backed by the Prisma `User` table.
- The Prisma schema already ships `Account`, `Session`, and `VerificationToken` models so you can drop in the Prisma adapter or OAuth providers later.
- **Route protection is intentionally not done in `proxy.ts`.** Every protected page/layout calls `requireAuth(locale)` from [`src/lib/auth-guard.ts`](src/lib/auth-guard.ts). This keeps protection explicit and resilient to proxy matcher changes.
- Login flow uses a React 19 `useActionState` server action in [`src/app/[locale]/login/actions.ts`](src/app/[locale]/login/actions.ts).

### Database (Prisma 7)

- **Prisma 7 breaking changes are handled:**
  - The datasource `url` lives in [`prisma.config.ts`](prisma.config.ts) (not in `schema.prisma`).
  - A driver adapter (`@prisma/adapter-better-sqlite3`) is mandatory and wired in [`src/lib/prisma.ts`](src/lib/prisma.ts).
  - The generator uses `provider = "prisma-client"` with an explicit `output` path; the client is imported from `@/generated/prisma/client`.
- To switch databases, swap the adapter in `src/lib/prisma.ts` and `prisma/seed.ts` (e.g. `@prisma/adapter-pg`) and update `prisma.config.ts`.

### State (Zustand)

- Example store in [`src/store/counter-store.ts`](src/store/counter-store.ts) shows the `persist` middleware with `localStorage`.
- Consumed by [`src/components/counter-demo.tsx`](src/components/counter-demo.tsx), which is rendered on the protected dashboard.

### API Routes

- Example REST endpoint at [`src/app/api/posts/route.ts`](src/app/api/posts/route.ts):
  - `GET /api/posts` — list published posts (public)
  - `POST /api/posts` — create a post (requires auth via `auth()`)

### Code Quality

- **ESLint** flat config extends `eslint-config-next` (core-web-vitals + TypeScript).
- **Prettier** with `prettier-plugin-tailwindcss` for automatic class sorting.
- **Husky** hooks:
  - `pre-commit` → runs `lint-staged` (eslint --fix + prettier --write on staged files)
  - `commit-msg` → runs `commitlint` (conventional commits enforced)
- Commit types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

## Environment Variables

Copy [`.env.example`](.env.example) to `.env` and fill in:

| Variable               | Description                    | Example                   |
| ---------------------- | ------------------------------ | ------------------------- |
| `DATABASE_URL`         | Prisma datasource URL          | `file:./dev.db`           |
| `AUTH_SECRET`          | NextAuth JWT secret (required) | `openssl rand -base64 32` |
| `AUTH_URL`             | App URL (production)           | `http://localhost:3000`   |
| `NEXT_PUBLIC_APP_NAME` | Public app name (client-safe)  | `Next.js Template`        |

## Next.js 16 Notes

This template already accounts for Next.js 16 breaking changes:

- **`middleware.ts` → `proxy.ts`**: see [`src/proxy.ts`](src/proxy.ts) (function named `proxy`).
- **Async Request APIs**: `cookies()`, `headers()`, `params`, and `searchParams` are all awaited in this codebase.
- **Turbopack by default**: enabled, with `experimental.turbopackFileSystemCacheForDev`.
- **ESLint Flat Config** is the default (`eslint.config.mjs`).
- `next lint` is removed — run `pnpm lint` (ESLint CLI) instead.

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component>
# e.g. pnpm dlx shadcn@latest add dialog
```

Config is in [`components.json`](components.json) (style: `radix-nova`, base color: `neutral`).

## License

MIT — use freely as a starter.
