"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";
import ImageUpload from "@/components/admin/ImageUpload";

interface Props {
  settings: Record<string, string>;
}

const tabs = [
  { key: "instagram", label: "Instagram", icon: "fab fa-instagram" },
  { key: "facebook", label: "Facebook", icon: "fab fa-facebook" },
  { key: "tiktok", label: "TikTok", icon: "fab fa-tiktok" },
];

interface GallerySection {
  title: string;
  link: string;
  images: string[];
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function GaleriLayoutClient({ settings }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [instagram, setInstagram] = useState<GallerySection>(
    parseJSON(settings.galeri_instagram, { title: "Instagram Gallery", link: "", images: [] })
  );
  const [facebook, setFacebook] = useState<GallerySection>(
    parseJSON(settings.galeri_facebook, { title: "Facebook Gallery", link: "", images: [] })
  );
  const [tiktok, setTiktok] = useState<GallerySection>(
    parseJSON(settings.galeri_tiktok, { title: "TikTok Gallery", link: "", images: [] })
  );

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("galeri_instagram", JSON.stringify(instagram));
      formData.set("galeri_facebook", JSON.stringify(facebook));
      formData.set("galeri_tiktok", JSON.stringify(tiktok));
      const result = await updateLayoutSettings(
        ["galeri_instagram", "galeri_facebook", "galeri_tiktok"],
        formData,
        "/admin/layout-pages/galeri"
      );
      if (result.success) { toast.success("Galeri berhasil disimpan"); router.refresh(); }
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

  function renderGalleryEditor(
    section: GallerySection,
    setSection: React.Dispatch<React.SetStateAction<GallerySection>>,
    platform: string,
    platformColor: string,
    platformIcon: string
  ) {
    return (
      <>
        <LayoutSection
          title={`${platform} Gallery`}
          icon={platformIcon}
          iconColor={platformColor}
          badge={{ type: "json", label: "JSON Setting" }}
          info={`Galeri foto dari ${platform}. Upload gambar dan atur link profil.`}
        >
          <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Judul Section</label>
              <input
                className="admin-form-input"
                value={section.title}
                onChange={(e) => setSection((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Link Profil {platform}</label>
              <input
                className="admin-form-input"
                value={section.link}
                onChange={(e) => setSection((p) => ({ ...p, link: e.target.value }))}
                placeholder={`https://${platform.toLowerCase()}.com/seaquill`}
              />
            </div>
          </div>

          <label className="admin-form-label" style={{ marginBottom: 12, display: "block" }}>
            Gambar Galeri ({section.images.length} gambar)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {section.images.map((img, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <ImageUpload
                  name={`${platform.toLowerCase()}_${idx}`}
                  value={img}
                  onChange={(url) => setSection((p) => ({ ...p, images: p.images.map((im, i) => (i === idx ? url : im)) }))}
                  label={`Gambar ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setSection((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  style={{ position: "absolute", top: 4, right: 4, zIndex: 2 }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSection((p) => ({ ...p, images: [...p.images, ""] }))}
            className="admin-btn admin-btn-secondary"
            style={{ marginTop: 12 }}
          >
            <i className="fas fa-plus"></i> Tambah Gambar
          </button>
        </LayoutSection>
        {saveBtn}
      </>
    );
  }

  return (
    <LayoutPageEditor
      pageTitle="Galeri"
      pageSubtitle="Kelola galeri foto dari social media"
      pageIcon="fas fa-images"
      pageIconBg="linear-gradient(135deg, #E4405F, #C13584)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "instagram" && renderGalleryEditor(instagram, setInstagram, "Instagram", "#E4405F", "fab fa-instagram")}
          {activeTab === "facebook" && renderGalleryEditor(facebook, setFacebook, "Facebook", "#1877F2", "fab fa-facebook")}
          {activeTab === "tiktok" && renderGalleryEditor(tiktok, setTiktok, "TikTok", "#000000", "fab fa-tiktok")}
        </>
      )}
    </LayoutPageEditor>
  );
}
