import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (nodejs runtime).
 * next-intl's `createMiddleware` returns a plain request handler that works
 * fine on the nodejs runtime, so we re-export it as `proxy`.
 *
 * Auth is NOT enforced here — proxy can't be the only auth gate (Server Actions
 * and Route Handlers must verify sessions themselves). Route protection lives
 * in `src/lib/auth-guard.ts` and is called from protected layouts/pages.
 */
const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip Next internals, API routes, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
