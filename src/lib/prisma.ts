import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * PrismaClient singleton wired to a driver adapter (Prisma 7).
 *
 * Next.js hot-reloads dev modules, which would otherwise create a new
 * PrismaClient on every change and exhaust database connections. We stash the
 * instance on `globalThis` in development to reuse it across reloads.
 *
 * Swap the adapter here when changing databases (e.g. `@prisma/adapter-pg`).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
