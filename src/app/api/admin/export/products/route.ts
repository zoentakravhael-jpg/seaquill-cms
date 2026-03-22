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

  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { category: true },
    orderBy: { id: "asc" },
  });

  const headers = [
    "ID", "Name", "Slug", "SKU", "Category", "Status",
    "Stock", "Best Seller", "New", "Rating", "Review Count",
    "Short Description", "Tags", "Created At",
  ];

  const rows = products.map((p) => [
    p.id,
    escapeCsv(p.name),
    escapeCsv(p.slug),
    escapeCsv(p.sku),
    escapeCsv(p.category.title),
    escapeCsv(p.status),
    p.stock ? "In Stock" : "Out of Stock",
    p.isBestSeller ? "Yes" : "No",
    p.isNew ? "Yes" : "No",
    p.rating,
    p.reviewCount,
    escapeCsv(p.shortDescription),
    escapeCsv(p.tags.join(", ")),
    p.createdAt.toISOString().split("T")[0],
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="products-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
