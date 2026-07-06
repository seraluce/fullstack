import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Example REST API route.
 * GET  /api/posts        — list published posts
 * POST /api/posts        — create a post (requires auth)
 *
 * Note: Next.js 16 route handlers are async — `auth()` returns a Promise.
 */
export function GET() {
  return prisma.post
    .findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true },
      take: 50,
    })
    .then((posts) => NextResponse.json(posts))
    .catch((error) => {
      console.error("GET /api/posts failed", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: unknown; content?: unknown; published?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const published = body.published === true;

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
