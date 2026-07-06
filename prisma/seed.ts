import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const demo = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: { passwordHash },
    create: {
      email: "demo@example.com",
      name: "Demo User",
      passwordHash,
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-1" },
    update: {},
    create: {
      id: "seed-post-1",
      title: "Hello from the template",
      content:
        "This post was created by `pnpm db:seed`. Edit prisma/seed.ts to add more.",
      published: true,
      authorId: demo.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-2" },
    update: {},
    create: {
      id: "seed-post-2",
      title: "Getting started",
      content: "Explore the dashboard, i18n, auth, and Prisma.",
      published: true,
      authorId: demo.id,
    },
  });

  console.log("✓ Seeded database (login: demo@example.com / demo1234)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
