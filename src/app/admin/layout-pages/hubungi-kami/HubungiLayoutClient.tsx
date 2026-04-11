"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface FormOption {
  id: number;
  name: string;
  slug: string;
  status: string;
}

interface Props {
  settings: Record<string, string>;
  forms: FormOption[];
}

const tabs = [
  { key: "social", label: "Social Media", icon: "fas fa-share-alt" },
  { key: "marketplace", label: "Marketplace", icon: "fas fa-shopping-cart" },
  { key: "contact", label: "Form Kontak", icon: "fas fa-envelope" },
];

interface SocialMediaItem {
  platform: string;
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface MarketplaceItem {
  platform: string;
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface SocialSection {
  subTitle: string;
  heading: string;
  items: SocialMediaItem[];
}

interface MarketplaceSection {
  subTitle: string;
  heading: string;
  items: MarketplaceItem[];
}

interface ContactSection {
  subTitle: string;
  heading: string;
  paragraph: string;
  formSlug: string;
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function HubungiLayoutClient({ settings, forms }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [social, setSocial] = useState<SocialSection>(
    parseJSON(settings.hubungi_social_section, {
      subTitle: "Platform Sosial Media Kami",
      heading: "Temukan dan Ikuti Sea-Quill",
      items: [
        { platform: "Instagram", icon: "/assets/img/icon/instagram.png", title: "", description: "", link: "" },
        { platform: "Facebook", icon: "/assets/img/icon/facebook.png", title: "", description: "", link: "" },
        { platform: "TikTok", icon: "/assets/img/icon/tiktok.png", title: "", description: "", link: "" },
      ],
    })
  );

  const [marketplace, setMarketplace] = useState<MarketplaceSection>(
    parseJSON(settings.hubungi_marketplace_section, {
      subTitle: "Marketplace Kami",
      heading: "Belanja Suplemen dengan Mudah & Aman",
      items: [
        { platform: "Tokopedia", icon: "/assets/img/icon/tokopedia.png", title: "", description: "", link: "" },
        { platform: "Shopee", icon: "/assets/img/icon/shopee.png", title: "", description: "", link: "" },
        { platform: "Lazada", icon: "/assets/img/icon/lazada.png", title: "", description: "", link: "" },
        { platform: "TikTok Shop", icon: "/assets/img/icon/tiktokshop.png", title: "", description: "", link: "" },
      ],
    })
  );

  const [contact, setContact] = useState<ContactSection>(
    parseJSON(settings.hubungi_contact_section, {
      subTitle: "Hubungi Kami",
      heading: "Kirim Pesan untuk Sea-Quill",
      paragraph: "",
      formSlug: "",
    })
  );

  function updateSocialItem(idx: number, field: keyof SocialMediaItem, val: string) {
    setSocial((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  function updateMarketplaceItem(idx: number, field: keyof MarketplaceItem, val: string) {
    setMarketplace((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  const [uploading, setUploading] = useState<string | null>(null);
  const [mediaLibraryFor, setMediaLibraryFor] = useState<{ type: "social" | "marketplace"; idx: number } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleIconUpload = useCallback(async (file: File, type: "social" | "marketplace", idx: number) => {
    if (!file.type.startsWith("image/")) { toast.error("File harus berupa gambar"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Ukuran file maksimal 5MB"); return; }
    const key = `${type}_${idx}`;
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Upload gagal"); }
      const data = await res.json();
      if (type === "social") updateSocialItem(idx, "icon", data.url);
      else updateMarketplaceItem(idx, "icon", data.url);
      toast.success("Icon berhasil diupload");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Upload gagal"); }
    finally { setUploading(null); }
  }, []);

  function handleMediaSelect(url: string) {
    if (!mediaLibraryFor) return;
    if (mediaLibraryFor.type === "social") updateSocialItem(mediaLibraryFor.idx, "icon", url);
    else updateMarketplaceItem(mediaLibraryFor.idx, "icon", url);
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("hubungi_social_section", JSON.stringify(social));
      formData.set("hubungi_marketplace_section", JSON.stringify(marketplace));
      formData.set("hubungi_contact_section", JSON.stringify(contact));
      const result = await updateLayoutSettings(
        ["hubungi_social_section", "hubungi_marketplace_section", "hubungi_contact_section"],
        formData,
        "/admin/layout-pages/hubungi-kami"
      );
      if (result.success) { toast.success("Berhasil disimpan"); router.refresh(); }
      else toast.error(result.error);
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

  return (
    <>
    <LayoutPageEditor
      pageTitle="Hubungi Kami"
      pageSubtitle="Kelola konten halaman kontak"
      pageIcon="fas fa-phone-alt"
      pageIconBg="linear-gradient(135deg, #06B6D4, #0891B2)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "social" && (
            <>
              <LayoutSection
                title="Section Social Media"
                icon="fas fa-share-alt"
                iconColor="#E4405F"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Tab social media di halaman Hubungi Kami (Instagram, Facebook, TikTok)."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={social.subTitle} onChange={(e) => setSocial((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input className="admin-form-input" value={social.heading} onChange={(e) => setSocial((p) => ({ ...p, heading: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {social.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="admin-card-title">{item.platform}</span>
                        <button type="button" onClick={() => setSocial((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm"><i className="fas fa-trash"></i></button>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Platform</label>
                            <input className="admin-form-input" value={item.platform} onChange={(e) => updateSocialItem(idx, "platform", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Icon Path</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {item.icon && (
                                <div style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", flexShrink: 0 }}>
                                  <img src={item.icon} alt="icon" style={{ width: 24, height: 24, objectFit: "contain" }} />
                                </div>
                              )}
                              <input className="admin-form-input" value={item.icon} onChange={(e) => updateSocialItem(idx, "icon", e.target.value)} style={{ flex: 1 }} />
                              <input type="file" accept="image/*" ref={(el) => { fileInputRefs.current[`social_${idx}`] = el; }} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconUpload(f, "social", idx); e.target.value = ""; }} />
                              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => fileInputRefs.current[`social_${idx}`]?.click()} disabled={uploading === `social_${idx}`} style={{ whiteSpace: "nowrap" }}>
                                {uploading === `social_${idx}` ? <><i className="fas fa-spinner fa-spin"></i></> : <><i className="fas fa-upload"></i> Upload</>}
                              </button>
                              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setMediaLibraryFor({ type: "social", idx })} style={{ whiteSpace: "nowrap" }}>
                                <i className="fas fa-photo-video"></i> Library
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Judul</label>
                          <input className="admin-form-input" value={item.title} onChange={(e) => updateSocialItem(idx, "title", e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.description} onChange={(e) => updateSocialItem(idx, "description", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Link</label>
                          <input className="admin-form-input" value={item.link} onChange={(e) => updateSocialItem(idx, "link", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setSocial((p) => ({ ...p, items: [...p.items, { platform: "", icon: "", title: "", description: "", link: "" }] }))} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Platform
                </button>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "marketplace" && (
            <>
              <LayoutSection
                title="Section Marketplace"
                icon="fas fa-shopping-cart"
                iconColor="#10B981"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Tab marketplace di halaman Hubungi Kami (Tokopedia, Shopee, Lazada, TikTok Shop)."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={marketplace.subTitle} onChange={(e) => setMarketplace((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input className="admin-form-input" value={marketplace.heading} onChange={(e) => setMarketplace((p) => ({ ...p, heading: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {marketplace.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="admin-card-title">{item.platform}</span>
                        <button type="button" onClick={() => setMarketplace((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm"><i className="fas fa-trash"></i></button>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Platform</label>
                            <input className="admin-form-input" value={item.platform} onChange={(e) => updateMarketplaceItem(idx, "platform", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Icon Path</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {item.icon && (
                                <div style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", flexShrink: 0 }}>
                                  <img src={item.icon} alt="icon" style={{ width: 24, height: 24, objectFit: "contain" }} />
                                </div>
                              )}
                              <input className="admin-form-input" value={item.icon} onChange={(e) => updateMarketplaceItem(idx, "icon", e.target.value)} style={{ flex: 1 }} />
                              <input type="file" accept="image/*" ref={(el) => { fileInputRefs.current[`marketplace_${idx}`] = el; }} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconUpload(f, "marketplace", idx); e.target.value = ""; }} />
                              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => fileInputRefs.current[`marketplace_${idx}`]?.click()} disabled={uploading === `marketplace_${idx}`} style={{ whiteSpace: "nowrap" }}>
                                {uploading === `marketplace_${idx}` ? <><i className="fas fa-spinner fa-spin"></i></> : <><i className="fas fa-upload"></i> Upload</>}
                              </button>
                              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setMediaLibraryFor({ type: "marketplace", idx })} style={{ whiteSpace: "nowrap" }}>
                                <i className="fas fa-photo-video"></i> Library
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Judul</label>
                          <input className="admin-form-input" value={item.title} onChange={(e) => updateMarketplaceItem(idx, "title", e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.description} onChange={(e) => updateMarketplaceItem(idx, "description", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Link</label>
                          <input className="admin-form-input" value={item.link} onChange={(e) => updateMarketplaceItem(idx, "link", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setMarketplace((p) => ({ ...p, items: [...p.items, { platform: "", icon: "", title: "", description: "", link: "" }] }))} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Marketplace
                </button>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "contact" && (
            <>
              <LayoutSection
                title="Form Kontak"
                icon="fas fa-envelope"
                iconColor="#3B82F6"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Heading dan deskripsi di atas form kontak. Pilih form dari Form Builder atau gunakan form default."
              >
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={contact.subTitle} onChange={(e) => setContact((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input className="admin-form-input" value={contact.heading} onChange={(e) => setContact((p) => ({ ...p, heading: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Paragraf</label>
                  <textarea className="admin-form-textarea" value={contact.paragraph} onChange={(e) => setContact((p) => ({ ...p, paragraph: e.target.value }))} style={{ minHeight: 80 }} />
                </div>

                {/* Form Selector */}
                <div className="admin-form-group" style={{ marginTop: 16 }}>
                  <label className="admin-form-label">
                    <i className="fas fa-wpforms" style={{ marginRight: 6, color: "#8B5CF6" }}></i>
                    Pilih Form
                  </label>
                  <select
                    className="admin-form-input"
                    value={contact.formSlug || ""}
                    onChange={(e) => setContact((p) => ({ ...p, formSlug: e.target.value }))}
                  >
                    <option value="">Form Default (bawaan)</option>
                    {forms.map((f) => (
                      <option key={f.id} value={f.slug}>
                        {f.name} {f.status !== "published" ? `(${f.status})` : ""}
                      </option>
                    ))}
                  </select>
                  <small style={{ color: "#94A3B8", fontSize: 12, marginTop: 4, display: "block" }}>
                    Pilih form kustom dari Form Builder, atau kosongkan untuk menggunakan form kontak bawaan.
                    {contact.formSlug && (
                      <> Form terpilih: <strong>{contact.formSlug}</strong></>
                    )}
                  </small>
                </div>

                {contact.formSlug && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <a href={`/admin/form-builder/edit/${forms.find((f) => f.slug === contact.formSlug)?.id || ""}`} className="admin-btn admin-btn-secondary admin-btn-sm" target="_blank">
                      <i className="fas fa-edit"></i> Edit Form
                    </a>
                    <a href={`/admin/form-builder/preview/${forms.find((f) => f.slug === contact.formSlug)?.id || ""}`} className="admin-btn admin-btn-secondary admin-btn-sm" target="_blank">
                      <i className="fas fa-eye"></i> Preview
                    </a>
                    <a href={`/admin/form-builder/submissions/${forms.find((f) => f.slug === contact.formSlug)?.id || ""}`} className="admin-btn admin-btn-secondary admin-btn-sm" target="_blank">
                      <i className="fas fa-inbox"></i> Submissions
                    </a>
                  </div>
                )}
              </LayoutSection>
              {saveBtn}
            </>
          )}
        </>
      )}
    </LayoutPageEditor>

    {mediaLibraryFor && (
      <MediaLibraryModal
        open={true}
        onClose={() => setMediaLibraryFor(null)}
        onSelect={(url) => {
          handleMediaSelect(url);
          setMediaLibraryFor(null);
        }}
      />
    )}
    </>
  );
}
