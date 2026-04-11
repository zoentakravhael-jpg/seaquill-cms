import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/admin/forms — list all forms
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const forms = await prisma.form.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: { where: { deletedAt: null } } } } },
  });

  return NextResponse.json(forms);
}

// POST /api/admin/forms — create a form
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, slug, description, fields, settings, status } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Nama dan slug wajib diisi." }, { status: 400 });
  }

  const existing = await prisma.form.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug sudah digunakan." }, { status: 400 });
  }

  const form = await prisma.form.create({
    data: {
      name,
      slug,
      description: description || "",
      fields: typeof fields === "string" ? fields : JSON.stringify(fields || []),
      settings: typeof settings === "string" ? settings : JSON.stringify(settings || {}),
      status: status || "published",
    },
  });

  return NextResponse.json(form, { status: 201 });
}
