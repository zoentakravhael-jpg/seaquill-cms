"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";
import ImageUpload from "@/components/admin/ImageUpload";

interface Props {
  settings: Record<string, string>;
  heroCount: number;
  brandCount: number;
}

const tabs = [
  { key: "hero", label: "Hero Slides", icon: "fas fa-images" },
  { key: "cards", label: "3 Cards", icon: "fas fa-th-large" },
  { key: "about", label: "Tentang Seaquill", icon: "fas fa-info-circle" },
  { key: "products", label: "Pilihan Produk", icon: "fas fa-box-open" },
  { key: "featured", label: "Produk Unggulan", icon: "fas fa-star" },
  { key: "articles", label: "Artikel Kesehatan", icon: "fas fa-newspaper" },
];

interface FeatureCard {
  title: string;
  text: string;
  btnText: string;
  href: string;
}

interface AboutData {
  subTitle: string;
  heading: string;
  paragraph: string;
  checklist: string[];
  ctaText: string;
  ctaLink: string;
  image1: string;
  image2: string;
  image3: string;
}

interface SectionHeading {
  subTitle: string;
  heading: string;
  paragraph: string;
}

interface ServiceItem {
  icon: string;
  title: string;
  text: string;
  image: string;
  buttonText: string;
}

interface ServiceData {
  subTitle: string;
  heading: string;
  paragraph: string;
  items: ServiceItem[];
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export default function HomepageLayoutClient({ settings, heroCount, brandCount }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Feature cards state
  const [cards, setCards] = useState<FeatureCard[]>(
    parseJSON(settings.home_feature_cards, [
      { title: "", text: "", btnText: "", href: "" },
      { title: "", text: "", btnText: "", href: "" },
      { title: "", text: "", btnText: "", href: "" },
    ])
  );

  // About section state
  const [about, setAbout] = useState<AboutData>(
    parseJSON(settings.home_about_section, {
      subTitle: "",
      heading: "",
      paragraph: "",
      checklist: [""],
      ctaText: "",
      ctaLink: "",
      image1: "",
      image2: "",
      image3: "",
    })
  );

  // Service/pilihan produk state
  const [service, setService] = useState<ServiceData>(
    parseJSON(settings.home_service_list, {
      subTitle: "",
      heading: "",
      paragraph: "",
      items: [],
    })
  );

  // Product section heading
  const [productHeading, setProductHeading] = useState<SectionHeading>(
    parseJSON(settings.home_product_section, { subTitle: "", heading: "", paragraph: "" })
  );

  // Featured product flags toggle
  const [featuredFlags, setFeaturedFlags] = useState<{ bestSeller: boolean; newProduct: boolean }>(
    parseJSON(settings.home_featured_flags, { bestSeller: true, newProduct: true })
  );

  // Product slider config
  const [productSliderConfig, setProductSliderConfig] = useState<{
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    pauseOnHover: boolean;
  }>(parseJSON(settings.product_slider_config, { autoplay: true, autoplayDelay: 4000, loop: true, pauseOnHover: true }));

  // Brand slider config
  const [brandSliderConfig, setBrandSliderConfig] = useState<{
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    pauseOnHover: boolean;
  }>(parseJSON(settings.brand_slider_config, { autoplay: true, autoplayDelay: 3000, loop: true, pauseOnHover: false }));

  // Blog slider config
  const [blogSliderConfig, setBlogSliderConfig] = useState<{
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    pauseOnHover: boolean;
  }>(parseJSON(settings.blog_slider_config, { autoplay: true, autoplayDelay: 4000, loop: true, pauseOnHover: true }));

  // Blog section heading
  const [blogHeading, setBlogHeading] = useState<SectionHeading>(
    parseJSON(settings.home_blog_section, { subTitle: "", heading: "", paragraph: "" })
  );

  function updateCard(idx: number, field: keyof FeatureCard, val: string) {
    setCards((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
  }

  function updateAboutChecklist(idx: number, val: string) {
    setAbout((prev) => ({
      ...prev,
      checklist: prev.checklist.map((c, i) => (i === idx ? val : c)),
    }));
  }

  function addChecklistItem() {
    setAbout((prev) => ({ ...prev, checklist: [...prev.checklist, ""] }));
  }

  function removeChecklistItem(idx: number) {
    setAbout((prev) => ({ ...prev, checklist: prev.checklist.filter((_, i) => i !== idx) }));
  }

  function updateServiceItem(idx: number, field: keyof ServiceItem, val: string) {
    setService((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    }));
  }

  function addServiceItem() {
    setService((prev) => ({
      ...prev,
      items: [...prev.items, { icon: "", title: "", text: "", image: "", buttonText: "" }],
    }));
  }

  function removeServiceItem(idx: number) {
    setService((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("home_feature_cards", JSON.stringify(cards));
      formData.set("home_about_section", JSON.stringify(about));
      formData.set("home_service_list", JSON.stringify(service));
      formData.set("home_product_section", JSON.stringify(productHeading));
      formData.set("home_featured_flags", JSON.stringify(featuredFlags));
      formData.set("product_slider_config", JSON.stringify(productSliderConfig));
      formData.set("brand_slider_config", JSON.stringify(brandSliderConfig));
      formData.set("blog_slider_config", JSON.stringify(blogSliderConfig));
      formData.set("home_blog_section", JSON.stringify(blogHeading));

      const result = await updateLayoutSettings(
        [
          "home_feature_cards",
          "home_about_section",
          "home_service_list",
          "home_product_section",
          "home_featured_flags",
          "product_slider_config",
          "brand_slider_config",
          "blog_slider_config",
          "home_blog_section",
        ],
        formData,
        "/admin/layout-pages/homepage"
      );

      if (result.success) {
        toast.success("Homepage berhasil disimpan");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LayoutPageEditor
      pageTitle="Homepage"
      pageSubtitle="Kelola semua section di halaman utama website"
      pageIcon="fas fa-home"
      pageIconBg="linear-gradient(135deg, #3B82F6, #1D4ED8)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {/* ── Hero Slides ── */}
          {activeTab === "hero" && (
            <LayoutSection
              title="Hero Slides"
              icon="fas fa-images"
              iconColor="#3B82F6"
              badge={{ type: "db", label: "Database" }}
              manageLink={{ href: "/admin/hero-slides", label: "Kelola Hero Slides" }}
              info={`Saat ini ada <strong>${heroCount}</strong> hero slide aktif. Kelola slide melalui halaman CRUD terpisah.`}
            />
          )}

          {/* ── 3 Cards ── */}
          {activeTab === "cards" && (
            <>
              <LayoutSection
                title="Feature Cards (3 Cards)"
                icon="fas fa-th-large"
                iconColor="#10B981"
                badge={{ type: "json", label: "JSON Setting" }}
                info="3 kartu fitur yang muncul di bawah hero slider."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {cards.map((card, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header">
                        <span className="admin-card-title">Card {idx + 1}</span>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Judul</label>
                            <input
                              className="admin-form-input"
                              value={card.title}
                              onChange={(e) => updateCard(idx, "title", e.target.value)}
                              placeholder="e.g., Sertifikasi BPOM"
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Button Text</label>
                            <input
                              className="admin-form-input"
                              value={card.btnText}
                              onChange={(e) => updateCard(idx, "btnText", e.target.value)}
                              placeholder="e.g., Lihat Selengkapnya"
                            />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea
                            className="admin-form-textarea"
                            value={card.text}
                            onChange={(e) => updateCard(idx, "text", e.target.value)}
                            style={{ minHeight: 60 }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Link (href)</label>
                          <input
                            className="admin-form-input"
                            value={card.href}
                            onChange={(e) => updateCard(idx, "href", e.target.value)}
                            placeholder="/tentang"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </LayoutSection>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}

          {/* ── Tentang Seaquill ── */}
          {activeTab === "about" && (
            <>
              <LayoutSection
                title="Section Tentang Seaquill"
                icon="fas fa-info-circle"
                iconColor="#10B981"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Section 'Tentang' di homepage, berisi gambar, heading, paragraf, dan checklist."
              >
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input
                      className="admin-form-input"
                      value={about.subTitle}
                      onChange={(e) => setAbout((p) => ({ ...p, subTitle: e.target.value }))}
                      placeholder="e.g., TENTANG SEAQUILL"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input
                      className="admin-form-input"
                      value={about.heading}
                      onChange={(e) => setAbout((p) => ({ ...p, heading: e.target.value }))}
                      placeholder="e.g., Suplemen Terpercaya Sejak 1985"
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Paragraf</label>
                  <textarea
                    className="admin-form-textarea"
                    value={about.paragraph}
                    onChange={(e) => setAbout((p) => ({ ...p, paragraph: e.target.value }))}
                    style={{ minHeight: 80 }}
                  />
                </div>

                {/* Checklist */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Checklist Items</label>
                  {about.checklist.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input
                        className="admin-form-input"
                        value={item}
                        onChange={(e) => updateAboutChecklist(idx, e.target.value)}
                        placeholder={`Checklist item ${idx + 1}`}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(idx)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        style={{ flexShrink: 0 }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addChecklistItem} className="admin-btn admin-btn-secondary admin-btn-sm">
                    <i className="fas fa-plus"></i> Tambah Item
                  </button>
                </div>

                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">CTA Text</label>
                    <input
                      className="admin-form-input"
                      value={about.ctaText}
                      onChange={(e) => setAbout((p) => ({ ...p, ctaText: e.target.value }))}
                      placeholder="e.g., Selengkapnya"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">CTA Link</label>
                    <input
                      className="admin-form-input"
                      value={about.ctaLink}
                      onChange={(e) => setAbout((p) => ({ ...p, ctaLink: e.target.value }))}
                      placeholder="/tentang"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <ImageUpload
                    name="about_image1"
                    value={about.image1}
                    onChange={(url) => setAbout((p) => ({ ...p, image1: url }))}
                    label="Gambar 1"
                  />
                  <ImageUpload
                    name="about_image2"
                    value={about.image2}
                    onChange={(url) => setAbout((p) => ({ ...p, image2: url }))}
                    label="Gambar 2"
                  />
                  <ImageUpload
                    name="about_image3"
                    value={about.image3}
                    onChange={(url) => setAbout((p) => ({ ...p, image3: url }))}
                    label="Gambar 3"
                  />
                </div>
              </LayoutSection>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}

          {/* ── Pilihan Produk (Service List) ── */}
          {activeTab === "products" && (
            <>
              <LayoutSection
                title="Pilihan Produk (Service List)"
                icon="fas fa-box-open"
                iconColor="#8B5CF6"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Section kategori/pilihan produk di homepage. Setiap item menampilkan ikon, judul, deskripsi, dan gambar."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input
                      className="admin-form-input"
                      value={service.subTitle}
                      onChange={(e) => setService((p) => ({ ...p, subTitle: e.target.value }))}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading</label>
                    <input
                      className="admin-form-input"
                      value={service.heading}
                      onChange={(e) => setService((p) => ({ ...p, heading: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-form-label">Paragraf</label>
                  <textarea
                    className="admin-form-textarea"
                    value={service.paragraph}
                    onChange={(e) => setService((p) => ({ ...p, paragraph: e.target.value }))}
                    style={{ minHeight: 60 }}
                  />
                </div>

                {/* Service Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {service.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="admin-card-title">Item {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeServiceItem(idx)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <ImageUpload
                              name={`service_icon_${idx}`}
                              value={item.icon}
                              onChange={(url) => updateServiceItem(idx, "icon", url)}
                              label="Icon"
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Judul</label>
                            <input
                              className="admin-form-input"
                              value={item.title}
                              onChange={(e) => updateServiceItem(idx, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea
                            className="admin-form-textarea"
                            value={item.text}
                            onChange={(e) => updateServiceItem(idx, "text", e.target.value)}
                            style={{ minHeight: 60 }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Button Teks</label>
                          <input
                            className="admin-form-input"
                            value={item.buttonText || ""}
                            onChange={(e) => updateServiceItem(idx, "buttonText", e.target.value)}
                            placeholder="e.g., Selengkapnya"
                          />
                        </div>
                        <ImageUpload
                          name={`service_item_${idx}`}
                          value={item.image}
                          onChange={(url) => updateServiceItem(idx, "image", url)}
                          label="Gambar"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addServiceItem}
                  className="admin-btn admin-btn-secondary"
                  style={{ marginTop: 12 }}
                >
                  <i className="fas fa-plus"></i> Tambah Item
                </button>
              </LayoutSection>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}

          {/* ── Produk Unggulan ── */}
          {activeTab === "featured" && (
            <>
              <LayoutSection
                title="Produk Unggulan"
                icon="fas fa-star"
                iconColor="#F59E0B"
                badge={{ type: "db", label: "Database" }}
                manageLink={{ href: "/admin/produk", label: "Kelola Produk" }}
                info="Produk unggulan diambil otomatis dari database berdasarkan flag yang aktif di bawah. Aktifkan atau nonaktifkan flag untuk mengontrol produk mana yang tampil."
              >
                <div style={{ marginTop: 16 }}>
                  {/* Flag toggles */}
                  <div style={{ marginBottom: 20, padding: 16, background: "var(--admin-card-bg, #f8fafc)", borderRadius: 10, border: "1px solid var(--admin-border, #e2e8f0)" }}>
                    <label className="admin-form-label" style={{ marginBottom: 12, display: "block" }}>
                      <i className="fas fa-toggle-on" style={{ marginRight: 6 }}></i> Flag Aktif
                    </label>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 16px", borderRadius: 8, background: featuredFlags.bestSeller ? "rgba(249,115,22,0.1)" : "transparent", border: `1px solid ${featuredFlags.bestSeller ? "#f97316" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                        <input
                          type="checkbox"
                          checked={featuredFlags.bestSeller}
                          onChange={(e) => setFeaturedFlags((p) => ({ ...p, bestSeller: e.target.checked }))}
                          style={{ accentColor: "#f97316" }}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-fire" style={{ color: "#f97316" }}></i>
                          <strong>Best Seller</strong>
                        </span>
                      </label>
                      <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 16px", borderRadius: 8, background: featuredFlags.newProduct ? "rgba(16,185,129,0.1)" : "transparent", border: `1px solid ${featuredFlags.newProduct ? "#10b981" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                        <input
                          type="checkbox"
                          checked={featuredFlags.newProduct}
                          onChange={(e) => setFeaturedFlags((p) => ({ ...p, newProduct: e.target.checked }))}
                          style={{ accentColor: "#10b981" }}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-sparkles" style={{ color: "#10b981" }}></i>
                          <strong>Produk Baru</strong>
                        </span>
                      </label>
                    </div>
                    <p style={{ marginTop: 8, fontSize: 13, color: "var(--admin-text-muted, #94a3b8)" }}>
                      Hanya produk dengan flag yang aktif di atas yang akan tampil di section Produk Unggulan.
                    </p>
                  </div>
                  <div className="admin-form-grid admin-form-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Sub Title</label>
                      <input
                        className="admin-form-input"
                        value={productHeading.subTitle}
                        onChange={(e) => setProductHeading((p) => ({ ...p, subTitle: e.target.value }))}
                        placeholder="e.g., PRODUK UNGGULAN"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Heading</label>
                      <input
                        className="admin-form-input"
                        value={productHeading.heading}
                        onChange={(e) => setProductHeading((p) => ({ ...p, heading: e.target.value }))}
                        placeholder="e.g., Produk Terlaris Kami"
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Paragraf</label>
                    <textarea
                      className="admin-form-textarea"
                      value={productHeading.paragraph}
                      onChange={(e) => setProductHeading((p) => ({ ...p, paragraph: e.target.value }))}
                      style={{ minHeight: 60 }}
                    />
                  </div>

                  {/* Slider Config */}
                  <div style={{ marginTop: 20, padding: 16, background: "var(--admin-card-bg, #f8fafc)", borderRadius: 10, border: "1px solid var(--admin-border, #e2e8f0)" }}>
                    <label className="admin-form-label" style={{ marginBottom: 12, display: "block" }}>
                      <i className="fas fa-sliders-h" style={{ marginRight: 6 }}></i> Konfigurasi Carousel
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                      {/* Autoplay toggle */}
                      <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: productSliderConfig.autoplay ? "rgba(59,130,246,0.1)" : "transparent", border: `1px solid ${productSliderConfig.autoplay ? "#3b82f6" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                        <input
                          type="checkbox"
                          checked={productSliderConfig.autoplay}
                          onChange={(e) => setProductSliderConfig((p) => ({ ...p, autoplay: e.target.checked }))}
                          style={{ accentColor: "#3b82f6" }}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-play-circle" style={{ color: "#3b82f6" }}></i>
                          <strong>Autoplay</strong>
                        </span>
                      </label>

                      {/* Loop toggle */}
                      <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: productSliderConfig.loop ? "rgba(139,92,246,0.1)" : "transparent", border: `1px solid ${productSliderConfig.loop ? "#8b5cf6" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                        <input
                          type="checkbox"
                          checked={productSliderConfig.loop}
                          onChange={(e) => setProductSliderConfig((p) => ({ ...p, loop: e.target.checked }))}
                          style={{ accentColor: "#8b5cf6" }}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-sync-alt" style={{ color: "#8b5cf6" }}></i>
                          <strong>Loop</strong>
                        </span>
                      </label>

                      {/* Pause on Hover toggle */}
                      <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: productSliderConfig.pauseOnHover ? "rgba(14,165,233,0.1)" : "transparent", border: `1px solid ${productSliderConfig.pauseOnHover ? "#0ea5e9" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s", opacity: productSliderConfig.autoplay ? 1 : 0.5, pointerEvents: productSliderConfig.autoplay ? "auto" : "none" }}>
                        <input
                          type="checkbox"
                          checked={productSliderConfig.pauseOnHover}
                          onChange={(e) => setProductSliderConfig((p) => ({ ...p, pauseOnHover: e.target.checked }))}
                          style={{ accentColor: "#0ea5e9" }}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-pause-circle" style={{ color: "#0ea5e9" }}></i>
                          <strong>Pause on Hover</strong>
                        </span>
                      </label>
                    </div>

                    {/* Interval input */}
                    <div style={{ marginTop: 12, maxWidth: 300 }}>
                      <label className="admin-form-label" style={{ fontSize: 13 }}>
                        Interval (ms)
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input
                          type="number"
                          className="admin-form-input"
                          value={productSliderConfig.autoplayDelay}
                          onChange={(e) => setProductSliderConfig((p) => ({ ...p, autoplayDelay: Math.max(1000, Math.min(30000, Number(e.target.value) || 4000)) }))}
                          min={1000}
                          max={30000}
                          step={500}
                          disabled={!productSliderConfig.autoplay}
                          style={{ opacity: productSliderConfig.autoplay ? 1 : 0.5 }}
                        />
                        <span style={{ fontSize: 13, color: "var(--admin-text-muted, #94a3b8)", whiteSpace: "nowrap" }}>
                          = {(productSliderConfig.autoplayDelay / 1000).toFixed(1)} detik
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </LayoutSection>

              <LayoutSection
                title="Brand Partners"
                icon="fas fa-handshake"
                iconColor="#6366F1"
                badge={{ type: "db", label: "Database" }}
                manageLink={{ href: "/admin/brand-partners", label: "Kelola Brand Partners" }}
                info={`Saat ini ada <strong>${brandCount}</strong> brand partner aktif. Section ini otomatis menampilkan logo brand dari database.`}
              >
                <div style={{ marginTop: 16, padding: 16, background: "var(--admin-card-bg, #f8fafc)", borderRadius: 10, border: "1px solid var(--admin-border, #e2e8f0)" }}>
                  <label className="admin-form-label" style={{ marginBottom: 12, display: "block" }}>
                    <i className="fas fa-sliders-h" style={{ marginRight: 6 }}></i> Konfigurasi Carousel Logo
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: brandSliderConfig.autoplay ? "rgba(59,130,246,0.1)" : "transparent", border: `1px solid ${brandSliderConfig.autoplay ? "#3b82f6" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                      <input
                        type="checkbox"
                        checked={brandSliderConfig.autoplay}
                        onChange={(e) => setBrandSliderConfig((p) => ({ ...p, autoplay: e.target.checked }))}
                        style={{ accentColor: "#3b82f6" }}
                      />
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-play-circle" style={{ color: "#3b82f6" }}></i>
                        <strong>Autoplay</strong>
                      </span>
                    </label>
                    <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: brandSliderConfig.loop ? "rgba(139,92,246,0.1)" : "transparent", border: `1px solid ${brandSliderConfig.loop ? "#8b5cf6" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                      <input
                        type="checkbox"
                        checked={brandSliderConfig.loop}
                        onChange={(e) => setBrandSliderConfig((p) => ({ ...p, loop: e.target.checked }))}
                        style={{ accentColor: "#8b5cf6" }}
                      />
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-sync-alt" style={{ color: "#8b5cf6" }}></i>
                        <strong>Loop</strong>
                      </span>
                    </label>
                    <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: brandSliderConfig.pauseOnHover ? "rgba(14,165,233,0.1)" : "transparent", border: `1px solid ${brandSliderConfig.pauseOnHover ? "#0ea5e9" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s", opacity: brandSliderConfig.autoplay ? 1 : 0.5, pointerEvents: brandSliderConfig.autoplay ? "auto" : "none" }}>
                      <input
                        type="checkbox"
                        checked={brandSliderConfig.pauseOnHover}
                        onChange={(e) => setBrandSliderConfig((p) => ({ ...p, pauseOnHover: e.target.checked }))}
                        style={{ accentColor: "#0ea5e9" }}
                      />
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-pause-circle" style={{ color: "#0ea5e9" }}></i>
                        <strong>Pause on Hover</strong>
                      </span>
                    </label>
                  </div>
                  <div style={{ marginTop: 12, maxWidth: 300 }}>
                    <label className="admin-form-label" style={{ fontSize: 13 }}>Interval (ms)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="number"
                        className="admin-form-input"
                        value={brandSliderConfig.autoplayDelay}
                        onChange={(e) => setBrandSliderConfig((p) => ({ ...p, autoplayDelay: Math.max(1000, Math.min(30000, Number(e.target.value) || 3000)) }))}
                        min={1000}
                        max={30000}
                        step={500}
                        disabled={!brandSliderConfig.autoplay}
                        style={{ opacity: brandSliderConfig.autoplay ? 1 : 0.5 }}
                      />
                      <span style={{ fontSize: 13, color: "var(--admin-text-muted, #94a3b8)", whiteSpace: "nowrap" }}>
                        = {(brandSliderConfig.autoplayDelay / 1000).toFixed(1)} detik
                      </span>
                    </div>
                  </div>
                </div>
              </LayoutSection>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}

          {/* ── Artikel Kesehatan ── */}
          {activeTab === "articles" && (
            <>
              <LayoutSection
                title="Artikel Kesehatan"
                icon="fas fa-newspaper"
                iconColor="#EC4899"
                badge={{ type: "db", label: "Database" }}
                manageLink={{ href: "/admin/artikel", label: "Kelola Artikel" }}
                info="Artikel diambil otomatis dari database (6 artikel terbaru). Anda hanya perlu mengatur heading section di bawah."
              >
                <div style={{ marginTop: 16 }}>
                  <div className="admin-form-grid admin-form-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Sub Title</label>
                      <input
                        className="admin-form-input"
                        value={blogHeading.subTitle}
                        onChange={(e) => setBlogHeading((p) => ({ ...p, subTitle: e.target.value }))}
                        placeholder="e.g., ARTIKEL KESEHATAN"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Heading</label>
                      <input
                        className="admin-form-input"
                        value={blogHeading.heading}
                        onChange={(e) => setBlogHeading((p) => ({ ...p, heading: e.target.value }))}
                        placeholder="e.g., Tips & Info Kesehatan"
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Paragraf</label>
                    <textarea
                      className="admin-form-textarea"
                      value={blogHeading.paragraph}
                      onChange={(e) => setBlogHeading((p) => ({ ...p, paragraph: e.target.value }))}
                      style={{ minHeight: 60 }}
                    />
                  </div>
                </div>
              </LayoutSection>

              <LayoutSection
                title="Konfigurasi Carousel Artikel"
                icon="fas fa-sliders-h"
                iconColor="#F59E0B"
                info="Atur perilaku carousel/slider untuk section Artikel Kesehatan di homepage."
              >
                <div style={{ marginTop: 16, padding: 16, background: "var(--admin-card-bg, #f8fafc)", borderRadius: 10, border: "1px solid var(--admin-border, #e2e8f0)" }}>
                  <label className="admin-form-label" style={{ marginBottom: 12, display: "block" }}>
                    <i className="fas fa-sliders-h" style={{ marginRight: 6 }}></i> Konfigurasi Carousel Artikel
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: blogSliderConfig.autoplay ? "rgba(59,130,246,0.1)" : "transparent", border: `1px solid ${blogSliderConfig.autoplay ? "#3b82f6" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                      <input
                        type="checkbox"
                        checked={blogSliderConfig.autoplay}
                        onChange={(e) => setBlogSliderConfig((p) => ({ ...p, autoplay: e.target.checked }))}
                        style={{ accentColor: "#3b82f6" }}
                      />
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-play-circle" style={{ color: "#3b82f6" }}></i>
                        <strong>Autoplay</strong>
                      </span>
                    </label>
                    <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: blogSliderConfig.loop ? "rgba(139,92,246,0.1)" : "transparent", border: `1px solid ${blogSliderConfig.loop ? "#8b5cf6" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s" }}>
                      <input
                        type="checkbox"
                        checked={blogSliderConfig.loop}
                        onChange={(e) => setBlogSliderConfig((p) => ({ ...p, loop: e.target.checked }))}
                        style={{ accentColor: "#8b5cf6" }}
                      />
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-sync-alt" style={{ color: "#8b5cf6" }}></i>
                        <strong>Loop</strong>
                      </span>
                    </label>
                    <label className="admin-form-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 16px", borderRadius: 8, background: blogSliderConfig.pauseOnHover ? "rgba(14,165,233,0.1)" : "transparent", border: `1px solid ${blogSliderConfig.pauseOnHover ? "#0ea5e9" : "var(--admin-border, #d1d5db)"}`, transition: "all 0.2s", opacity: blogSliderConfig.autoplay ? 1 : 0.5, pointerEvents: blogSliderConfig.autoplay ? "auto" : "none" }}>
                      <input
                        type="checkbox"
                        checked={blogSliderConfig.pauseOnHover}
                        onChange={(e) => setBlogSliderConfig((p) => ({ ...p, pauseOnHover: e.target.checked }))}
                        style={{ accentColor: "#0ea5e9" }}
                      />
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-pause-circle" style={{ color: "#0ea5e9" }}></i>
                        <strong>Pause on Hover</strong>
                      </span>
                    </label>
                  </div>
                  <div style={{ marginTop: 12, maxWidth: 300 }}>
                    <label className="admin-form-label" style={{ fontSize: 13 }}>Interval (ms)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="number"
                        className="admin-form-input"
                        value={blogSliderConfig.autoplayDelay}
                        onChange={(e) => setBlogSliderConfig((p) => ({ ...p, autoplayDelay: Math.max(1000, Math.min(30000, Number(e.target.value) || 4000)) }))}
                        min={1000}
                        max={30000}
                        step={500}
                        disabled={!blogSliderConfig.autoplay}
                        style={{ opacity: blogSliderConfig.autoplay ? 1 : 0.5 }}
                      />
                      <span style={{ fontSize: 13, color: "var(--admin-text-muted, #94a3b8)", whiteSpace: "nowrap" }}>
                        = {(blogSliderConfig.autoplayDelay / 1000).toFixed(1)} detik
                      </span>
                    </div>
                  </div>
                </div>
              </LayoutSection>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-save"></i> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </LayoutPageEditor>
  );
}
