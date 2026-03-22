import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      status: "published",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q.toLowerCase()] } },
      ],
    },
    select: {
      name: true,
      slug: true,
      image: true,
      shortDescription: true,
      category: { select: { slug: true, title: true } },
    },
    take: 20,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ products });
}
