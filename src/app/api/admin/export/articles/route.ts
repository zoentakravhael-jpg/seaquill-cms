import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function escapeCsv(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.blogPost.findMany({
    where: { deletedAt: null },
    include: { category: true },
    orderBy: { id: "asc" },
  });

  const headers = [
    "ID", "Title", "Slug", "Author", "Category", "Status",
    "Excerpt", "Tags", "Published At", "Created At",
  ];

  const rows = articles.map((a) => [
    a.id,
    escapeCsv(a.title),
    escapeCsv(a.slug),
    escapeCsv(a.author),
    escapeCsv(a.category.title),
    escapeCsv(a.status),
    escapeCsv(a.excerpt),
    escapeCsv(a.tags.join(", ")),
    a.publishedAt.toISOString().split("T")[0],
    a.createdAt.toISOString().split("T")[0],
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="articles-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
