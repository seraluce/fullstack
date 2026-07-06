"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/sign-out";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <form action={signOutAction}>
      <input type="hidden" name="locale" value={locale} />
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
        {t("logout")}
      </Button>
    </form>
  );
}
