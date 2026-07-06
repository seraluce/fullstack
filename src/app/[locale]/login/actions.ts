"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export type LoginState = { error: "invalid" | "generic" } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const locale =
    (formData.get("locale") as Locale | null) ?? routing.defaultLocale;

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid" };
    }
    throw error;
  }

  redirect({ href: "/dashboard", locale });
}
