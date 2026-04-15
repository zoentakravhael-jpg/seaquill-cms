"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface Props {
  settings: Record<string, string>;
}

const tabs = [
  { key: "marketplace", label: "Marketplace", icon: "fas fa-store" },
  { key: "social", label: "Social Media", icon: "fas fa-share-alt" },
  { key: "header", label: "Header & Footer", icon: "fas fa-heading" },
];

interface MarketplaceItem {
  name: string;
  logo: string;
  url: string;
  description: string;
  badge: string;
  badgeColor: string;
  bgColor: string;
  active: boolean;
}

interface SocialItem {
  name: string;
  logo: string;
  url: string;
  description: string;
  badge: string;
  badgeColor: string;
  iconBg: string;
  iconSize: number;
  active: boolean;
}

interface MarketplaceSection {
  heading: string;
  subTitle: string;
  items: MarketplaceItem[];
}

interface SocialSection {
  heading: string;
  subTitle: string;
  items: SocialItem[];
}

interface HeaderSection {
  title: string;
  subtitle: string;
  logo: string;
}

interface FooterLink {
  text: string;
  url: string;
  visible: boolean;
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

const DEFAULT_MARKETPLACE: MarketplaceSection = {
  heading: "Marketplace",
  subTitle: "Belanja produk Sea-Quill original",
  items: [
    { name: "Tokopedia", logo: "/assets/img/icon/tokopedia.svg", url: "https://www.tokopedia.com/seaquill", description: "Belanja produk Sea-Quill original dengan promo dan gratis ongkir.", badge: "Tokopedia Official", badgeColor: "#42b549", bgColor: "#f8fafc", active: true },
    { name: "Shopee", logo: "/assets/img/icon/shopee.svg", url: "https://shopee.co.id/seaquill", description: "Voucher cashback dan diskon eksklusif produk Sea-Quill.", badge: "Shopee Official Store", badgeColor: "#ee4d2d", bgColor: "#f8fafc", active: true },
    { name: "Lazada", logo: "/assets/img/icon/lazada.svg", url: "https://www.lazada.co.id/shop/seaquill", description: "Harga terbaik dan promo menarik produk Sea-Quill.", badge: "Lazada Official Store", badgeColor: "#0f146d", bgColor: "#f8fafc", active: true },
    { name: "TikTok Shop", logo: "/assets/img/icon/tiktok.svg", url: "https://www.tiktok.com/@seaquill.id", description: "Tonton konten edukatif dan langsung beli produk Sea-Quill.", badge: "TikTok Official", badgeColor: "#010101", bgColor: "#f8fafc", active: true },
  ],
};

const DEFAULT_SOCIAL: SocialSection = {
  heading: "Social Media",
  subTitle: "Follow & hubungi kami",
  items: [
    { name: "TikTok", logo: "/assets/img/icon/tiktok.svg", url: "https://www.tiktok.com/@seaquill.id", description: "Konten edukatif dan tips kesehatan dari Sea-Quill.", badge: "TikTok", badgeColor: "#010101", iconBg: "#f8fafc", iconSize: 34, active: true },
    { name: "Instagram", logo: "/assets/img/icon/instagram.svg", url: "https://www.instagram.com/seaquill.id", description: "Info produk, promo, dan konten inspiratif setiap hari.", badge: "Instagram", badgeColor: "#E1306C", iconBg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", iconSize: 24, active: true },
    { name: "WhatsApp", logo: "/assets/img/icon/wa.svg", url: "https://wa.me/6281234567890", description: "Hubungi kami langsung untuk konsultasi produk dan pemesanan.", badge: "WhatsApp", badgeColor: "#25D366", iconBg: "#f8fafc", iconSize: 34, active: true },
  ],
};

const DEFAULT_HEADER: HeaderSection = {
  title: "Belanja & Hubungi Sea-Quill",
  subtitle: "Pilih marketplace favorit atau hubungi kami melalui social media",
  logo: "",
};

const DEFAULT_FOOTER: FooterLink = {
  text: "Lihat semua produk di website",
  url: "/produk",
  visible: true,
};

export default function BelanjaLayoutClient({ settings }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [marketplace, setMarketplace] = useState<MarketplaceSection>(
    parseJSON(settings.belanja_marketplace_section, DEFAULT_MARKETPLACE)
  );

  const [social, setSocial] = useState<SocialSection>(
    parseJSON(settings.belanja_social_section, DEFAULT_SOCIAL)
  );

  const [header, setHeader] = useState<HeaderSection>(
    parseJSON(settings.belanja_header, DEFAULT_HEADER)
  );

  const [footerLink, setFooterLink] = useState<FooterLink>(
    parseJSON(settings.belanja_footer_link, DEFAULT_FOOTER)
  );

  // Icon upload
  const [uploading, setUploading] = useState<string | null>(null);
  const [mediaLibraryFor, setMediaLibraryFor] = useState<{ type: "marketplace" | "social" | "header"; idx: number } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateMarketplaceItem(idx: number, field: keyof MarketplaceItem, val: string | boolean) {
    setMarketplace((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  function updateSocialItem(idx: number, field: keyof SocialItem, val: string | boolean | number) {
    setSocial((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  const handleIconUpload = useCallback(async (file: File, type: "marketplace" | "social", idx: number) => {
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
      if (type === "marketplace") updateMarketplaceItem(idx, "logo", data.url);
      else updateSocialItem(idx, "logo", data.url);
      toast.success("Icon berhasil diupload");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Upload gagal"); }
    finally { setUploading(null); }
  }, []);

  function handleMediaSelect(url: string) {
    if (!mediaLibraryFor) return;
    if (mediaLibraryFor.type === "marketplace") updateMarketplaceItem(mediaLibraryFor.idx, "logo", url);
    else if (mediaLibraryFor.type === "social") updateSocialItem(mediaLibraryFor.idx, "logo", url);
    else setHeader((p) => ({ ...p, logo: url }));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("belanja_marketplace_section", JSON.stringify(marketplace));
      formData.set("belanja_social_section", JSON.stringify(social));
      formData.set("belanja_header", JSON.stringify(header));
      formData.set("belanja_footer_link", JSON.stringify(footerLink));
      const result = await updateLayoutSettings(
        ["belanja_marketplace_section", "belanja_social_section", "belanja_header", "belanja_footer_link"],
        formData,
        "/admin/layout-pages/belanja"
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

  function renderIconField(type: "marketplace" | "social", idx: number, value: string, onChange: (val: string) => void) {
    const key = `${type}_${idx}`;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {value && (
          <div style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", flexShrink: 0 }}>
            <img src={value} alt="icon" style={{ width: 24, height: 24, objectFit: "contain" }} />
          </div>
        )}
        <input className="admin-form-input" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1 }} />
        <input type="file" accept="image/*" ref={(el) => { fileInputRefs.current[key] = el; }} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconUpload(f, type, idx); e.target.value = ""; }} />
        <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => fileInputRefs.current[key]?.click()} disabled={uploading === key} style={{ whiteSpace: "nowrap" }}>
          {uploading === key ? <><i className="fas fa-spinner fa-spin"></i></> : <><i className="fas fa-upload"></i> Upload</>}
        </button>
        <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setMediaLibraryFor({ type, idx })} style={{ whiteSpace: "nowrap" }}>
          <i className="fas fa-photo-video"></i> Library
        </button>
      </div>
    );
  }

  return (
    <>
    <LayoutPageEditor
      pageTitle="Belanja"
      pageSubtitle="Kelola konten halaman belanja (marketplace & social media)"
      pageIcon="fas fa-shopping-bag"
      pageIconBg="linear-gradient(135deg, #F59E0B, #D97706)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "marketplace" && (
            <>
              <LayoutSection
                title="Marketplace Links"
                icon="fas fa-store"
                iconColor="#42b549"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Daftar marketplace yang ditampilkan di halaman Belanja. Atur nama, logo, URL, deskripsi, dan badge."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input className="admin-form-input" value={marketplace.heading} onChange={(e) => setMarketplace((p) => ({ ...p, heading: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={marketplace.subTitle} onChange={(e) => setMarketplace((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {marketplace.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0, opacity: item.active ? 1 : 0.6 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="admin-card-title">
                          {item.name || `Item ${idx + 1}`}
                          {!item.active && <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>(nonaktif)</span>}
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button type="button" onClick={() => updateMarketplaceItem(idx, "active", !item.active)} className={`admin-btn admin-btn-sm ${item.active ? "admin-btn-secondary" : "admin-btn-primary"}`} title={item.active ? "Nonaktifkan" : "Aktifkan"}>
                            <i className={item.active ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                          </button>
                          {idx > 0 && (
                            <button type="button" onClick={() => setMarketplace((p) => { const items = [...p.items]; [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; return { ...p, items }; })} className="admin-btn admin-btn-secondary admin-btn-sm" title="Pindah ke atas">
                              <i className="fas fa-arrow-up"></i>
                            </button>
                          )}
                          {idx < marketplace.items.length - 1 && (
                            <button type="button" onClick={() => setMarketplace((p) => { const items = [...p.items]; [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; return { ...p, items }; })} className="admin-btn admin-btn-secondary admin-btn-sm" title="Pindah ke bawah">
                              <i className="fas fa-arrow-down"></i>
                            </button>
                          )}
                          <button type="button" onClick={() => setMarketplace((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm" title="Hapus">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Nama</label>
                            <input className="admin-form-input" value={item.name} onChange={(e) => updateMarketplaceItem(idx, "name", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Logo</label>
                            {renderIconField("marketplace", idx, item.logo, (v) => updateMarketplaceItem(idx, "logo", v))}
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">URL</label>
                          <input className="admin-form-input" value={item.url} onChange={(e) => updateMarketplaceItem(idx, "url", e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.description} onChange={(e) => updateMarketplaceItem(idx, "description", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Badge Text</label>
                            <input className="admin-form-input" value={item.badge} onChange={(e) => updateMarketplaceItem(idx, "badge", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Badge Color</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input type="color" value={item.badgeColor} onChange={(e) => updateMarketplaceItem(idx, "badgeColor", e.target.value)} style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                              <input className="admin-form-input" value={item.badgeColor} onChange={(e) => updateMarketplaceItem(idx, "badgeColor", e.target.value)} style={{ flex: 1 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setMarketplace((p) => ({ ...p, items: [...p.items, { name: "", logo: "", url: "", description: "", badge: "", badgeColor: "#000000", bgColor: "#f8fafc", active: true }] }))} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Marketplace
                </button>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "social" && (
            <>
              <LayoutSection
                title="Social Media Links"
                icon="fas fa-share-alt"
                iconColor="#E4405F"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Daftar social media yang ditampilkan di kolom kanan halaman Belanja."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input className="admin-form-input" value={social.heading} onChange={(e) => setSocial((p) => ({ ...p, heading: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={social.subTitle} onChange={(e) => setSocial((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {social.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0, opacity: item.active ? 1 : 0.6 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="admin-card-title">
                          {item.name || `Item ${idx + 1}`}
                          {!item.active && <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>(nonaktif)</span>}
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button type="button" onClick={() => updateSocialItem(idx, "active", !item.active)} className={`admin-btn admin-btn-sm ${item.active ? "admin-btn-secondary" : "admin-btn-primary"}`} title={item.active ? "Nonaktifkan" : "Aktifkan"}>
                            <i className={item.active ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                          </button>
                          {idx > 0 && (
                            <button type="button" onClick={() => setSocial((p) => { const items = [...p.items]; [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; return { ...p, items }; })} className="admin-btn admin-btn-secondary admin-btn-sm" title="Pindah ke atas">
                              <i className="fas fa-arrow-up"></i>
                            </button>
                          )}
                          {idx < social.items.length - 1 && (
                            <button type="button" onClick={() => setSocial((p) => { const items = [...p.items]; [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; return { ...p, items }; })} className="admin-btn admin-btn-secondary admin-btn-sm" title="Pindah ke bawah">
                              <i className="fas fa-arrow-down"></i>
                            </button>
                          )}
                          <button type="button" onClick={() => setSocial((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm" title="Hapus">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Nama</label>
                            <input className="admin-form-input" value={item.name} onChange={(e) => updateSocialItem(idx, "name", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Logo</label>
                            {renderIconField("social", idx, item.logo, (v) => updateSocialItem(idx, "logo", v))}
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">URL</label>
                          <input className="admin-form-input" value={item.url} onChange={(e) => updateSocialItem(idx, "url", e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.description} onChange={(e) => updateSocialItem(idx, "description", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Badge Text</label>
                            <input className="admin-form-input" value={item.badge} onChange={(e) => updateSocialItem(idx, "badge", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Badge Color</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input type="color" value={item.badgeColor} onChange={(e) => updateSocialItem(idx, "badgeColor", e.target.value)} style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                              <input className="admin-form-input" value={item.badgeColor} onChange={(e) => updateSocialItem(idx, "badgeColor", e.target.value)} style={{ flex: 1 }} />
                            </div>
                          </div>
                        </div>
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Icon Background</label>
                            <input className="admin-form-input" value={item.iconBg} onChange={(e) => updateSocialItem(idx, "iconBg", e.target.value)} placeholder="#f8fafc atau linear-gradient(...)" />
                            <small style={{ color: "#94a3b8", fontSize: 11 }}>Gunakan warna hex atau CSS gradient</small>
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Icon Size (px)</label>
                            <input type="number" className="admin-form-input" value={item.iconSize} onChange={(e) => updateSocialItem(idx, "iconSize", parseInt(e.target.value) || 34)} min={16} max={48} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setSocial((p) => ({ ...p, items: [...p.items, { name: "", logo: "", url: "", description: "", badge: "", badgeColor: "#000000", iconBg: "#f8fafc", iconSize: 34, active: true }] }))} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Social Media
                </button>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "header" && (
            <>
              <LayoutSection
                title="Header Halaman"
                icon="fas fa-heading"
                iconColor="#6366F1"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Judul, subtitle, dan logo yang tampil di bagian atas halaman Belanja."
              >
                <div className="admin-form-group">
                  <label className="admin-form-label">Judul Halaman</label>
                  <input className="admin-form-input" value={header.title} onChange={(e) => setHeader((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Subtitle</label>
                  <input className="admin-form-input" value={header.subtitle} onChange={(e) => setHeader((p) => ({ ...p, subtitle: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Logo (opsional, kosongkan untuk menggunakan logo default)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {header.logo && (
                      <div style={{ width: 48, height: 48, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", flexShrink: 0 }}>
                        <img src={header.logo} alt="logo" style={{ maxWidth: 40, maxHeight: 40, objectFit: "contain" }} />
                      </div>
                    )}
                    <input className="admin-form-input" value={header.logo} onChange={(e) => setHeader((p) => ({ ...p, logo: e.target.value }))} style={{ flex: 1 }} placeholder="/assets/img/logo.svg" />
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setMediaLibraryFor({ type: "header", idx: 0 })} style={{ whiteSpace: "nowrap" }}>
                      <i className="fas fa-photo-video"></i> Library
                    </button>
                  </div>
                </div>
              </LayoutSection>

              <LayoutSection
                title="Footer Link"
                icon="fas fa-link"
                iconColor="#0EA5E9"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Link 'Lihat semua produk' yang tampil di bawah daftar marketplace/social media."
              >
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Teks Link</label>
                    <input className="admin-form-input" value={footerLink.text} onChange={(e) => setFooterLink((p) => ({ ...p, text: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">URL</label>
                    <input className="admin-form-input" value={footerLink.url} onChange={(e) => setFooterLink((p) => ({ ...p, url: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={footerLink.visible} onChange={(e) => setFooterLink((p) => ({ ...p, visible: e.target.checked }))} />
                    <span className="admin-form-label" style={{ margin: 0 }}>Tampilkan footer link</span>
                  </label>
                </div>
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
