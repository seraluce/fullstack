import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CounterDemo } from "@/components/counter-demo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("title") };
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireAuth(locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const displayName = session.user.name ?? session.user.email ?? "";

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("welcome", { name: displayName })}
        </p>
        <p className="text-muted-foreground text-sm">{t("protected")}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("postsTitle")}</CardTitle>
            <CardDescription>Prisma · /prisma/schema.prisma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("noPosts")}</p>
            ) : (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.id} className="space-y-0.5">
                    <div className="font-medium">{post.title}</div>
                    {post.content ? (
                      <div className="text-muted-foreground line-clamp-2 text-sm">
                        {post.content}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <CounterDemo />
      </div>
    </div>
  );
}
