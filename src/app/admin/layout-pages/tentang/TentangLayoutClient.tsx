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
  { key: "about", label: "About Area", icon: "fas fa-info-circle" },
  { key: "cards", label: "Feature Cards", icon: "fas fa-th-large" },
  { key: "project", label: "Project Slider", icon: "fas fa-images" },
];

interface AboutSection {
  subTitle: string;
  heading: string;
  headingNormal: string;
  paragraph: string;
  checklist: string[];
  aboutImage: string;
  videoImage: string;
  videoUrl: string;
}

interface FeatureCard {
  title: string;
  text: string;
  btnText: string;
  href: string;
}

interface ProjectSlider {
  subTitle: string;
  heading: string;
  headingNormal: string;
  paragraph: string;
  sideParagraph: string;
  items: { img: string; title: string; text: string }[];
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function TentangLayoutClient({ settings }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [about, setAbout] = useState<AboutSection>(
    parseJSON(settings.tentang_about_section, {
      subTitle: "Tentang Seaquill",
      heading: "untuk Hidup Sehat dan Berkualitas",
      headingNormal: "Pilihan Tepat,",
      paragraph: "",
      checklist: [""],
      aboutImage: "/assets/img/normal/about_4_1.jpg",
      videoImage: "/assets/img/normal/about-video.jpg",
      videoUrl: "https://www.youtube.com/watch?v=_sI_Ps7JSEk",
    })
  );

  const [cards, setCards] = useState<FeatureCard[]>(
    parseJSON(settings.tentang_feature_cards, [
      { title: "", text: "", btnText: "", href: "" },
      { title: "", text: "", btnText: "", href: "" },
      { title: "", text: "", btnText: "", href: "" },
    ])
  );

  const [project, setProject] = useState<ProjectSlider>(
    parseJSON(settings.tentang_project_slider, {
      subTitle: "Tentang Sea-Quill",
      heading: "Kesehatan Berkualitas Setiap Hari",
      headingNormal: "Solusi Suplemen Modern,",
      paragraph: "",
      sideParagraph: "",
      items: [],
    })
  );

  function updateCard(idx: number, field: keyof FeatureCard, val: string) {
    setCards((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
  }

  function updateProjectItem(idx: number, field: string, val: string) {
    setProject((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    }));
  }

  function addProjectItem() {
    setProject((prev) => ({ ...prev, items: [...prev.items, { img: "", title: "", text: "" }] }));
  }

  function removeProjectItem(idx: number) {
    setProject((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("tentang_about_section", JSON.stringify(about));
      formData.set("tentang_feature_cards", JSON.stringify(cards));
      formData.set("tentang_project_slider", JSON.stringify(project));

      const result = await updateLayoutSettings(
        ["tentang_about_section", "tentang_feature_cards", "tentang_project_slider"],
        formData,
        "/admin/layout-pages/tentang"
      );
      if (result.success) { toast.success("Tentang berhasil disimpan"); router.refresh(); }
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
      pageTitle="Tentang Seaquill"
      pageSubtitle="Kelola konten halaman Tentang Seaquill"
      pageIcon="fas fa-building"
      pageIconBg="linear-gradient(135deg, #10B981, #059669)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "about" && (
            <>
              <LayoutSection
                title="About Area"
                icon="fas fa-info-circle"
                iconColor="#10B981"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Section utama halaman Tentang: gambar, heading, paragraf, checklist, dan video."
              >
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={about.subTitle} onChange={(e) => setAbout((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading (Normal)</label>
                    <input className="admin-form-input" value={about.headingNormal} onChange={(e) => setAbout((p) => ({ ...p, headingNormal: e.target.value }))} placeholder="Bagian heading yang normal weight" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Heading (Bold)</label>
                  <input className="admin-form-input" value={about.heading} onChange={(e) => setAbout((p) => ({ ...p, heading: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Paragraf</label>
                  <textarea className="admin-form-textarea" value={about.paragraph} onChange={(e) => setAbout((p) => ({ ...p, paragraph: e.target.value }))} style={{ minHeight: 80 }} />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Checklist Items</label>
                  {about.checklist.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input className="admin-form-input" value={item} onChange={(e) => setAbout((p) => ({ ...p, checklist: p.checklist.map((c, i) => (i === idx ? e.target.value : c)) }))} style={{ flex: 1 }} />
                      <button type="button" onClick={() => setAbout((p) => ({ ...p, checklist: p.checklist.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm"><i className="fas fa-times"></i></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setAbout((p) => ({ ...p, checklist: [...p.checklist, ""] }))} className="admin-btn admin-btn-secondary admin-btn-sm"><i className="fas fa-plus"></i> Tambah</button>
                </div>

                <div className="admin-form-grid admin-form-grid-2">
                  <ImageUpload name="about_img" value={about.aboutImage} onChange={(url) => setAbout((p) => ({ ...p, aboutImage: url }))} label="Gambar About" />
                  <ImageUpload name="video_img" value={about.videoImage} onChange={(url) => setAbout((p) => ({ ...p, videoImage: url }))} label="Gambar Video" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Video URL (YouTube)</label>
                  <input className="admin-form-input" value={about.videoUrl} onChange={(e) => setAbout((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "cards" && (
            <>
              <LayoutSection
                title="Feature Cards (3 Cards)"
                icon="fas fa-th-large"
                iconColor="#3B82F6"
                badge={{ type: "json", label: "JSON Setting" }}
                info="3 kartu fitur di bawah about area."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {cards.map((card, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header"><span className="admin-card-title">Card {idx + 1}</span></div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Judul</label>
                            <input className="admin-form-input" value={card.title} onChange={(e) => updateCard(idx, "title", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Button Text</label>
                            <input className="admin-form-input" value={card.btnText} onChange={(e) => updateCard(idx, "btnText", e.target.value)} />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={card.text} onChange={(e) => updateCard(idx, "text", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Link (href)</label>
                          <input className="admin-form-input" value={card.href} onChange={(e) => updateCard(idx, "href", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "project" && (
            <>
              <LayoutSection
                title="Project Slider"
                icon="fas fa-images"
                iconColor="#F59E0B"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Section slider di bagian bawah halaman Tentang."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={project.subTitle} onChange={(e) => setProject((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading (Normal)</label>
                    <input className="admin-form-input" value={project.headingNormal} onChange={(e) => setProject((p) => ({ ...p, headingNormal: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Heading (Bold)</label>
                  <input className="admin-form-input" value={project.heading} onChange={(e) => setProject((p) => ({ ...p, heading: e.target.value }))} />
                </div>
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Paragraf Kiri</label>
                    <textarea className="admin-form-textarea" value={project.paragraph} onChange={(e) => setProject((p) => ({ ...p, paragraph: e.target.value }))} style={{ minHeight: 80 }} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Paragraf Kanan</label>
                    <textarea className="admin-form-textarea" value={project.sideParagraph} onChange={(e) => setProject((p) => ({ ...p, sideParagraph: e.target.value }))} style={{ minHeight: 80 }} />
                  </div>
                </div>

                <label className="admin-form-label" style={{ marginTop: 16, marginBottom: 8, display: "block" }}>Slide Items</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {project.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="admin-card-title">Slide {idx + 1}</span>
                        <button type="button" onClick={() => removeProjectItem(idx)} className="admin-btn admin-btn-danger admin-btn-sm"><i className="fas fa-trash"></i></button>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-group">
                          <label className="admin-form-label">Judul</label>
                          <input className="admin-form-input" value={item.title} onChange={(e) => updateProjectItem(idx, "title", e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.text} onChange={(e) => updateProjectItem(idx, "text", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <ImageUpload name={`project_${idx}`} value={item.img} onChange={(url) => updateProjectItem(idx, "img", url)} label="Gambar Slide" />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addProjectItem} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Slide
                </button>
              </LayoutSection>
              {saveBtn}
            </>
          )}
        </>
      )}
    </LayoutPageEditor>
  );
}
