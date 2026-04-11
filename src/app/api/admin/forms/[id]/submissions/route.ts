import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/admin/forms/[id]/submissions
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const submissions = await prisma.formSubmission.findMany({
    where: { formId: parseInt(id), deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}

// DELETE /api/admin/forms/[id]/submissions — bulk soft delete
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await params; // consume params
  const body = await request.json();
  const ids: number[] = body.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "IDs wajib diisi" }, { status: 400 });
  }

  await prisma.formSubmission.updateMany({
    where: { id: { in: ids } },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
