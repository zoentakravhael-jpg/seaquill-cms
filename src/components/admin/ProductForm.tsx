"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SlugInput from "./SlugInput";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";
import ContentPreview from "./ContentPreview";
import type { ActionResult } from "@/app/admin/actions";

interface Category {
  id: number;
  title: string;
}

interface ProductData {
  id?: number;
  name: string;
  slug: string;
  categoryId: number;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  composition: string;
  dosage: string;
  sku: string;
  tags: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  sortOrder: number;
  stock: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
}

export default function ProductForm({
  categories,
  initialData,
  action,
  backHref,
}: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(formData.get("name") as string)?.trim()) errs.name = "Nama produk wajib diisi";
    if (!(formData.get("slug") as string)?.trim()) errs.slug = "Slug wajib diisi";
    if (!formData.get("categoryId") || formData.get("categoryId") === "") errs.categoryId = "Kategori wajib dipilih";
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
        toast.success(initialData ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan");
        router.push(result.redirect);
      } else {
        toast.error(result.error);
        setSubmitting(false);
      }
    } catch {
      toast.error("Gagal menyimpan produk");
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {/* Name & Slug */}
      <div className="admin-form-grid admin-form-grid-2">
        <div className={`admin-form-group${errors.name ? " has-error" : ""}`}>
          <label className="admin-form-label">
            Nama Produk <span className="required">*</span>
          </label>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors(prev => { const { name: _, ...rest } = prev; return rest; }); }}
            className="admin-form-input"
            placeholder="Nama produk"
          />
          {errors.name && <p className="admin-form-error">{errors.name}</p>}
        </div>
        <SlugInput sourceValue={name} value={slug} onChange={(v) => { setSlug(v); setErrors(prev => { const { slug: _, ...rest } = prev; return rest; }); }} error={errors.slug} />
      </div>

      {/* Category & Status */}
      <div className="admin-form-grid admin-form-grid-2">
        <div className={`admin-form-group${errors.categoryId ? " has-error" : ""}`}>
          <label className="admin-form-label">
            Kategori <span className="required">*</span>
          </label>
          <select
            name="categoryId"
            required
            defaultValue={initialData?.categoryId ?? ""}
            onChange={() => setErrors(prev => { const { categoryId: _, ...rest } = prev; return rest; })}
            className="admin-form-select"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="admin-form-error">{errors.categoryId}</p>}
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Status</label>
          <select
            name="status"
            defaultValue={initialData?.status ?? "draft"}
            className="admin-form-select"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload
        name="image"
        value={image}
        onChange={setImage}
        label="Gambar Utama"
        hint="Upload gambar produk utama"
      />

      {/* Additional images */}
      <div className="admin-form-group">
        <label className="admin-form-label">Gambar Lainnya</label>
        <textarea
          name="images"
          rows={3}
          defaultValue={initialData?.images?.join("\n") ?? ""}
          className="admin-form-textarea"
          placeholder="Satu URL per baris"
        />
        <p className="admin-form-hint">Masukkan URL gambar tambahan, satu per baris</p>
      </div>

      {/* Short Description */}
      <div className="admin-form-group">
        <label className="admin-form-label">Deskripsi Singkat</label>
        <textarea
          name="shortDescription"
          rows={2}
          defaultValue={initialData?.shortDescription ?? ""}
          className="admin-form-textarea"
          placeholder="Ringkasan singkat produk"
        />
      </div>

      {/* Full Description - Rich Text */}
      <div className="admin-form-group">
        <label className="admin-form-label">Deskripsi Lengkap</label>
        <RichTextEditor
          name="description"
          value={description}
          onChange={setDescription}
          placeholder="Tulis deskripsi lengkap produk..."
        />
      </div>

      {/* Composition & Dosage */}
      <div className="admin-form-grid admin-form-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Komposisi</label>
          <textarea
            name="composition"
            rows={3}
            defaultValue={initialData?.composition ?? ""}
            className="admin-form-textarea"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Dosis</label>
          <textarea
            name="dosage"
            rows={3}
            defaultValue={initialData?.dosage ?? ""}
            className="admin-form-textarea"
          />
        </div>
      </div>

      {/* SKU & Tags */}
      <div className="admin-form-grid admin-form-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">SKU</label>
          <input
            name="sku"
            defaultValue={initialData?.sku ?? ""}
            className="admin-form-input"
            placeholder="SKU produk"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Tags</label>
          <input
            name="tags"
            defaultValue={initialData?.tags?.join(", ") ?? ""}
            className="admin-form-input"
            placeholder="omega, jantung, kolesterol"
          />
          <p className="admin-form-hint">Pisahkan dengan koma</p>
        </div>
      </div>

      {/* Features */}
      <div className="admin-form-group">
        <label className="admin-form-label">Fitur Unggulan</label>
        <textarea
          name="features"
          rows={3}
          defaultValue={initialData?.features?.join("\n") ?? ""}
          className="admin-form-textarea"
          placeholder="Satu fitur per baris"
        />
        <p className="admin-form-hint">Satu fitur per baris</p>
      </div>

      {/* Rating, Review Count, Sort Order */}
      <div className="admin-form-grid admin-form-grid-3">
        <div className="admin-form-group">
          <label className="admin-form-label">Rating</label>
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={initialData?.rating ?? 5.0}
            className="admin-form-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Jumlah Review</label>
          <input
            name="reviewCount"
            type="number"
            defaultValue={initialData?.reviewCount ?? 0}
            className="admin-form-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Urutan</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={initialData?.sortOrder ?? 0}
            className="admin-form-input"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="admin-form-group">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          <label className="admin-form-checkbox">
            <input
              name="stock"
              type="checkbox"
              defaultChecked={initialData?.stock ?? true}
            />
            Stok Tersedia
          </label>
          <label className="admin-form-checkbox">
            <input
              name="isBestSeller"
              type="checkbox"
              defaultChecked={initialData?.isBestSeller ?? false}
            />
            Best Seller
          </label>
          <label className="admin-form-checkbox">
            <input
              name="isNew"
              type="checkbox"
              defaultChecked={initialData?.isNew ?? false}
            />
            Produk Baru
          </label>
        </div>
      </div>

      {/* SEO Fields */}
      <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: 20, marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--admin-text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fas fa-search" style={{ color: "var(--admin-primary)" }}></i> SEO Settings
        </h3>
        <div className="admin-form-group">
          <label className="admin-form-label">Meta Title</label>
          <input
            name="metaTitle"
            defaultValue={initialData?.metaTitle ?? ""}
            className="admin-form-input"
            placeholder="Judul untuk mesin pencari (kosong = gunakan nama produk)"
          />
          <p className="admin-form-hint">Rekomendasi: 50-60 karakter</p>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Meta Description</label>
          <textarea
            name="metaDescription"
            rows={2}
            defaultValue={initialData?.metaDescription ?? ""}
            className="admin-form-textarea"
            placeholder="Deskripsi untuk mesin pencari (kosong = gunakan deskripsi singkat)"
          />
          <p className="admin-form-hint">Rekomendasi: 150-160 karakter</p>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">OG Image URL</label>
          <input
            name="ogImage"
            defaultValue={initialData?.ogImage ?? ""}
            className="admin-form-input"
            placeholder="URL gambar untuk social media sharing (kosong = gunakan gambar utama)"
          />
        </div>
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
        <ContentPreview
          title={name}
          image={image}
          content={description}
        />
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
