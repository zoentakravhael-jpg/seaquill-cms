"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import type { ActionResult } from "@/app/admin/actions";

interface HeroSlideData {
  id?: number;
  subtitle: string;
  title: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
  ctaText2: string;
  ctaLink2: string;
  sortOrder: number;
  active: boolean;
  groupId?: number | null;
}

interface GroupOption {
  id: number;
  name: string;
}

interface HeroSlideFormProps {
  initialData?: HeroSlideData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
  groups?: GroupOption[];
}

export default function HeroSlideForm({ initialData, action, backHref, groups = [] }: HeroSlideFormProps) {
  const router = useRouter();
  const [bgImage, setBgImage] = useState(initialData?.bgImage ?? "");
  const [active, setActive] = useState(initialData?.active ?? true);
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
        toast.success(initialData?.id ? "Slide berhasil diupdate!" : "Slide berhasil dibuat!");
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
              Subtitle <span className="admin-form-optional">(optional)</span>
            </label>
            <input
              type="text"
              name="subtitle"
              className="admin-form-input"
              defaultValue={initialData?.subtitle ?? ""}
              placeholder="Sehat Setiap Hari, Nikmati Hidup Berkualitas"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`admin-form-input ${errors.title ? "admin-form-input-error" : ""}`}
              defaultValue={initialData?.title ?? ""}
              placeholder="Sea-Quill, Suplemen Terpercaya Untuk Kesehatan Anda"
            />
            {errors.title && <p className="admin-form-error">{errors.title}</p>}
            <p className="admin-form-hint">Teks &quot;Sea-Quill&quot; akan otomatis ditampilkan berwarna hijau</p>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Background Image</label>
            <ImageUpload value={bgImage} onChange={setBgImage} name="bgImage" />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">CTA Button 1 - Teks</label>
              <input
                type="text"
                name="ctaText"
                className="admin-form-input"
                defaultValue={initialData?.ctaText ?? "Jelajahi Produk"}
              />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">CTA Button 1 - Link</label>
              <input
                type="text"
                name="ctaLink"
                className="admin-form-input"
                defaultValue={initialData?.ctaLink ?? "/produk"}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">CTA Button 2 - Teks</label>
              <input
                type="text"
                name="ctaText2"
                className="admin-form-input"
                defaultValue={initialData?.ctaText2 ?? "Cek Manfaat Suplemen"}
              />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">CTA Button 2 - Link</label>
              <input
                type="text"
                name="ctaLink2"
                className="admin-form-input"
                defaultValue={initialData?.ctaLink2 ?? "/artikel"}
              />
            </div>
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
            <label className="admin-form-label">Grup Slide</label>
            <select
              name="groupId"
              className="admin-form-input"
              defaultValue={initialData?.groupId ?? ""}
            >
              <option value="">— Tanpa Grup —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <p className="admin-form-hint">Pilih grup untuk mengelompokkan slide</p>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" style={{ marginBottom: 8, display: "block" }}>
              Status
            </label>
            <input type="hidden" name="active" value={active ? "on" : ""} />
            <button
              type="button"
              onClick={() => setActive(!active)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: `1.5px solid ${active ? "var(--admin-primary, #16a34a)" : "var(--admin-border, #e5e7eb)"}`,
                background: active ? "var(--admin-success-bg, #f0fdf4)" : "var(--admin-bg-secondary, #f9fafb)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: active ? "var(--admin-primary, #16a34a)" : "#d1d5db",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: active ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                  }}
                />
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: active ? "var(--admin-primary, #16a34a)" : "var(--admin-text-muted, #6b7280)" }}>
                {active ? "Aktif" : "Nonaktif"}
              </span>
            </button>
            <p className="admin-form-hint">
              {active ? "Slide ini ditampilkan di homepage" : "Slide ini disembunyikan dari homepage"}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-ghost" onClick={() => router.push(backHref)}>
          Batal
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
          {submitting ? "Menyimpan..." : initialData?.id ? "Update Slide" : "Buat Slide"}
        </button>
      </div>
    </form>
  );
}
