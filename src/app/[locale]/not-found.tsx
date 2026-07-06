import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-muted-foreground text-6xl font-bold">404</p>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Button asChild>
        <Link href="/">{t("back")}</Link>
      </Button>
    </div>
  );
}
