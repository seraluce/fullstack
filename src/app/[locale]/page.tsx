import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURE_KEYS = [
  "i18n",
  "auth",
  "db",
  "ui",
  "state",
  "test",
  "quality",
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary">Next.js 16 · React 19 · Tailwind v4</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-xl">{t("subtitle")}</p>
        <p className="text-muted-foreground max-w-2xl">{t("description")}</p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">{t("cta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("secondaryCta")}
            </a>
          </Button>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-semibold">{t("featuresTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_KEYS.map((key) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t(`features.${key}`)}
                </CardTitle>
                <CardDescription>{key}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{key}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
