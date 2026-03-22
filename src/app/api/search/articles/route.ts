import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [] });
  }

  const articles = await prisma.blogPost.findMany({
    where: {
      status: "published",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q.toLowerCase()] } },
      ],
    },
    select: {
      title: true,
      slug: true,
      image: true,
      excerpt: true,
      publishedAt: true,
      category: { select: { slug: true, title: true } },
    },
    take: 20,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ articles });
}
