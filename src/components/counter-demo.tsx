"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCounterStore } from "@/store/counter-store";

/**
 * Demo consumer of the Zustand `counter` store.
 * State is persisted to localStorage, so the value survives reloads.
 */
export function CounterDemo() {
  const t = useTranslations("dashboard");
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("counter")}</CardTitle>
        <CardDescription>Zustand + persist (localStorage)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-semibold tabular-nums">{count}</div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={decrement}>
            {t("decrement")}
          </Button>
          <Button type="button" size="sm" onClick={increment}>
            {t("increment")}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={reset}>
            {t("reset")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
