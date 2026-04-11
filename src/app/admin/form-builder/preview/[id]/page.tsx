export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormPreviewPage from "./FormPreviewClient";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id: parseInt(id) } });
  if (!form || form.deletedAt) notFound();

  return <FormPreviewPage form={form} />;
}
