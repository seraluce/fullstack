import "server-only";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Returns the current session or redirects to the localized login page.
 * Call this from protected layouts/pages (and Server Actions that need auth).
 *
 * Don't rely on `proxy.ts` for protection — matcher changes can silently skip
 * the proxy, so every protected entry point must verify the session itself.
 */
export async function requireAuth(locale: Locale) {
  const session = await auth();
  if (!session?.user) {
    redirect({ href: "/login", locale });
  }
  // `redirect` throws, so reaching here means the session exists.
  return session as {
    user: { id: string; name?: string | null; email?: string | null };
  };
}
