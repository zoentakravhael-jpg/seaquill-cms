"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";

interface Props {
  settings: Record<string, string>;
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
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function HubungiLayoutClient({ settings }: Props) {
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
    })
  );

  function updateSocialItem(idx: number, field: keyof SocialMediaItem, val: string) {
    setSocial((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  function updateMarketplaceItem(idx: number, field: keyof MarketplaceItem, val: string) {
    setMarketplace((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
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
                            <input className="admin-form-input" value={item.icon} onChange={(e) => updateSocialItem(idx, "icon", e.target.value)} />
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
                            <input className="admin-form-input" value={item.icon} onChange={(e) => updateMarketplaceItem(idx, "icon", e.target.value)} />
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
                info="Heading dan deskripsi di atas form kontak. Form kontak mengirim pesan ke <strong>Pesan Masuk</strong> di admin."
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
              </LayoutSection>
              {saveBtn}
            </>
          )}
        </>
      )}
    </LayoutPageEditor>
  );
}
