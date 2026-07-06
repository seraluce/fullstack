# Next.js 全栈模板

一个开箱即用的 **Next.js 16** 全栈模板，集成了国际化、认证、数据库、状态管理、测试和代码质量工具。克隆即可开始开发，无需从头搭建。

## 技术栈

| 领域            | 技术选型                                              |
| --------------- | ----------------------------------------------------- |
| 框架            | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| 语言            | TypeScript 5                                          |
| UI              | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (radix-nova 风格) |
| 国际化          | [next-intl](https://next-intl-docs.vercel.app) (`en` / `zh`) |
| 认证            | [Auth.js v5](https://authjs.dev) (NextAuth, JWT + Credentials) |
| ORM             | [Prisma 7](https://www.prisma.io) + better-sqlite3 (驱动适配器) |
| 状态管理        | [Zustand](https://github.com/pmndrs/zustand) (带 `persist` 中间件) |
| 单元测试        | [Vitest](https://vitest.dev) + Testing Library        |
| E2E 测试        | [Playwright](https://playwright.dev)                  |
| 代码规范        | ESLint (flat config) + Prettier + `prettier-plugin-tailwindcss` |
| Git 钩子        | Husky + lint-staged + commitlint (约定式提交)         |
| 包管理器        | pnpm                                                  |

## 快速开始

```bash
# 1. 克隆模板
git clone https://github.com/seraluce/fullstack.git my-app
cd my-app

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env — 至少设置 AUTH_SECRET (使用 `openssl rand -base64 32` 生成)

# 4. 设置数据库
pnpm db:generate   # 生成 Prisma 客户端
pnpm db:push       # 创建表结构 (SQLite)
pnpm db:seed       # 填充演示用户和帖子数据

# 5. 启动开发服务器
pnpm dev
```

打开 <http://localhost:3000>，会自动跳转到 `/zh` 中文页面。

**演示账号：** `demo@example.com` / `demo1234`

## 可用脚本

```bash
pnpm dev              # 启动开发服务器 (Turbopack)
pnpm build            # 生产构建
pnpm start            # 运行生产构建
pnpm typecheck        # TypeScript 类型检查
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm format           # Prettier 格式化代码
pnpm format:check     # Prettier 检查格式

pnpm test             # Vitest 监听模式
pnpm test:run         # Vitest 单次运行 (CI 模式)
pnpm test:ui          # Vitest UI 界面
pnpm test:e2e         # Playwright E2E 测试
pnpm test:e2e:ui      # Playwright UI 界面

pnpm db:generate      # 生成 Prisma 客户端
pnpm db:push          # 推送 schema 到数据库 (开发用)
pnpm db:seed          # 填充演示数据
pnpm db:studio        # 打开 Prisma Studio
pnpm db:migrate       # 创建迁移
pnpm db:reset         # 重置数据库
```

## 项目结构

```
.
├── messages/                 # 国际化翻译文件 (en.json, zh.json)
├── prisma/
│   ├── schema.prisma         # Prisma 7 数据模型 (User, Account, Session, Post, …)
│   └── seed.ts               # 演示数据填充脚本
├── prisma.config.ts          # Prisma 7 数据源 URL + 驱动适配器配置
├── public/                   # 静态资源
├── src/
│   ├── app/
│   │   ├── [locale]/         # 国际化路由 (en, zh)
│   │   │   ├── layout.tsx    # 根布局 (html/body, providers)
│   │   │   ├── page.tsx      # 首页
│   │   │   ├── login/        # 登录流程 (服务端 Action)
│   │   │   ├── dashboard/    # 受保护页面 (requireAuth + Prisma + Zustand)
│   │   │   └── not-found.tsx # 404 页面
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # Auth.js 处理器
│   │       └── posts/route.ts                # REST API 示例
│   ├── auth.ts               # NextAuth 配置 (Credentials + JWT)
│   ├── components/           # 应用组件 + shadcn/ui 基础组件
│   ├── i18n/                 # next-intl 路由、请求、导航配置
│   ├── lib/
│   │   ├── prisma.ts         # PrismaClient 单例 (驱动适配器)
│   │   ├── auth-guard.ts     # requireAuth() 辅助函数
│   │   ├── actions/          # 共享服务端 Actions
│   │   └── utils.ts          # cn() 工具函数
│   ├── store/                # Zustand 状态仓库
│   ├── types/                # 类型声明扩展
│   ├── generated/            # Prisma 客户端输出 (gitignored)
│   └── proxy.ts              # Next.js 16 代理 (原 middleware.ts)
├── tests/
│   ├── setup.ts              # Vitest 配置 (jest-dom, cleanup)
│   ├── unit/                 # Vitest 单测
│   └── e2e/                  # Playwright E2E 测试
├── eslint.config.mjs         # ESLint flat config
├── .prettierrc.json          # Prettier 配置
├── .lintstagedrc.json        # lint-staged 配置
├── commitlint.config.json    # commitlint 配置
├── vitest.config.ts          # Vitest 配置
├── playwright.config.ts      # Playwright 配置
├── components.json           # shadcn/ui 配置
└── next.config.ts            # Next.js 配置
```

## 功能详解

### 国际化 (next-intl)

- 语言配置集中在 [`src/i18n/routing.ts`](src/i18n/routing.ts)，自动应用到代理、导航助手和类型安全的 `<Link>`。
- 新增语言只需扩展 `locales` 数组并创建对应的 `messages/<locale>.json`。
- 所有 URL 都带语言前缀 (`/en/...`, `/zh/...`)，配置为 `localePrefix: "always"`。
- 服务端组件使用 `getTranslations` / `getMessages` 获取翻译；客户端组件通过 `NextIntlClientProvider` + `useTranslations`。

### 认证 (Auth.js v5)

- 配置位于 [`src/auth.ts`](src/auth.ts) — JWT 会话 + Credentials 提供者，基于 Prisma `User` 表验证。
- Prisma schema 已包含 `Account`、`Session`、`VerificationToken` 模型，方便后续接入 Prisma adapter 或 OAuth 提供者。
- **路由保护不在 `proxy.ts` 中实现。** 每个受保护页面/布局都调用 [`src/lib/auth-guard.ts`](src/lib/auth-guard.ts) 的 `requireAuth(locale)`。这样保护逻辑显式且不受代理匹配规则变更影响。
- 登录流程使用 React 19 `useActionState` 服务端 Action，位于 [`src/app/[locale]/login/actions.ts`](src/app/[locale]/login/actions.ts)。

### 数据库 (Prisma 7)

- **Prisma 7 重要变更已处理：**
  - 数据源 `url` 位于 [`prisma.config.ts`](prisma.config.ts)（不在 `schema.prisma` 中）。
  - 驱动适配器 (`@prisma/adapter-better-sqlite3`) 是必需的，已在 [`src/lib/prisma.ts`](src/lib/prisma.ts) 中配置。
  - 生成器使用 `provider = "prisma-client"` 并指定 `output` 路径；客户端从 `@/generated/prisma/client` 导入。
- 切换数据库时，修改 `src/lib/prisma.ts` 和 `prisma/seed.ts` 的适配器（如 `@prisma/adapter-pg`），并更新 `prisma.config.ts`。

### 状态管理 (Zustand)

- 示例仓库 [`src/store/counter-store.ts`](src/store/counter-store.ts) 展示 `persist` 中间件配合 `localStorage`。
- 由 [`src/components/counter-demo.tsx`](src/components/counter-demo.tsx) 消费，在受保护的仪表盘页面中展示。

### API 路由

- 示例 REST 端点 [`src/app/api/posts/route.ts`](src/app/api/posts/route.ts)：
  - `GET /api/posts` — 获取已发布的帖子列表（公开）
  - `POST /api/posts` — 创建帖子（需要认证，通过 `auth()` 验证）

### 代码质量

- **ESLint** flat config 继承 `eslint-config-next` (core-web-vitals + TypeScript)。
- **Prettier** 配合 `prettier-plugin-tailwindcss` 自动排序 Tailwind 类名。
- **Husky** Git 钩子：
  - `pre-commit` → 运行 `lint-staged`（对暂存文件执行 eslint --fix + prettier --write）
  - `commit-msg` → 运行 `commitlint`（强制约定式提交）
- 提交类型：`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`。

## 环境变量

复制 [`.env.example`](.env.example) 为 `.env` 并填写：

| 变量名              | 说明                                  | 示例                    |
| ------------------- | ------------------------------------- | ----------------------- |
| `DATABASE_URL`      | Prisma 数据源 URL                      | `file:./dev.db`         |
| `AUTH_SECRET`       | NextAuth JWT 密钥（必需）              | `openssl rand -base64 32` |
| `AUTH_URL`          | 应用 URL（生产环境）                   | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | 应用名称（客户端可见）             | `Next.js Template`      |

## Next.js 16 重要变更

此模板已适配 Next.js 16 的重大变更：

- **`middleware.ts` → `proxy.ts`**：见 [`src/proxy.ts`](src/proxy.ts)（函数名为 `proxy`）。
- **异步请求 API**：`cookies()`、`headers()`、`params`、`searchParams` 都已正确 await。
- **Turbopack 默认启用**：配置了 `experimental.turbopackFileSystemCacheForDev`。
- **ESLint Flat Config**：默认使用 (`eslint.config.mjs`)。
- `next lint` 已移除 — 直接运行 `pnpm lint`（ESLint CLI）。

## 添加 shadcn/ui 组件

```bash
pnpm dlx shadcn@latest add <组件名>
# 例如：pnpm dlx shadcn@latest add dialog
```

配置位于 [`components.json`](components.json)（风格：`radix-nova`，基础色：`neutral`）。

## 开发建议

1. **新增页面**：在 `src/app/[locale]/` 下创建文件夹，自动继承国际化布局。
2. **新增 API**：在 `src/app/api/` 下创建路由，使用 `auth()` 验证用户身份。
3. **新增状态**：在 `src/store/` 创建 Zustand 仓库，可选 `persist` 中间件。
4. **新增语言**：修改 `src/i18n/routing.ts` 的 `locales`，并创建对应翻译文件。
5. **数据库变更**：修改 `prisma/schema.prisma` 后运行 `pnpm db:push` 或 `pnpm db:migrate`。

## 部署指南

### 当前模板的部署限制

本模板使用 **Prisma + better-sqlite3**（原生 Node.js 模块），这对部署平台有一定要求：

| 平台                | 是否直接支持 | 说明                                                                 |
|---------------------|-------------|----------------------------------------------------------------------|
| **Vercel**          | ✅ 完全支持 | Next.js 官方平台，原生支持 Node.js 原生模块                          |
| **Railway**         | ✅ 完全支持 | 全栈平台，支持 Node.js 原生模块，提供 PostgreSQL 免费层              |
| **Render**          | ✅ 完全支持 | 支持 Node.js，提供 PostgreSQL 免费层                                |
| **Fly.io**          | ✅ 完全支持 | 容器化部署，完全控制环境                                            |
| **Docker + VPS**    | ✅ 完全支持 | 最灵活，适合自定义配置                                              |
| **Cloudflare Pages** | ❌ 不支持 | Edge/Node.js 运行时不支持 `better-sqlite3` 原生模块                  |
| **Netlify**         | ⚠️ 有限支持 | 需要配置 `@netlify/plugin-nextjs`，且原生模块支持不稳定              |

### ✅ 推荐部署方案

#### 方案一：Vercel（最推荐）

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录并部署
vercel login
vercel
```

**生产环境建议**：将 SQLite 切换为 PostgreSQL（Vercel 提供免费 PostgreSQL 试用）。

#### 方案二：Railway

```bash
# 安装 Railway CLI
pnpm add -g @railway/cli

# 登录并部署
railway login
railway init
railway up
```

在 Railway 控制台添加环境变量，并创建 PostgreSQL 数据库。

#### 方案三：Render

1. 在 [Render](https://render.com) 创建 Web Service
2. 连接 GitHub 仓库
3. 设置：
   - Build Command：`pnpm install && pnpm db:generate && pnpm build`
   - Start Command：`pnpm start`
4. 添加环境变量

### ⚠️ Cloudflare Pages 部署（需改造）

如果一定要部署到 Cloudflare Pages，需要做以下改造：

**步骤 1：移除 better-sqlite3 相关依赖**

```bash
pnpm remove @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3
```

**步骤 2：切换数据库方案**

**方案 A：使用 Cloudflare D1（推荐）**

```bash
pnpm add drizzle-orm @cloudflare/d1
pnpm add -D drizzle-kit
```

然后用 drizzle-orm 替代 Prisma，配置 D1 绑定。

**方案 B：使用外部 PostgreSQL**

```bash
pnpm add @prisma/adapter-pg pg @types/pg
```

修改 `src/lib/prisma.ts` 使用 `PrismaPg` 适配器。

**步骤 3：调整 `prisma.config.ts`**

移除驱动适配器相关配置，使用外部数据库 URL。

**步骤 4：配置 Cloudflare Pages**

设置构建命令：`pnpm install && pnpm db:generate && pnpm build`，并添加环境变量。

### 生产环境配置清单

- [ ] 设置 `AUTH_SECRET`（使用 `openssl rand -base64 32` 生成）
- [ ] 设置 `AUTH_URL` 为生产域名
- [ ] 切换数据库为 PostgreSQL（推荐）
- [ ] 配置 HTTPS（所有平台默认支持）
- [ ] 设置 `NEXT_PUBLIC_APP_NAME`

## 许可证

MIT — 可自由使用作为项目起点。