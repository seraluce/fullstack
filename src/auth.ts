import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Uses the credentials provider with JWT sessions against the Prisma `User`
 * table. To add OAuth providers (GitHub, Google, …), import the provider from
 * `next-auth/providers/*` and add it to `providers`. The `Account`/`Session`/
 * `VerificationToken` models are already in the schema for the Prisma adapter.
 *
 * Route protection is intentionally NOT done in `proxy.ts` — it lives in
 * `requireAuth()` (see `src/lib/auth-guard.ts`) so every protected layout/page
 * and Server Action verifies the session explicitly.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (token.id && session.user) session.user.id = token.id;
      return session;
    },
  },
});
