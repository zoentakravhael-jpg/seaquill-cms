"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import type { ActionResult } from "@/app/admin/actions";

interface BrandPartnerData {
  id?: number;
  name: string;
  logoImage: string;
  url: string;
  sortOrder: number;
  active: boolean;
}

interface BrandPartnerFormProps {
  initialData?: BrandPartnerData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
}

export default function BrandPartnerForm({ initialData, action, backHref }: BrandPartnerFormProps) {
  const router = useRouter();
  const [logoImage, setLogoImage] = useState(initialData?.logoImage ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(formData.get("name") as string)?.trim()) errs.name = "Nama wajib diisi";
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
        toast.success(initialData?.id ? "Brand berhasil diupdate!" : "Brand berhasil dibuat!");
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
        {/* Left column */}
        <div className="admin-form-main">
          <div className="admin-form-group">
            <label className="admin-form-label">
              Nama Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`admin-form-input ${errors.name ? "admin-form-input-error" : ""}`}
              defaultValue={initialData?.name ?? ""}
              placeholder="Kimia Farma"
            />
            {errors.name && <p className="admin-form-error">{errors.name}</p>}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Logo</label>
            <ImageUpload value={logoImage} onChange={setLogoImage} name="logoImage" />
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
              placeholder="https://www.kimiafarma.co.id"
            />
          </div>
        </div>

        {/* Right column */}
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
          {submitting ? "Menyimpan..." : initialData?.id ? "Update Brand" : "Tambah Brand"}
        </button>
      </div>
    </form>
  );
}
