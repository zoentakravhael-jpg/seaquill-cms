export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormBuilderEditor from "@/components/admin/FormBuilderEditor";

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id: parseInt(id) } });
  if (!form || form.deletedAt) notFound();

  return (
    <FormBuilderEditor
      initialData={{
        id: form.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
        fields: form.fields,
        settings: form.settings,
        status: form.status,
      }}
    />
  );
}
