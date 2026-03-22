"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import type { ActionResult } from "@/app/admin/actions";

interface GalleryItemData {
  id?: number;
  image: string;
  caption: string;
  platform: string;
  url: string;
  sortOrder: number;
  active: boolean;
}

interface GalleryItemFormProps {
  initialData?: GalleryItemData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
}

export default function GalleryItemForm({ initialData, action, backHref }: GalleryItemFormProps) {
  const router = useRouter();
  const [image, setImage] = useState(initialData?.image ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(formData.get("image") as string)?.trim()) errs.image = "Image wajib diisi";
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
        toast.success(initialData?.id ? "Item berhasil diupdate!" : "Item berhasil dibuat!");
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
              Image <span className="text-red-500">*</span>
            </label>
            <ImageUpload value={image} onChange={setImage} name="image" />
            {errors.image && <p className="admin-form-error">{errors.image}</p>}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              Caption <span className="admin-form-optional">(optional)</span>
            </label>
            <input
              type="text"
              name="caption"
              className="admin-form-input"
              defaultValue={initialData?.caption ?? ""}
              placeholder="Deskripsi gambar..."
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Platform</label>
            <select
              name="platform"
              className="admin-form-input"
              defaultValue={initialData?.platform ?? "instagram"}
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              URL <span className="admin-form-optional">(optional)</span>
            </label>
            <input
              type="text"
              name="url"
              className="admin-form-input"
              defaultValue={initialData?.url ?? ""}
              placeholder="https://instagram.com/p/..."
            />
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
          {submitting ? "Menyimpan..." : initialData?.id ? "Update Item" : "Buat Item"}
        </button>
      </div>
    </form>
  );
}
