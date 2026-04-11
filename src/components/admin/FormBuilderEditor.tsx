"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FormField,
  FormSettings,
  FieldType,
  createDefaultField,
  defaultFormSettings,
} from "@/types/form-builder";
import FormPreview from "@/components/admin/FormPreview";

interface Props {
  initialData?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    fields: string;
    settings: string;
    status: string;
  };
}

const fieldTypes: { value: FieldType; label: string; icon: string }[] = [
  { value: "text", label: "Text", icon: "fas fa-font" },
  { value: "email", label: "Email", icon: "fas fa-envelope" },
  { value: "tel", label: "Telepon", icon: "fas fa-phone" },
  { value: "number", label: "Angka", icon: "fas fa-hashtag" },
  { value: "textarea", label: "Textarea", icon: "fas fa-align-left" },
  { value: "select", label: "Dropdown", icon: "fas fa-chevron-down" },
  { value: "radio", label: "Radio", icon: "fas fa-dot-circle" },
  { value: "checkbox", label: "Checkbox", icon: "fas fa-check-square" },
  { value: "date", label: "Tanggal", icon: "fas fa-calendar" },
  { value: "url", label: "URL", icon: "fas fa-link" },
  { value: "hidden", label: "Hidden", icon: "fas fa-eye-slash" },
];

type Tab = "fields" | "settings" | "preview";

export default function FormBuilderEditor({ initialData }: Props) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "published");
  const [fields, setFields] = useState<FormField[]>(() => {
    if (initialData?.fields) {
      try { return JSON.parse(initialData.fields); } catch { return []; }
    }
    return [];
  });
  const [settings, setSettings] = useState<FormSettings>(() => {
    if (initialData?.settings) {
      try { return { ...defaultFormSettings, ...JSON.parse(initialData.settings) }; } catch { return defaultFormSettings; }
    }
    return defaultFormSettings;
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("fields");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Auto-generate slug from name
  const handleNameChange = useCallback((val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [isEditing, slug]);

  // Auto-generate field name from label
  function handleFieldLabelChange(idx: number, val: string) {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== idx) return f;
        const autoName = val.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");
        return { ...f, label: val, name: f.name || autoName };
      })
    );
  }

  function updateField(idx: number, updates: Partial<FormField>) {
    setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, ...updates } : f)));
  }

  function removeField(idx: number) {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  }

  function addField() {
    setFields((prev) => [...prev, createDefaultField()]);
  }

  function duplicateField(idx: number) {
    setFields((prev) => {
      const newF = { ...prev[idx], id: crypto.randomUUID() };
      const arr = [...prev];
      arr.splice(idx + 1, 0, newF);
      return arr;
    });
  }

  function moveField(from: number, to: number) {
    setFields((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  // Simple drag and drop
  function handleDragStart(idx: number) { setDragIdx(idx); }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) {
      moveField(dragIdx, idx);
      setDragIdx(idx);
    }
  }
  function handleDragEnd() { setDragIdx(null); }

  async function handleSave() {
    if (!name.trim()) { toast.error("Nama form wajib diisi"); return; }
    if (!slug.trim()) { toast.error("Slug wajib diisi"); return; }
    if (fields.length === 0) { toast.error("Tambahkan minimal 1 field"); return; }

    // Validate fields
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].name) { toast.error(`Field #${i + 1}: Name wajib diisi`); return; }
      if (!fields[i].label && fields[i].type !== "hidden") { toast.error(`Field #${i + 1}: Label wajib diisi`); return; }
    }

    setSubmitting(true);
    try {
      const url = isEditing ? `/api/admin/forms/${initialData.id}` : "/api/admin/forms";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, fields, settings, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast.success(isEditing ? "Form berhasil diupdate" : "Form berhasil dibuat");
      router.push("/admin/form-builder");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "fields", label: "Fields", icon: "fas fa-list" },
    { key: "settings", label: "Settings", icon: "fas fa-cog" },
    { key: "preview", label: "Preview", icon: "fas fa-eye" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <i className="fas fa-wpforms" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
            {isEditing ? "Edit Form" : "Buat Form Baru"}
          </h1>
          <p className="admin-page-subtitle">
            {isEditing ? `Mengedit: ${initialData.name}` : "Desain form kustom dengan drag & drop"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => router.push("/admin/form-builder")} className="admin-btn admin-btn-secondary">
            <i className="fas fa-arrow-left"></i> Kembali
          </button>
          <button onClick={handleSave} disabled={submitting} className="admin-btn admin-btn-primary">
            <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Form Info */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-body" style={{ padding: 20 }}>
          <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 12 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Nama Form *</label>
              <input className="admin-form-input" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Contoh: Form Kontak Utama" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Slug *</label>
              <input className="admin-form-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="form-kontak-utama" />
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Deskripsi</label>
              <input className="admin-form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat form ini" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select className="admin-form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "2px solid #E2E8F0", paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`admin-btn ${activeTab === tab.key ? "admin-btn-primary" : "admin-btn-ghost"}`}
            style={{
              borderRadius: "8px 8px 0 0",
              borderBottom: activeTab === tab.key ? "2px solid #8B5CF6" : "2px solid transparent",
              marginBottom: -2,
            }}
          >
            <i className={tab.icon}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Fields Tab */}
      {activeTab === "fields" && (
        <div>
          {fields.length === 0 ? (
            <div className="admin-card" style={{ textAlign: "center", padding: "40px 24px" }}>
              <i className="fas fa-plus-circle" style={{ fontSize: 40, color: "#CBD5E1", marginBottom: 12, display: "block" }}></i>
              <p style={{ color: "#94A3B8", marginBottom: 16 }}>Belum ada field. Tambahkan field pertama.</p>
              <button onClick={addField} className="admin-btn admin-btn-primary">
                <i className="fas fa-plus"></i> Tambah Field
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="admin-card"
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{
                    marginBottom: 0,
                    cursor: "grab",
                    opacity: dragIdx === idx ? 0.5 : 1,
                    border: dragIdx === idx ? "2px dashed #8B5CF6" : undefined,
                  }}
                >
                  <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="fas fa-grip-vertical" style={{ color: "#CBD5E1", cursor: "grab" }}></i>
                      <span className="admin-card-title" style={{ fontSize: 14 }}>
                        {field.label || `Field #${idx + 1}`}
                      </span>
                      <span className="admin-badge" style={{ background: "#F1F5F9", color: "#64748B", fontSize: 11 }}>
                        {fieldTypes.find((t) => t.value === field.type)?.label || field.type}
                      </span>
                      {field.required && (
                        <span className="admin-badge" style={{ background: "#FEE2E2", color: "#DC2626", fontSize: 11 }}>Required</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => moveField(idx, Math.max(0, idx - 1))} disabled={idx === 0} className="admin-btn admin-btn-ghost admin-btn-sm" title="Move Up">
                        <i className="fas fa-arrow-up"></i>
                      </button>
                      <button onClick={() => moveField(idx, Math.min(fields.length - 1, idx + 1))} disabled={idx === fields.length - 1} className="admin-btn admin-btn-ghost admin-btn-sm" title="Move Down">
                        <i className="fas fa-arrow-down"></i>
                      </button>
                      <button onClick={() => duplicateField(idx)} className="admin-btn admin-btn-ghost admin-btn-sm" title="Duplicate">
                        <i className="fas fa-copy"></i>
                      </button>
                      <button onClick={() => removeField(idx)} className="admin-btn admin-btn-danger admin-btn-sm" title="Hapus">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="admin-card-body" style={{ padding: 16 }}>
                    <div className="admin-form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>Label *</label>
                        <input className="admin-form-input" value={field.label} onChange={(e) => handleFieldLabelChange(idx, e.target.value)} placeholder="Nama Lengkap" />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>Name (key) *</label>
                        <input className="admin-form-input" value={field.name} onChange={(e) => updateField(idx, { name: e.target.value })} placeholder="nama_lengkap" />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>Tipe</label>
                        <select className="admin-form-input" value={field.type} onChange={(e) => updateField(idx, { type: e.target.value as FieldType })}>
                          {fieldTypes.map((ft) => (
                            <option key={ft.value} value={ft.value}>{ft.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>Placeholder</label>
                        <input className="admin-form-input" value={field.placeholder} onChange={(e) => updateField(idx, { placeholder: e.target.value })} placeholder="Masukkan nama Anda..." />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>Lebar</label>
                        <select className="admin-form-input" value={field.width} onChange={(e) => updateField(idx, { width: e.target.value as "full" | "half" })}>
                          <option value="full">Full Width (100%)</option>
                          <option value="half">Half Width (50%)</option>
                        </select>
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>Icon</label>
                        <input className="admin-form-input" value={field.icon} onChange={(e) => updateField(idx, { icon: e.target.value })} placeholder="fal fa-user" />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          className="admin-form-checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(idx, { required: e.target.checked })}
                        />
                        Wajib diisi
                      </label>
                    </div>

                    {/* Options for select/radio/checkbox */}
                    {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                      <div style={{ marginTop: 12 }}>
                        <label className="admin-form-label" style={{ fontSize: 12 }}>
                          Pilihan (satu per baris)
                        </label>
                        <textarea
                          className="admin-form-textarea"
                          value={field.options.join("\n")}
                          onChange={(e) => updateField(idx, { options: e.target.value.split("\n") })}
                          placeholder={"Pilihan 1\nPilihan 2\nPilihan 3"}
                          style={{ minHeight: 80 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button onClick={addField} className="admin-btn admin-btn-secondary" style={{ alignSelf: "flex-start" }}>
                <i className="fas fa-plus"></i> Tambah Field
              </button>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Submit Settings */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="admin-card-header">
              <span className="admin-card-title"><i className="fas fa-paper-plane" style={{ color: "#8B5CF6" }}></i> Pengaturan Submit</span>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-group">
                <label className="admin-form-label">Teks Tombol Submit</label>
                <input className="admin-form-input" value={settings.submitText} onChange={(e) => setSettings((s) => ({ ...s, submitText: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Pesan Sukses</label>
                <textarea className="admin-form-textarea" value={settings.successMessage} onChange={(e) => setSettings((s) => ({ ...s, successMessage: e.target.value }))} style={{ minHeight: 60 }} />
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="admin-card-header">
              <span className="admin-card-title"><i className="fas fa-envelope" style={{ color: "#3B82F6" }}></i> Notifikasi Email</span>
            </div>
            <div className="admin-card-body">
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  className="admin-form-checkbox"
                  checked={settings.emailNotification.enabled}
                  onChange={(e) => setSettings((s) => ({ ...s, emailNotification: { ...s.emailNotification, enabled: e.target.checked } }))}
                />
                <span style={{ fontSize: 14 }}>Aktifkan notifikasi email</span>
              </label>
              {settings.emailNotification.enabled && (
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Tujuan</label>
                    <input className="admin-form-input" value={settings.emailNotification.to} onChange={(e) => setSettings((s) => ({ ...s, emailNotification: { ...s.emailNotification, to: e.target.value } }))} placeholder="admin@seaquill.com" />
                    <small style={{ color: "#94A3B8", fontSize: 12 }}>Pisahkan dengan koma untuk multiple email</small>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Subject Email</label>
                    <input className="admin-form-input" value={settings.emailNotification.subject} onChange={(e) => setSettings((s) => ({ ...s, emailNotification: { ...s.emailNotification, subject: e.target.value } }))} />
                  </div>
                </div>
              )}
              {settings.emailNotification.enabled && (
                <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: 12, marginTop: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#9A3412" }}>
                    <i className="fas fa-info-circle"></i> Set environment variable <strong>SMTP_URL</strong> dan <strong>SMTP_FROM</strong> untuk mengaktifkan pengiriman email.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Notification */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="admin-card-header">
              <span className="admin-card-title"><i className="fab fa-whatsapp" style={{ color: "#25D366" }}></i> Notifikasi WhatsApp</span>
            </div>
            <div className="admin-card-body">
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  className="admin-form-checkbox"
                  checked={settings.whatsappNotification.enabled}
                  onChange={(e) => setSettings((s) => ({ ...s, whatsappNotification: { ...s.whatsappNotification, enabled: e.target.checked } }))}
                />
                <span style={{ fontSize: 14 }}>Aktifkan notifikasi WhatsApp</span>
              </label>
              {settings.whatsappNotification.enabled && (
                <>
                  <div className="admin-form-grid admin-form-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Nomor WhatsApp</label>
                      <input className="admin-form-input" value={settings.whatsappNotification.phone} onChange={(e) => setSettings((s) => ({ ...s, whatsappNotification: { ...s.whatsappNotification, phone: e.target.value } }))} placeholder="6281234567890" />
                      <small style={{ color: "#94A3B8", fontSize: 12 }}>Format: 62xxxxxxxxxx (tanpa +)</small>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Template Pesan</label>
                    <textarea
                      className="admin-form-textarea"
                      value={settings.whatsappNotification.message}
                      onChange={(e) => setSettings((s) => ({ ...s, whatsappNotification: { ...s.whatsappNotification, message: e.target.value } }))}
                      style={{ minHeight: 80 }}
                    />
                    <small style={{ color: "#94A3B8", fontSize: 12 }}>
                      Gunakan {"{{nama_field}}"} untuk menyisipkan nilai field. Contoh: {"{{name}}"}, {"{{email}}"}, {"{{message}}"}
                    </small>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <FormPreview fields={fields} settings={settings} />
      )}
    </div>
  );
}
