import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 CLI configuration.
 * The database URL moved here from `schema.prisma`. `dotenv/config` loads
 * `.env` so the CLI can read `DATABASE_URL` for `db push` / `migrate`.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
