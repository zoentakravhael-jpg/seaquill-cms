"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import type { ActionResult } from "@/app/admin/actions";

interface EventItemData {
  id?: number;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  active: boolean;
}

interface EventItemFormProps {
  initialData?: EventItemData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
}

export default function EventItemForm({ initialData, action, backHref }: EventItemFormProps) {
  const router = useRouter();
  const [image, setImage] = useState(initialData?.image ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(formData.get("title") as string)?.trim()) errs.title = "Title wajib diisi";
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
        toast.success(initialData?.id ? "Event berhasil diupdate!" : "Event berhasil dibuat!");
        router.push(result.redirect);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      <div className="admin-form-grid">
        <div className="admin-form-main">
          <div className="admin-form-group">
            <label className="admin-form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`admin-form-input ${errors.title ? "admin-form-input-error" : ""}`}
              defaultValue={initialData?.title ?? ""}
              placeholder="Live Streaming Kesehatan"
            />
            {errors.title && <p className="admin-form-error">{errors.title}</p>}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              Deskripsi <span className="admin-form-optional">(optional)</span>
            </label>
            <textarea
              name="description"
              className="admin-form-input"
              rows={4}
              defaultValue={initialData?.description ?? ""}
              placeholder="Deskripsi event..."
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Image</label>
            <ImageUpload value={image} onChange={setImage} name="image" />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">Tanggal</label>
              <input
                type="date"
                name="date"
                className="admin-form-input"
                defaultValue={initialData?.date ?? ""}
              />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">Lokasi</label>
              <input
                type="text"
                name="location"
                className="admin-form-input"
                defaultValue={initialData?.location ?? ""}
                placeholder="Instagram Live / Jakarta"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">CTA Teks</label>
              <input
                type="text"
                name="ctaText"
                className="admin-form-input"
                defaultValue={initialData?.ctaText ?? ""}
                placeholder="Ikuti Event"
              />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">CTA Link</label>
              <input
                type="text"
                name="ctaLink"
                className="admin-form-input"
                defaultValue={initialData?.ctaLink ?? ""}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="admin-form-sidebar">
          <div className="admin-form-group">
            <label className="admin-form-label">Urutan</label>
            <input
              type="number"
              name="sortOrder"
              className="admin-form-input"
              defaultValue={initialData?.sortOrder ?? 0}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label-inline">
              <input
                type="checkbox"
                name="active"
                defaultChecked={initialData?.active ?? true}
              />
              <span className="ml-2">Aktif</span>
            </label>
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-ghost" onClick={() => router.push(backHref)}>
          Batal
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
          {submitting ? "Menyimpan..." : initialData?.id ? "Update Event" : "Buat Event"}
        </button>
      </div>
    </form>
  );
}
