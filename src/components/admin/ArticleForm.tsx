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

interface ArticleData {
  id?: number;
  title: string;
  slug: string;
  categoryId: number;
  author: string;
  image: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

interface ArticleFormProps {
  categories: Category[];
  initialData?: ArticleData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
}

export default function ArticleForm({
  categories,
  initialData,
  action,
  backHref,
}: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!(formData.get("title") as string)?.trim()) errs.title = "Judul wajib diisi";
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
        toast.success(initialData ? "Artikel berhasil diperbarui" : "Artikel berhasil ditambahkan");
        router.push(result.redirect);
      } else {
        toast.error(result.error);
        setSubmitting(false);
      }
    } catch {
      toast.error("Gagal menyimpan artikel");
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {/* Title & Slug */}
      <div className="admin-form-grid admin-form-grid-2">
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
            placeholder="Judul artikel"
          />
          {errors.title && <p className="admin-form-error">{errors.title}</p>}
        </div>
        <SlugInput sourceValue={title} value={slug} onChange={(v) => { setSlug(v); setErrors(prev => { const { slug: _, ...rest } = prev; return rest; }); }} error={errors.slug} />
      </div>

      {/* Category, Author & Status */}
      <div className="admin-form-grid admin-form-grid-3">
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
          <label className="admin-form-label">Penulis</label>
          <input
            name="author"
            defaultValue={initialData?.author ?? ""}
            className="admin-form-input"
            placeholder="Nama penulis"
          />
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
        label="Gambar Artikel"
        hint="Upload gambar header artikel"
      />

      {/* Excerpt */}
      <div className="admin-form-group">
        <label className="admin-form-label">Ringkasan</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initialData?.excerpt ?? ""}
          className="admin-form-textarea"
          placeholder="Ringkasan singkat artikel untuk preview"
        />
      </div>

      {/* Content - Rich Text Editor */}
      <div className="admin-form-group">
        <label className="admin-form-label">Konten</label>
        <RichTextEditor
          name="content"
          value={content}
          onChange={setContent}
          placeholder="Tulis konten artikel..."
        />
      </div>

      {/* Tags */}
      <div className="admin-form-group">
        <label className="admin-form-label">Tags</label>
        <input
          name="tags"
          defaultValue={initialData?.tags?.join(", ") ?? ""}
          className="admin-form-input"
          placeholder="kesehatan, vitamin, tips"
        />
        <p className="admin-form-hint">Pisahkan dengan koma</p>
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
            placeholder="Judul untuk mesin pencari (kosong = gunakan judul artikel)"
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
            placeholder="Deskripsi untuk mesin pencari (kosong = gunakan ringkasan)"
          />
          <p className="admin-form-hint">Rekomendasi: 150-160 karakter</p>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">OG Image URL</label>
          <input
            name="ogImage"
            defaultValue={initialData?.ogImage ?? ""}
            className="admin-form-input"
            placeholder="URL gambar untuk social media sharing (kosong = gunakan gambar artikel)"
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
          title={title}
          image={image}
          content={content}
          author={initialData?.author}
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
