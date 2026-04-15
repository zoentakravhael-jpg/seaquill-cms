"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../actions";

interface ProductOption {
  id: number;
  name: string;
}

interface Props {
  settings: Record<string, string>;
  products: ProductOption[];
}

const tabs = [
  { key: "general", label: "General", icon: "fas fa-cog" },
  { key: "fields", label: "Form Fields", icon: "fas fa-list-alt" },
  { key: "appearance", label: "Appearance", icon: "fas fa-palette" },
  { key: "success", label: "Success Message", icon: "fas fa-check-circle" },
];

interface FieldConfig {
  visible: boolean;
  required: boolean;
  label: string;
  placeholder: string;
}

interface PopupConfig {
  enabled: boolean;
  headerTitle: string;
  headerSubtitle: string;
  headerIcon: string;
  buttonText: string;
  buttonIcon: string;
  gradientFrom: string;
  gradientTo: string;
  buttonGradientFrom: string;
  buttonGradientTo: string;
  fields: {
    name: FieldConfig;
    email: FieldConfig;
    phone: FieldConfig;
    product: FieldConfig;
    message: FieldConfig;
  };
  productSource: "auto" | "manual";
  manualProducts: string[];
  successTitle: string;
  successMessage: string;
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

const DEFAULT_CONFIG: PopupConfig = {
  enabled: true,
  headerTitle: "Connect To Us",
  headerSubtitle: "Isi form berikut & tim kami akan segera menghubungi Anda",
  headerIcon: "fa-solid fa-paper-plane",
  buttonText: "Connect To Us",
  buttonIcon: "fa-solid fa-envelope",
  gradientFrom: "#d97706",
  gradientTo: "#f59e0b",
  buttonGradientFrom: "#d97706",
  buttonGradientTo: "#ea8b12",
  fields: {
    name: { visible: true, required: true, label: "Nama", placeholder: "Nama lengkap Anda" },
    email: { visible: true, required: true, label: "Email", placeholder: "email@contoh.com" },
    phone: { visible: true, required: false, label: "Nomor HP", placeholder: "+62 8xx-xxxx-xxxx" },
    product: { visible: true, required: false, label: "Produk Terkait", placeholder: "Pilih produk (opsional)" },
    message: { visible: true, required: true, label: "Pesan", placeholder: "Tuliskan pertanyaan atau kebutuhan Anda..." },
  },
  productSource: "auto",
  manualProducts: [],
  successTitle: "Pesan Terkirim!",
  successMessage: "Terima kasih! Kami akan menghubungi Anda segera.",
};

export default function PopupFormClient({ settings, products }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [config, setConfig] = useState<PopupConfig>(
    parseJSON(settings.popup_connect_form, DEFAULT_CONFIG)
  );

  function updateField(fieldKey: keyof PopupConfig["fields"], prop: keyof FieldConfig, val: string | boolean) {
    setConfig((p) => ({
      ...p,
      fields: {
        ...p.fields,
        [fieldKey]: { ...p.fields[fieldKey], [prop]: val },
      },
    }));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("popup_connect_form", JSON.stringify(config));
      const result = await updateLayoutSettings(
        ["popup_connect_form"],
        formData,
        "/admin/popup-form"
      );
      if (result.success) { toast.success("Berhasil disimpan"); router.refresh(); }
      else toast.error(result.error || "Gagal menyimpan");
    } catch { toast.error("Gagal menyimpan"); }
    finally { setSubmitting(false); }
  }

  const saveBtn = (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
      <button type="button" onClick={handleSave} disabled={submitting} className="admin-btn admin-btn-primary">
        <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );

  const fieldKeys: (keyof PopupConfig["fields"])[] = ["name", "email", "phone", "product", "message"];
  const fieldLabels: Record<string, string> = { name: "Nama", email: "Email", phone: "Nomor HP", product: "Produk Terkait", message: "Pesan" };

  return (
    <LayoutPageEditor
      pageTitle="Pop Up Form"
      pageSubtitle="Kelola modal popup Connect To Us di header"
      pageIcon="fas fa-window-restore"
      pageIconBg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "general" && (
            <>
              <LayoutSection
                title="Konfigurasi Umum"
                icon="fas fa-cog"
                iconColor="#6366F1"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Atur judul, subtitle, dan tombol popup Connect To Us."
              >
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12, position: "relative",
                      background: config.enabled ? "#22c55e" : "#cbd5e1",
                      transition: "background 0.2s", cursor: "pointer",
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", background: "#fff",
                        position: "absolute", top: 2,
                        left: config.enabled ? 22 : 2,
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                    <input type="checkbox" checked={config.enabled} onChange={(e) => setConfig((p) => ({ ...p, enabled: e.target.checked }))} style={{ display: "none" }} />
                    <span className="admin-form-label" style={{ margin: 0 }}>
                      Pop Up Form {config.enabled ? "Aktif" : "Nonaktif"}
                    </span>
                  </label>
                  <small style={{ color: "#94a3b8", fontSize: 12, marginTop: 4, display: "block" }}>
                    Jika nonaktif, tombol &quot;Connect To Us&quot; tidak akan ditampilkan di header.
                  </small>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Judul Header Modal</label>
                  <input className="admin-form-input" value={config.headerTitle} onChange={(e) => setConfig((p) => ({ ...p, headerTitle: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Subtitle Header Modal</label>
                  <input className="admin-form-input" value={config.headerSubtitle} onChange={(e) => setConfig((p) => ({ ...p, headerSubtitle: e.target.value }))} />
                </div>
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Icon Header (FontAwesome class)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className={config.headerIcon} style={{ fontSize: 16, color: "#64748b" }}></i>
                      </div>
                      <input className="admin-form-input" value={config.headerIcon} onChange={(e) => setConfig((p) => ({ ...p, headerIcon: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Icon Tombol (FontAwesome class)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className={config.buttonIcon} style={{ fontSize: 16, color: "#64748b" }}></i>
                      </div>
                      <input className="admin-form-input" value={config.buttonIcon} onChange={(e) => setConfig((p) => ({ ...p, buttonIcon: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Teks Tombol</label>
                  <input className="admin-form-input" value={config.buttonText} onChange={(e) => setConfig((p) => ({ ...p, buttonText: e.target.value }))} />
                </div>
              </LayoutSection>

              <LayoutSection
                title="Sumber Produk"
                icon="fas fa-box-open"
                iconColor="#F59E0B"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Pilih sumber dropdown produk di form: otomatis dari database atau daftar manual."
              >
                <div className="admin-form-group">
                  <label className="admin-form-label">Sumber Data Produk</label>
                  <select className="admin-form-input" value={config.productSource} onChange={(e) => setConfig((p) => ({ ...p, productSource: e.target.value as "auto" | "manual" }))}>
                    <option value="auto">Otomatis dari Database ({products.length} produk)</option>
                    <option value="manual">Daftar Manual</option>
                  </select>
                </div>
                {config.productSource === "manual" && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Daftar Produk (satu per baris)</label>
                    <textarea
                      className="admin-form-textarea"
                      value={config.manualProducts.join("\n")}
                      onChange={(e) => setConfig((p) => ({ ...p, manualProducts: e.target.value.split("\n").filter((l) => l.trim()) }))}
                      style={{ minHeight: 120 }}
                      placeholder="Sea-Quill Omega 3&#10;Sea-Quill Vitamin C&#10;Sea-Quill Glucosamine"
                    />
                    <small style={{ color: "#94a3b8", fontSize: 12, marginTop: 4, display: "block" }}>
                      Tulis satu nama produk per baris
                    </small>
                  </div>
                )}
                {config.productSource === "auto" && products.length > 0 && (
                  <div style={{ marginTop: 8, padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0, marginBottom: 6, fontWeight: 600 }}>Produk terdaftar ({products.length}):</p>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, maxHeight: 120, overflowY: "auto" }}>
                      {products.map((p) => p.name).join(" · ")}
                    </div>
                  </div>
                )}
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "fields" && (
            <>
              <LayoutSection
                title="Konfigurasi Field Form"
                icon="fas fa-list-alt"
                iconColor="#3B82F6"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Atur visibility, required status, label, dan placeholder setiap field."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {fieldKeys.map((key) => {
                    const field = config.fields[key];
                    return (
                      <div key={key} className="admin-card" style={{ marginBottom: 0, opacity: field.visible ? 1 : 0.6 }}>
                        <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="admin-card-title">
                            <i className={key === "name" ? "fas fa-user" : key === "email" ? "fas fa-envelope" : key === "phone" ? "fas fa-phone" : key === "product" ? "fas fa-box" : "fas fa-comment-alt"} style={{ marginRight: 8, color: "#64748b" }}></i>
                            {fieldLabels[key]}
                            {field.required && <span style={{ color: "#ea8b12", marginLeft: 4 }}>*</span>}
                            {!field.visible && <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>(hidden)</span>}
                          </span>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12, color: "#64748b" }}>
                              <input type="checkbox" checked={field.required} onChange={(e) => updateField(key, "required", e.target.checked)} />
                              Required
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12, color: "#64748b" }}>
                              <input type="checkbox" checked={field.visible} onChange={(e) => updateField(key, "visible", e.target.checked)} />
                              Visible
                            </label>
                          </div>
                        </div>
                        <div className="admin-card-body">
                          <div className="admin-form-grid admin-form-grid-2">
                            <div className="admin-form-group">
                              <label className="admin-form-label">Label</label>
                              <input className="admin-form-input" value={field.label} onChange={(e) => updateField(key, "label", e.target.value)} />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-form-label">Placeholder</label>
                              <input className="admin-form-input" value={field.placeholder} onChange={(e) => updateField(key, "placeholder", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <LayoutSection
                title="Warna & Gradient"
                icon="fas fa-palette"
                iconColor="#EC4899"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Atur warna gradient header modal dan tombol submit."
              >
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>Header Modal Gradient</h4>
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 20 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warna Awal</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="color" value={config.gradientFrom} onChange={(e) => setConfig((p) => ({ ...p, gradientFrom: e.target.value }))} style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                      <input className="admin-form-input" value={config.gradientFrom} onChange={(e) => setConfig((p) => ({ ...p, gradientFrom: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warna Akhir</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="color" value={config.gradientTo} onChange={(e) => setConfig((p) => ({ ...p, gradientTo: e.target.value }))} style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                      <input className="admin-form-input" value={config.gradientTo} onChange={(e) => setConfig((p) => ({ ...p, gradientTo: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                {/* Preview header */}
                <div style={{ background: `linear-gradient(135deg, ${config.gradientFrom} 0%, ${config.gradientTo} 100%)`, borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: "rgba(255,255,255,0.22)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={config.headerIcon} style={{ color: "#fff", fontSize: 16 }}></i>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>{config.headerTitle}</p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 }}>{config.headerSubtitle}</p>
                    </div>
                  </div>
                </div>

                <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>Tombol Submit Gradient</h4>
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warna Awal</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="color" value={config.buttonGradientFrom} onChange={(e) => setConfig((p) => ({ ...p, buttonGradientFrom: e.target.value }))} style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                      <input className="admin-form-input" value={config.buttonGradientFrom} onChange={(e) => setConfig((p) => ({ ...p, buttonGradientFrom: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warna Akhir</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="color" value={config.buttonGradientTo} onChange={(e) => setConfig((p) => ({ ...p, buttonGradientTo: e.target.value }))} style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                      <input className="admin-form-input" value={config.buttonGradientTo} onChange={(e) => setConfig((p) => ({ ...p, buttonGradientTo: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                {/* Preview button */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{
                    padding: "12px 24px",
                    background: `linear-gradient(135deg, ${config.buttonGradientFrom}, ${config.buttonGradientTo})`,
                    color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 14px rgba(234,139,18,0.4)",
                  }}>
                    <i className={config.headerIcon}></i>
                    Kirim Pesan
                  </div>
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "success" && (
            <>
              <LayoutSection
                title="Pesan Sukses"
                icon="fas fa-check-circle"
                iconColor="#22C55E"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Pesan yang ditampilkan setelah form berhasil dikirim."
              >
                <div className="admin-form-group">
                  <label className="admin-form-label">Judul Sukses</label>
                  <input className="admin-form-input" value={config.successTitle} onChange={(e) => setConfig((p) => ({ ...p, successTitle: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Pesan Sukses</label>
                  <textarea className="admin-form-textarea" value={config.successMessage} onChange={(e) => setConfig((p) => ({ ...p, successMessage: e.target.value }))} style={{ minHeight: 80 }} />
                </div>

                {/* Preview */}
                <div style={{ marginTop: 16, padding: "24px 20px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Preview</p>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                    boxShadow: "0 6px 20px rgba(34,197,94,0.35)",
                  }}>
                    <i className="fa-solid fa-check" style={{ fontSize: 22, color: "#fff" }}></i>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 6px", color: "#1a1a1a" }}>{config.successTitle}</p>
                  <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>{config.successMessage}</p>
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}
        </>
      )}
    </LayoutPageEditor>
  );
}
