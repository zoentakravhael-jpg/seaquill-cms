"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateSettings } from "../actions";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface Badge {
  icon: string;
  label: string;
  value: string;
}

interface NavMenuItem {
  label: string;
  href: string;
  submenuSource: string; // "" | "produk" | "artikel"
}

interface FooterNavLink {
  label: string;
  href: string;
}

interface FooterNavCategory {
  title: string;
  source: "produk" | "artikel" | "custom";
  links: FooterNavLink[];
}

interface SettingsFormProps {
  settings: Record<string, string>;
}

const tabs = [
  { key: "general", label: "Umum", icon: "fas fa-globe" },
  { key: "header", label: "Header", icon: "fas fa-window-maximize" },
  { key: "navigation", label: "Menu Navigasi", icon: "fas fa-bars" },
  { key: "footer", label: "Footer", icon: "fas fa-window-minimize" },
  { key: "homepage", label: "Homepage", icon: "fas fa-home" },
  { key: "social", label: "Social Media", icon: "fas fa-share-alt" },
  { key: "marketplace", label: "Marketplace", icon: "fas fa-shopping-cart" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  const initialBadges = useMemo(() => {
    try {
      const parsed = JSON.parse(settings.header_badges || "[]");
      return Array.isArray(parsed) ? (parsed as Badge[]) : [];
    } catch {
      return [];
    }
  }, [settings.header_badges]);

  const [badges, setBadges] = useState<Badge[]>(
    initialBadges.length > 0
      ? initialBadges
      : [
          { icon: "/assets/img/certified.png", label: "Certified", value: "BPOM Certified" },
          { icon: "/assets/img/original.png", label: "Quality", value: "100% Original" },
          { icon: "/assets/img/halal.png", label: "Certified", value: "100% Halal" },
        ]
  );

  const [logoPath, setLogoPath] = useState(settings.header_logo || "");
  const [logoStickyPath, setLogoStickyPath] = useState(settings.header_logo_sticky || "");
  const [uploading, setUploading] = useState<string | null>(null);

  const defaultNav: NavMenuItem[] = [
    { label: "Beranda", href: "/", submenuSource: "" },
    { label: "Tentang Seaquill", href: "/tentang", submenuSource: "" },
    { label: "Produk Seaquill", href: "/produk", submenuSource: "produk" },
    { label: "Artikel", href: "/artikel", submenuSource: "artikel" },
    { label: "Promo & Event", href: "/promo", submenuSource: "" },
    { label: "Galeri", href: "/galeri", submenuSource: "" },
    { label: "Hubungi Kami", href: "/hubungi-kami", submenuSource: "" },
  ];
  const initialNav = useMemo(() => {
    try {
      const parsed = JSON.parse(settings.nav_menu || "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed as NavMenuItem[]) : defaultNav;
    } catch {
      return defaultNav;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.nav_menu]);
  const [navItems, setNavItems] = useState<NavMenuItem[]>(initialNav);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const defaultFooterNav: FooterNavCategory[] = [
    { title: "Produk Seaquill", source: "produk", links: [] },
    { title: "Artikel Kesehatan", source: "artikel", links: [] },
    {
      title: "Bantuan & Support",
      source: "custom",
      links: [
        { label: "FAQs", href: "/faq" },
        { label: "Kontak Kami", href: "/hubungi-kami" },
        { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
        { label: "Pusat Bantuan", href: "/pusat-bantuan" },
        { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
      ],
    },
  ];
  const initialFooterNav = useMemo(() => {
    try {
      const parsed = JSON.parse(settings.footer_nav || "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed as FooterNavCategory[]) : defaultFooterNav;
    } catch {
      return defaultFooterNav;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.footer_nav]);
  const [footerNav, setFooterNav] = useState<FooterNavCategory[]>(initialFooterNav);
  const [footerDragCat, setFooterDragCat] = useState<number | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoStickyInputRef = useRef<HTMLInputElement>(null);
  const badgeInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [mediaLibraryFor, setMediaLibraryFor] = useState<string | null>(null);

  async function uploadImage(file: File, onSuccess: (url: string) => void, key: string) {
    setUploading(key);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.url);
        toast.success("Gambar berhasil diupload");
      } else {
        toast.error(data.error || "Upload gagal");
      }
    } catch {
      toast.error("Upload gagal");
    } finally {
      setUploading(null);
    }
  }

  function updateBadge(index: number, field: keyof Badge, val: string) {
    setBadges((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: val } : b)));
  }

  function addBadge() {
    setBadges((prev) => [...prev, { icon: "", label: "", value: "" }]);
  }

  function removeBadge(index: number) {
    setBadges((prev) => prev.filter((_, i) => i !== index));
  }

  function updateNavItem(index: number, field: keyof NavMenuItem, val: string) {
    setNavItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  }

  function addNavItem() {
    setNavItems((prev) => [...prev, { label: "", href: "/", submenuSource: "" }]);
  }

  function removeNavItem(index: number) {
    setNavItems((prev) => prev.filter((_, i) => i !== index));
  }

  function moveNavItem(from: number, to: number) {
    if (to < 0 || to >= navItems.length) return;
    setNavItems((prev) => {
      const items = [...prev];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return items;
    });
  }

  // Footer nav helpers
  function updateFooterCatTitle(catIdx: number, val: string) {
    setFooterNav((prev) => prev.map((c, i) => (i === catIdx ? { ...c, title: val } : c)));
  }
  function updateFooterCatSource(catIdx: number, val: FooterNavCategory["source"]) {
    setFooterNav((prev) => prev.map((c, i) => (i === catIdx ? { ...c, source: val, links: val === "custom" ? c.links : [] } : c)));
  }
  function addFooterCategory() {
    setFooterNav((prev) => [...prev, { title: "", source: "custom", links: [{ label: "", href: "/" }] }]);
  }
  function removeFooterCategory(catIdx: number) {
    setFooterNav((prev) => prev.filter((_, i) => i !== catIdx));
  }
  function moveFooterCategory(from: number, to: number) {
    if (to < 0 || to >= footerNav.length) return;
    setFooterNav((prev) => {
      const items = [...prev];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return items;
    });
  }
  function addFooterLink(catIdx: number) {
    setFooterNav((prev) => prev.map((c, i) => (i === catIdx ? { ...c, links: [...c.links, { label: "", href: "/" }] } : c)));
  }
  function removeFooterLink(catIdx: number, linkIdx: number) {
    setFooterNav((prev) => prev.map((c, i) => (i === catIdx ? { ...c, links: c.links.filter((_, li) => li !== linkIdx) } : c)));
  }
  function updateFooterLink(catIdx: number, linkIdx: number, field: keyof FooterNavLink, val: string) {
    setFooterNav((prev) => prev.map((c, i) => (i === catIdx ? { ...c, links: c.links.map((l, li) => (li === linkIdx ? { ...l, [field]: val } : l)) } : c)));
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success("Pengaturan berhasil disimpan");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`admin-btn ${activeTab === tab.key ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ fontSize: 13, padding: "8px 16px" }}
          >
            <i className={tab.icon} style={{ marginRight: 6 }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Umum ── */}
      <div style={{ display: activeTab === "general" ? "block" : "none" }}>
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-globe" style={{ marginRight: 8, color: "var(--admin-primary)" }}></i>Informasi Umum
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Nama Situs</label>
                <input name="site_name" defaultValue={settings.site_name || ""} className="admin-form-input" placeholder="Sea-Quill Indonesia" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tagline</label>
                <input name="site_tagline" defaultValue={settings.site_tagline || ""} className="admin-form-input" placeholder="Pilihan Suplemen Tepat untuk Kesehatan Optimal Anda" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Deskripsi Perusahaan</label>
              <textarea name="site_description" rows={3} defaultValue={settings.site_description || ""} className="admin-form-textarea" placeholder="Sea-Quill adalah suplemen kesehatan berkualitas..." />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Copyright</label>
              <input name="site_copyright" defaultValue={settings.site_copyright || ""} className="admin-form-input" placeholder="Copyright © 2025 Seaquill. All Rights Reserved." />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-phone" style={{ marginRight: 8, color: "var(--admin-success)" }}></i>Kontak
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Email</label>
                <input name="contact_email" type="email" defaultValue={settings.contact_email || ""} className="admin-form-input" placeholder="info@seaquill.co.id" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Telepon</label>
                <input name="contact_phone" defaultValue={settings.contact_phone || ""} className="admin-form-input" placeholder="021-1234-5678" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Alamat</label>
              <textarea name="contact_address" rows={2} defaultValue={settings.contact_address || ""} className="admin-form-textarea" placeholder="Jl. Contoh No. 123, Jakarta" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label"><i className="fab fa-whatsapp" style={{ marginRight: 6 }}></i>WhatsApp</label>
              <input name="contact_whatsapp" defaultValue={settings.contact_whatsapp || ""} className="admin-form-input" placeholder="https://wa.me/6281234567890" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab: Header ── */}
      <div style={{ display: activeTab === "header" ? "block" : "none" }}>
        {/* Hidden input for badges JSON */}
        <input type="hidden" name="header_badges" value={JSON.stringify(badges)} />

        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-image" style={{ marginRight: 8, color: "var(--admin-primary)" }}></i>Logo
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Logo Utama (SVG/PNG)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input name="header_logo" value={logoPath} onChange={(e) => setLogoPath(e.target.value)} className="admin-form-input" placeholder="/assets/img/logo.svg" style={{ flex: 1 }} />
                  <input type="file" accept="image/*,video/*" ref={logoInputRef} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, setLogoPath, "logo"); e.target.value = ""; }} />
                  <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploading === "logo"} className="admin-btn admin-btn-secondary" style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>
                    {uploading === "logo" ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-upload" style={{ marginRight: 4 }}></i>Upload</>}
                  </button>
                  <button type="button" onClick={() => setMediaLibraryFor("logo")} className="admin-btn admin-btn-secondary" style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>
                    <i className="fas fa-images" style={{ marginRight: 4 }}></i>Library
                  </button>
                </div>
                <small style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>Tampil di header bar, sidebar, dan mobile menu</small>
                {logoPath && (
                  <div style={{ marginTop: 8, padding: 12, background: "var(--admin-bg)", borderRadius: 8, textAlign: "center" }}>
                    <img src={logoPath} alt="Logo preview" style={{ maxHeight: 60, maxWidth: "100%" }} />
                  </div>
                )}
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Logo Sticky Navbar (JPG/PNG)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input name="header_logo_sticky" value={logoStickyPath} onChange={(e) => setLogoStickyPath(e.target.value)} className="admin-form-input" placeholder="/assets/img/logo.jpg" style={{ flex: 1 }} />
                  <input type="file" accept="image/*,video/*" ref={logoStickyInputRef} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, setLogoStickyPath, "logo_sticky"); e.target.value = ""; }} />
                  <button type="button" onClick={() => logoStickyInputRef.current?.click()} disabled={uploading === "logo_sticky"} className="admin-btn admin-btn-secondary" style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>
                    {uploading === "logo_sticky" ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-upload" style={{ marginRight: 4 }}></i>Upload</>}
                  </button>
                  <button type="button" onClick={() => setMediaLibraryFor("logo_sticky")} className="admin-btn admin-btn-secondary" style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>
                    <i className="fas fa-images" style={{ marginRight: 4 }}></i>Library
                  </button>
                </div>
                <small style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>Tampil di navigation bar saat scroll</small>
                {logoStickyPath && (
                  <div style={{ marginTop: 8, padding: 12, background: "var(--admin-bg)", borderRadius: 8, textAlign: "center" }}>
                    <img src={logoStickyPath} alt="Sticky logo preview" style={{ maxHeight: 60, maxWidth: "100%" }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-certificate" style={{ marginRight: 8, color: "var(--admin-success)" }}></i>Lencana Sertifikasi
            </span>
          </div>
          <div className="admin-card-body">
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "var(--admin-text-muted)" }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
              Lencana ditampilkan di header bar sebelum email. Setiap lencana memiliki ikon (path gambar), label kecil di atas, dan teks utama.
            </div>

            {badges.map((badge, i) => (
              <div key={i} style={{ marginBottom: 12, padding: 12, background: "var(--admin-bg)", borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                  {badge.icon && (
                    <div style={{ flexShrink: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 6, border: "1px solid var(--admin-border)" }}>
                      <img src={badge.icon} alt={badge.value || "icon"} style={{ maxWidth: 28, maxHeight: 28 }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label" style={{ fontSize: 12 }}>Icon Path</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input value={badge.icon} onChange={(e) => updateBadge(i, "icon", e.target.value)} className="admin-form-input" placeholder="/assets/img/certified.png" style={{ flex: 1 }} />
                      <input type="file" accept="image/*,video/*" ref={(el) => { badgeInputRefs.current[i] = el; }} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, (url) => updateBadge(i, "icon", url), `badge_${i}`); e.target.value = ""; }} />
                      <button type="button" onClick={() => badgeInputRefs.current[i]?.click()} disabled={uploading === `badge_${i}`} className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: 11, flexShrink: 0 }}>
                        {uploading === `badge_${i}` ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>}
                      </button>
                      <button type="button" onClick={() => setMediaLibraryFor(`badge_${i}`)} className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: 11, flexShrink: 0 }}>
                        <i className="fas fa-images"></i>
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label" style={{ fontSize: 12 }}>Label</label>
                    <input value={badge.label} onChange={(e) => updateBadge(i, "label", e.target.value)} className="admin-form-input" placeholder="Certified" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label" style={{ fontSize: 12 }}>Value</label>
                    <input value={badge.value} onChange={(e) => updateBadge(i, "value", e.target.value)} className="admin-form-input" placeholder="BPOM Certified" />
                  </div>
                  <button type="button" onClick={() => removeBadge(i)} className="admin-btn admin-btn-danger" style={{ padding: "8px 12px", fontSize: 12, flexShrink: 0 }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <button type="button" onClick={addBadge} className="admin-btn admin-btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>
              <i className="fas fa-plus" style={{ marginRight: 6 }}></i>Tambah Lencana
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab: Navigasi ── */}
      <div style={{ display: activeTab === "navigation" ? "block" : "none" }}>
        <input type="hidden" name="nav_menu" value={JSON.stringify(navItems)} />

        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-bars" style={{ marginRight: 8, color: "var(--admin-primary)" }}></i>Menu Navigasi Header
            </span>
          </div>
          <div className="admin-card-body">
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "var(--admin-text-muted)" }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
              Atur nama, URL, dan urutan menu navigasi. Gunakan tombol panah untuk mengubah posisi. Submenu Produk dan Artikel otomatis diambil dari kategori di database.
            </div>

            <div style={{ display: "flex", fontWeight: 600, fontSize: 12, color: "var(--admin-text-secondary)", padding: "0 12px 8px", gap: 12 }}>
              <div style={{ width: 60, textAlign: "center" }}>Urutan</div>
              <div style={{ flex: 2 }}>Nama Menu</div>
              <div style={{ flex: 2 }}>URL / Href</div>
              <div style={{ flex: 1 }}>Submenu</div>
              <div style={{ width: 70, textAlign: "center" }}>Aksi</div>
            </div>

            {navItems.map((item, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== i) moveNavItem(dragIndex, i);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 8,
                  padding: 12,
                  background: dragIndex === i ? "var(--admin-primary-light)" : "var(--admin-bg)",
                  borderRadius: 8,
                  border: dragIndex === i ? "2px dashed var(--admin-primary)" : "2px solid transparent",
                  cursor: "grab",
                  transition: "background 0.15s, border 0.15s",
                }}
              >
                {/* Order buttons */}
                <div style={{ width: 60, display: "flex", flexDirection: "column", gap: 2, alignItems: "center", flexShrink: 0 }}>
                  <button type="button" disabled={i === 0} onClick={() => moveNavItem(i, i - 1)} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", padding: 2, opacity: i === 0 ? 0.3 : 1, fontSize: 14, color: "var(--admin-text-secondary)" }}>
                    <i className="fas fa-chevron-up"></i>
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-text-primary)" }}>{i + 1}</span>
                  <button type="button" disabled={i === navItems.length - 1} onClick={() => moveNavItem(i, i + 1)} style={{ background: "none", border: "none", cursor: i === navItems.length - 1 ? "default" : "pointer", padding: 2, opacity: i === navItems.length - 1 ? 0.3 : 1, fontSize: 14, color: "var(--admin-text-secondary)" }}>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>

                {/* Label */}
                <div style={{ flex: 2 }}>
                  <input value={item.label} onChange={(e) => updateNavItem(i, "label", e.target.value)} className="admin-form-input" placeholder="Nama Menu" style={{ fontSize: 13 }} />
                </div>

                {/* Href */}
                <div style={{ flex: 2 }}>
                  <input value={item.href} onChange={(e) => updateNavItem(i, "href", e.target.value)} className="admin-form-input" placeholder="/path" style={{ fontSize: 13 }} />
                </div>

                {/* Submenu source */}
                <div style={{ flex: 1 }}>
                  <select value={item.submenuSource} onChange={(e) => updateNavItem(i, "submenuSource", e.target.value)} className="admin-form-input" style={{ fontSize: 13, padding: "8px 10px" }}>
                    <option value="">Tidak ada</option>
                    <option value="produk">Kategori Produk</option>
                    <option value="artikel">Kategori Artikel</option>
                  </select>
                </div>

                {/* Delete */}
                <div style={{ width: 70, textAlign: "center", flexShrink: 0 }}>
                  <button type="button" onClick={() => removeNavItem(i)} className="admin-btn admin-btn-danger" style={{ padding: "6px 10px", fontSize: 12 }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={addNavItem} className="admin-btn admin-btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>
                <i className="fas fa-plus" style={{ marginRight: 6 }}></i>Tambah Menu
              </button>
              <button type="button" onClick={() => setNavItems(defaultNav)} className="admin-btn admin-btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>
                <i className="fas fa-undo" style={{ marginRight: 6 }}></i>Reset Default
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab: Footer ── */}
      <div style={{ display: activeTab === "footer" ? "block" : "none" }}>
        <input type="hidden" name="footer_nav" value={JSON.stringify(footerNav)} />

        {/* Konten Footer Reference */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-window-minimize" style={{ marginRight: 8, color: "var(--admin-primary)" }}></i>Konfigurasi Footer
            </span>
          </div>
          <div className="admin-card-body">
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "var(--admin-text-muted)" }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
              Footer menampilkan: logo, deskripsi, menu navigasi (dikelola di bawah), kontak, tagline, tombol marketplace, copyright, dan social media.
            </div>

            <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>
              <i className="fas fa-align-left" style={{ marginRight: 6 }}></i>Konten Footer
            </h4>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Elemen</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Sumber</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Nilai Saat Ini</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "8px 12px" }}>Deskripsi</td>
                  <td style={{ padding: "8px 12px", color: "var(--admin-text-muted)" }}>Tab Umum</td>
                  <td style={{ padding: "8px 12px" }}>{settings.site_description ? settings.site_description.substring(0, 50) + "..." : "—"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "8px 12px" }}>Telepon</td>
                  <td style={{ padding: "8px 12px", color: "var(--admin-text-muted)" }}>Tab Umum → Kontak</td>
                  <td style={{ padding: "8px 12px" }}>{settings.contact_phone || "—"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "8px 12px" }}>Email</td>
                  <td style={{ padding: "8px 12px", color: "var(--admin-text-muted)" }}>Tab Umum → Kontak</td>
                  <td style={{ padding: "8px 12px" }}>{settings.contact_email || "—"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "8px 12px" }}>Alamat</td>
                  <td style={{ padding: "8px 12px", color: "var(--admin-text-muted)" }}>Tab Umum → Kontak</td>
                  <td style={{ padding: "8px 12px" }}>{settings.contact_address ? settings.contact_address.substring(0, 40) + "..." : "—"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "8px 12px" }}>Copyright</td>
                  <td style={{ padding: "8px 12px", color: "var(--admin-text-muted)" }}>Tab Umum</td>
                  <td style={{ padding: "8px 12px" }}>{settings.site_copyright || "—"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "8px 12px" }}>Tagline</td>
                  <td style={{ padding: "8px 12px", color: "var(--admin-text-muted)" }}>Tab Umum</td>
                  <td style={{ padding: "8px 12px" }}>{settings.site_tagline || "—"}</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ margin: "20px 0 12px", fontSize: 14, fontWeight: 600 }}>
              <i className="fas fa-share-alt" style={{ marginRight: 6 }}></i>Social Media &amp; Marketplace (footer)
            </h4>
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, fontSize: 13 }}>
              <p style={{ margin: "0 0 8px" }}>Social: Facebook, Twitter, LinkedIn, Instagram, WhatsApp — Dikelola dari tab <strong>Social Media</strong></p>
              <p style={{ margin: 0 }}>Marketplace: Tokopedia, Shopee — Dikelola dari tab <strong>Marketplace</strong></p>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Footer */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-th-list" style={{ marginRight: 8, color: "var(--admin-primary)" }}></i>Menu Navigasi Footer
            </span>
          </div>
          <div className="admin-card-body">
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "var(--admin-text-muted)" }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
              Atur kategori menu navigasi di footer. Sumber &quot;Kategori Produk&quot; dan &quot;Kategori Artikel&quot; otomatis mengambil data dari database. Sumber &quot;Custom&quot; memungkinkan Anda menambahkan link secara manual.
            </div>

            {footerNav.map((cat, ci) => (
              <div
                key={ci}
                draggable
                onDragStart={() => setFooterDragCat(ci)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (footerDragCat !== null && footerDragCat !== ci) moveFooterCategory(footerDragCat, ci); setFooterDragCat(null); }}
                onDragEnd={() => setFooterDragCat(null)}
                style={{
                  marginBottom: 16,
                  padding: 16,
                  background: footerDragCat === ci ? "var(--admin-primary-light)" : "var(--admin-bg)",
                  borderRadius: 10,
                  border: footerDragCat === ci ? "2px dashed var(--admin-primary)" : "1px solid var(--admin-border)",
                  cursor: "grab",
                  transition: "background 0.15s, border 0.15s",
                }}
              >
                {/* Category header */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", flexShrink: 0 }}>
                    <button type="button" disabled={ci === 0} onClick={() => moveFooterCategory(ci, ci - 1)} style={{ background: "none", border: "none", cursor: ci === 0 ? "default" : "pointer", padding: 2, opacity: ci === 0 ? 0.3 : 1, fontSize: 14, color: "var(--admin-text-secondary)" }}>
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-text-primary)" }}>{ci + 1}</span>
                    <button type="button" disabled={ci === footerNav.length - 1} onClick={() => moveFooterCategory(ci, ci + 1)} style={{ background: "none", border: "none", cursor: ci === footerNav.length - 1 ? "default" : "pointer", padding: 2, opacity: ci === footerNav.length - 1 ? 0.3 : 1, fontSize: 14, color: "var(--admin-text-secondary)" }}>
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--admin-text-muted)", marginBottom: 4, display: "block" }}>Judul Kategori</label>
                    <input value={cat.title} onChange={(e) => updateFooterCatTitle(ci, e.target.value)} className="admin-form-input" placeholder="Nama Kategori" style={{ fontSize: 13 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--admin-text-muted)", marginBottom: 4, display: "block" }}>Sumber</label>
                    <select value={cat.source} onChange={(e) => updateFooterCatSource(ci, e.target.value as FooterNavCategory["source"])} className="admin-form-input" style={{ fontSize: 13, padding: "8px 10px" }}>
                      <option value="custom">Custom (Manual)</option>
                      <option value="produk">Kategori Produk (Otomatis)</option>
                      <option value="artikel">Kategori Artikel (Otomatis)</option>
                    </select>
                  </div>
                  <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
                    <button type="button" onClick={() => removeFooterCategory(ci)} className="admin-btn admin-btn-danger" style={{ padding: "6px 10px", fontSize: 12 }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Links (only for custom source) */}
                {cat.source === "custom" && (
                  <div style={{ marginLeft: 48, paddingTop: 8, borderTop: "1px solid var(--admin-border)" }}>
                    <div style={{ display: "flex", fontWeight: 600, fontSize: 11, color: "var(--admin-text-muted)", padding: "0 0 6px", gap: 12 }}>
                      <div style={{ flex: 2 }}>Label</div>
                      <div style={{ flex: 2 }}>URL / Href</div>
                      <div style={{ width: 40 }}></div>
                    </div>
                    {cat.links.map((link, li) => (
                      <div key={li} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                        <div style={{ flex: 2 }}>
                          <input value={link.label} onChange={(e) => updateFooterLink(ci, li, "label", e.target.value)} className="admin-form-input" placeholder="Nama Link" style={{ fontSize: 12, padding: "6px 10px" }} />
                        </div>
                        <div style={{ flex: 2 }}>
                          <input value={link.href} onChange={(e) => updateFooterLink(ci, li, "href", e.target.value)} className="admin-form-input" placeholder="/path" style={{ fontSize: 12, padding: "6px 10px" }} />
                        </div>
                        <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                          <button type="button" onClick={() => removeFooterLink(ci, li)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-danger)", fontSize: 13, padding: 4 }}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addFooterLink(ci)} className="admin-btn admin-btn-secondary" style={{ fontSize: 11, padding: "4px 12px", marginTop: 4 }}>
                      <i className="fas fa-plus" style={{ marginRight: 4 }}></i>Tambah Link
                    </button>
                  </div>
                )}

                {/* Info for auto-source */}
                {cat.source === "produk" && (
                  <div style={{ marginLeft: 48, paddingTop: 8, borderTop: "1px solid var(--admin-border)", fontSize: 12, color: "var(--admin-text-muted)" }}>
                    <i className="fas fa-magic" style={{ marginRight: 6 }}></i>
                    Link otomatis dari <a href="/admin/kategori-produk" style={{ color: "var(--admin-primary)" }}>Kategori Produk</a>
                  </div>
                )}
                {cat.source === "artikel" && (
                  <div style={{ marginLeft: 48, paddingTop: 8, borderTop: "1px solid var(--admin-border)", fontSize: 12, color: "var(--admin-text-muted)" }}>
                    <i className="fas fa-magic" style={{ marginRight: 6 }}></i>
                    Link otomatis dari <a href="/admin/kategori-artikel" style={{ color: "var(--admin-primary)" }}>Kategori Artikel</a>
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="button" onClick={addFooterCategory} className="admin-btn admin-btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>
                <i className="fas fa-plus" style={{ marginRight: 6 }}></i>Tambah Kategori
              </button>
              <button type="button" onClick={() => setFooterNav(defaultFooterNav)} className="admin-btn admin-btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>
                <i className="fas fa-undo" style={{ marginRight: 6 }}></i>Reset Default
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab: Homepage ── */}
      <div style={{ display: activeTab === "homepage" ? "block" : "none" }}>
        <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "var(--admin-text-muted)" }}>
          <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
          Pengaturan konten homepage. Untuk mengelola <strong>Hero Slides</strong> dan <strong>Brand Partners</strong>, gunakan menu di sidebar.
          Data JSON di bawah disimpan dalam format JSON — edit dengan hati-hati agar tidak merusak struktur.
        </div>

        {/* Feature Cards */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-th-large" style={{ marginRight: 8, color: "#3B82F6" }}></i>Feature Cards
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Data Feature Cards (JSON)</label>
              <textarea
                name="home_feature_cards"
                className="admin-form-textarea"
                style={{ fontFamily: "monospace", fontSize: 12, minHeight: 150 }}
                defaultValue={settings.home_feature_cards || "[]"}
              />
              <p className="admin-form-hint">Array JSON: [{`{title, text, btnText, href}`}, ...]</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-info-circle" style={{ marginRight: 8, color: "#10B981" }}></i>About Section
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Data About Section (JSON)</label>
              <textarea
                name="home_about_section"
                className="admin-form-textarea"
                style={{ fontFamily: "monospace", fontSize: 12, minHeight: 200 }}
                defaultValue={settings.home_about_section || "{}"}
              />
              <p className="admin-form-hint">Object JSON: {`{subTitle, heading, paragraph, checklist[], ctaText, ctaLink, image1, image2, image3}`}</p>
            </div>
          </div>
        </div>

        {/* Service List */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-concierge-bell" style={{ marginRight: 8, color: "#F59E0B" }}></i>Service List
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Data Service List (JSON)</label>
              <textarea
                name="home_service_list"
                className="admin-form-textarea"
                style={{ fontFamily: "monospace", fontSize: 12, minHeight: 200 }}
                defaultValue={settings.home_service_list || "{}"}
              />
              <p className="admin-form-hint">Object JSON: {`{subTitle, heading, paragraph, items: [{icon, title, text, image}]}`}</p>
            </div>
          </div>
        </div>

        {/* Product Section heading */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-box-open" style={{ marginRight: 8, color: "#8B5CF6" }}></i>Produk Unggulan (heading)
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Data Heading Produk (JSON)</label>
              <textarea
                name="home_product_section"
                className="admin-form-textarea"
                style={{ fontFamily: "monospace", fontSize: 12, minHeight: 80 }}
                defaultValue={settings.home_product_section || "{}"}
              />
              <p className="admin-form-hint">Object JSON: {`{subTitle, heading, paragraph}`} — Produk diambil otomatis dari DB (isBestSeller / isNew)</p>
            </div>
          </div>
        </div>

        {/* Blog Section heading */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-newspaper" style={{ marginRight: 8, color: "#EC4899" }}></i>Blog Slider (heading)
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Data Heading Blog (JSON)</label>
              <textarea
                name="home_blog_section"
                className="admin-form-textarea"
                style={{ fontFamily: "monospace", fontSize: 12, minHeight: 80 }}
                defaultValue={settings.home_blog_section || "{}"}
              />
              <p className="admin-form-hint">Object JSON: {`{subTitle, heading, paragraph}`} — Artikel diambil otomatis dari DB (4 terbaru)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab: Social Media ── */}
      <div style={{ display: activeTab === "social" ? "block" : "none" }}>
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-share-alt" style={{ marginRight: 8, color: "#8B5CF6" }}></i>Social Media
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-facebook" style={{ marginRight: 6, color: "#1877F2" }}></i>Facebook</label>
                <input name="social_facebook" defaultValue={settings.social_facebook || ""} className="admin-form-input" placeholder="https://facebook.com/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-instagram" style={{ marginRight: 6, color: "#E4405F" }}></i>Instagram</label>
                <input name="social_instagram" defaultValue={settings.social_instagram || ""} className="admin-form-input" placeholder="https://instagram.com/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-twitter" style={{ marginRight: 6, color: "#1DA1F2" }}></i>Twitter / X</label>
                <input name="social_twitter" defaultValue={settings.social_twitter || ""} className="admin-form-input" placeholder="https://twitter.com/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-youtube" style={{ marginRight: 6, color: "#FF0000" }}></i>YouTube</label>
                <input name="social_youtube" defaultValue={settings.social_youtube || ""} className="admin-form-input" placeholder="https://youtube.com/@seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-tiktok" style={{ marginRight: 6 }}></i>TikTok</label>
                <input name="social_tiktok" defaultValue={settings.social_tiktok || ""} className="admin-form-input" placeholder="https://tiktok.com/@seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-linkedin" style={{ marginRight: 6, color: "#0A66C2" }}></i>LinkedIn</label>
                <input name="social_linkedin" defaultValue={settings.social_linkedin || ""} className="admin-form-input" placeholder="https://linkedin.com/company/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label"><i className="fab fa-pinterest" style={{ marginRight: 6, color: "#E60023" }}></i>Pinterest</label>
                <input name="social_pinterest" defaultValue={settings.social_pinterest || ""} className="admin-form-input" placeholder="https://pinterest.com/seaquill" />
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginTop: 8, fontSize: 13, color: "var(--admin-text-muted)" }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
              <strong>Header sidebar:</strong> Facebook, Twitter, Pinterest, LinkedIn, Instagram &nbsp;|&nbsp;
              <strong>Footer:</strong> Facebook, Twitter, LinkedIn, Instagram, WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab: Marketplace ── */}
      <div style={{ display: activeTab === "marketplace" ? "block" : "none" }}>
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">
              <i className="fas fa-shopping-cart" style={{ marginRight: 8, color: "var(--admin-warning)" }}></i>Marketplace
            </span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Shopee</label>
                <input name="social_shopee" defaultValue={settings.social_shopee || ""} className="admin-form-input" placeholder="https://shopee.co.id/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tokopedia</label>
                <input name="social_tokopedia" defaultValue={settings.social_tokopedia || ""} className="admin-form-input" placeholder="https://tokopedia.com/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Lazada</label>
                <input name="social_lazada" defaultValue={settings.social_lazada || ""} className="admin-form-input" placeholder="https://lazada.co.id/shop/seaquill" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">TikTok Shop</label>
                <input name="social_tiktok_shop" defaultValue={settings.social_tiktok_shop || ""} className="admin-form-input" placeholder="https://tiktok.com/shop/seaquill" />
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "var(--admin-bg)", borderRadius: 8, marginTop: 8, fontSize: 13, color: "var(--admin-text-muted)" }}>
              <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
              Tombol Tokopedia &amp; Shopee tampil di Header dan Footer. Lazada &amp; TikTok Shop untuk penggunaan di masa depan.
            </div>
          </div>
        </div>
      </div>

      {/* Save – always visible */}
      <div className="admin-form-actions">
        <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary">
          {submitting ? (
            <><i className="fas fa-spinner fa-spin"></i> Menyimpan...</>
          ) : (
            <><i className="fas fa-save"></i> Simpan Pengaturan</>
          )}
        </button>
      </div>

      <MediaLibraryModal
        open={mediaLibraryFor !== null}
        onClose={() => setMediaLibraryFor(null)}
        onSelect={(url) => {
          if (mediaLibraryFor === "logo") setLogoPath(url);
          else if (mediaLibraryFor === "logo_sticky") setLogoStickyPath(url);
          else if (mediaLibraryFor?.startsWith("badge_")) {
            const idx = parseInt(mediaLibraryFor.split("_")[1]);
            updateBadge(idx, "icon", url);
          }
          setMediaLibraryFor(null);
        }}
      />
    </form>
  );
}
