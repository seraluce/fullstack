import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const session = await auth();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-base font-bold tracking-tight">
          Next.js Template
        </Link>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">{t("home")}</Link>
          </Button>

          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">{t("dashboard")}</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">{t("login")}</Link>
            </Button>
          )}

          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
