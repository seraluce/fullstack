import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Use these instead of `next/link` and
 * `next/navigation` so the current locale is automatically preserved.
 *
 * @example
 * import { Link } from "@/i18n/navigation";
 * <Link href="/about">About</Link>  // -> /en/about or /zh/about
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
