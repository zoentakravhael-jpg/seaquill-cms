export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubmissionsClient from "./SubmissionsClient";

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await prisma.form.findUnique({
    where: { id: parseInt(id) },
    include: {
      submissions: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!form || form.deletedAt) notFound();

  let fields: Array<{ name: string; label: string }> = [];
  try { fields = JSON.parse(form.fields); } catch { /* empty */ }

  return (
    <SubmissionsClient
      form={{ id: form.id, name: form.name, slug: form.slug }}
      fields={fields}
      submissions={form.submissions.map((s) => ({
        id: s.id,
        data: s.data,
        ip: s.ip,
        read: s.read,
        createdAt: s.createdAt.toISOString(),
      }))}
    />
  );
}
