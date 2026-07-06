"use server";

import { signOut } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export async function signOutAction(formData: FormData) {
  await signOut({ redirect: false });
  const locale = (formData.get("locale") as Locale) ?? routing.defaultLocale;
  redirect({ href: "/", locale });
}
