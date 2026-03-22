"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SlugInput from "./SlugInput";
import type { ActionResult } from "@/app/admin/actions";

interface CategoryData {
  id?: number;
  title: string;
  slug: string;
  icon?: string;
  description?: string;
  sortOrder: number;
}

interface CategoryFormProps {
  initialData?: CategoryData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
  showIcon?: boolean;
  showDescription?: boolean;
  entityName?: string;
}

export default function CategoryForm({
  initialData,
  action,
  backHref,
  showIcon = false,
  showDescription = false,
  entityName = "Kategori",
}: CategoryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(formData.get("title") as string)?.trim()) errs.title = "Judul wajib diisi";
    if (!(formData.get("slug") as string)?.trim()) errs.slug = "Slug wajib diisi";
    return errs;
  }

  async function handleSubmit(formData: FormData) {
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Harap lengkapi field yang wajib diisi");
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await action(formData);
      if (result.success) {
        toast.success(
          initialData
            ? `${entityName} berhasil diperbarui`
            : `${entityName} berhasil ditambahkan`
        );
        router.push(result.redirect);
      } else {
        toast.error(result.error);
        setSubmitting(false);
      }
    } catch {
      toast.error(`Gagal menyimpan ${entityName.toLowerCase()}`);
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {/* Title */}
      <div className={`admin-form-group${errors.title ? " has-error" : ""}`}>
        <label className="admin-form-label">
          Judul <span className="required">*</span>
        </label>
        <input
          name="title"
          required
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors(prev => { const { title: _, ...rest } = prev; return rest; }); }}
          className="admin-form-input"
          placeholder={`Nama ${entityName.toLowerCase()}`}
        />
        {errors.title && <p className="admin-form-error">{errors.title}</p>}
      </div>

      {/* Slug */}
      <SlugInput sourceValue={title} value={slug} onChange={(v) => { setSlug(v); setErrors(prev => { const { slug: _, ...rest } = prev; return rest; }); }} error={errors.slug} />

      {/* Icon (product categories only) */}
      {showIcon && (
        <div className="admin-form-group">
          <label className="admin-form-label">Icon (CSS class)</label>
          <input
            name="icon"
            defaultValue={initialData?.icon ?? ""}
            className="admin-form-input"
            placeholder="flaticon-healthcare"
          />
          <p className="admin-form-hint">Class name dari icon font (e.g., flaticon-healthcare)</p>
        </div>
      )}

      {/* Description (product categories only) */}
      {showDescription && (
        <div className="admin-form-group">
          <label className="admin-form-label">Deskripsi</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description ?? ""}
            className="admin-form-textarea"
            placeholder="Deskripsi singkat kategori"
          />
        </div>
      )}

      {/* Sort Order */}
      <div className="admin-form-group" style={{ maxWidth: 200 }}>
        <label className="admin-form-label">Urutan</label>
        <input
          name="sortOrder"
          type="number"
          defaultValue={initialData?.sortOrder ?? 0}
          className="admin-form-input"
        />
      </div>

      {/* Actions */}
      <div className="admin-form-actions">
        <button
          type="submit"
          disabled={submitting}
          className="admin-btn admin-btn-primary"
        >
          {submitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Menyimpan...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> Simpan
            </>
          )}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => router.push(backHref)}
        >
          Batal
        </button>
      </div>
    </form>
  );
}
