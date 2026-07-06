import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing configuration.
 * Add new locales here — they automatically flow through to the proxy,
 * the request config, navigation helpers, and type-safe `<Link>`.
 */
export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  // Always prefix the locale in the URL: /en/about, /zh/about.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
