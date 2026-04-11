import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

// GET /api/admin/forms/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await prisma.form.findUnique({
    where: { id: parseInt(id) },
    include: { _count: { select: { submissions: { where: { deletedAt: null } } } } },
  });

  if (!form || form.deletedAt) {
    return NextResponse.json({ error: "Form tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(form);
}

// PUT /api/admin/forms/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, fields, settings, status } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Nama dan slug wajib diisi." }, { status: 400 });
  }

  const existing = await prisma.form.findFirst({ where: { slug, NOT: { id: parseInt(id) } } });
  if (existing) {
    return NextResponse.json({ error: "Slug sudah digunakan." }, { status: 400 });
  }

  const form = await prisma.form.update({
    where: { id: parseInt(id) },
    data: {
      name,
      slug,
      description: description || "",
      fields: typeof fields === "string" ? fields : JSON.stringify(fields || []),
      settings: typeof settings === "string" ? settings : JSON.stringify(settings || {}),
      status: status || "published",
    },
  });

  await logActivity("update", "form", form.id, form.name);

  return NextResponse.json(form);
}

// DELETE /api/admin/forms/[id] - soft delete
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await prisma.form.update({
    where: { id: parseInt(id) },
    data: { deletedAt: new Date() },
  });

  await logActivity("delete", "form", form.id, form.name);

  return NextResponse.json({ success: true });
}
