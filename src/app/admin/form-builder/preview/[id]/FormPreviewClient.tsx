"use client";

import { useRouter } from "next/navigation";
import FormPreview from "@/components/admin/FormPreview";
import { FormField, FormSettings, defaultFormSettings } from "@/types/form-builder";

interface Props {
  form: {
    id: number;
    name: string;
    slug: string;
    fields: string;
    settings: string;
  };
}

export default function FormPreviewPage({ form }: Props) {
  const router = useRouter();

  let fields: FormField[] = [];
  let settings: FormSettings = defaultFormSettings;
  try { fields = JSON.parse(form.fields); } catch { /* empty */ }
  try { settings = { ...defaultFormSettings, ...JSON.parse(form.settings) }; } catch { /* empty */ }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <i className="fas fa-eye" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
            Preview: {form.name}
          </h1>
          <p className="admin-page-subtitle">Slug: /{form.slug}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => router.push("/admin/form-builder")} className="admin-btn admin-btn-secondary">
            <i className="fas fa-arrow-left"></i> Kembali
          </button>
          <button onClick={() => router.push(`/admin/form-builder/edit/${form.id}`)} className="admin-btn admin-btn-primary">
            <i className="fas fa-edit"></i> Edit Form
          </button>
        </div>
      </div>

      <FormPreview fields={fields} settings={settings} />
    </div>
  );
}
