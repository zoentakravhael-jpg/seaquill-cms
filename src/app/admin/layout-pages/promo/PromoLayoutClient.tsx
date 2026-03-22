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
  { key: "promo", label: "Promo", icon: "fas fa-percentage" },
  { key: "event", label: "Event", icon: "fas fa-calendar-alt" },
];

interface PromoItem {
  img: string;
  title: string;
  text: string;
}

interface PromoSection {
  subTitle: string;
  heading: string;
  headingNormal: string;
  items: PromoItem[];
}

interface EventItem {
  img: string;
  title: string;
  text: string;
  date: string;
  location: string;
  btnText: string;
  btnLink: string;
}

interface EventSection {
  subTitle: string;
  heading: string;
  headingNormal: string;
  paragraph: string;
  items: EventItem[];
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function PromoLayoutClient({ settings }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [promo, setPromo] = useState<PromoSection>(
    parseJSON(settings.promo_section, {
      subTitle: "Promo Spesial",
      heading: "Promo Menarik dari Seaquill!",
      headingNormal: "Nikmati Penawaran Terbaik,",
      items: [],
    })
  );

  const [event, setEvent] = useState<EventSection>(
    parseJSON(settings.event_section, {
      subTitle: "Event & Aktivitas",
      heading: "Event Seru Bersama Seaquill!",
      headingNormal: "Jangan Lewatkan,",
      paragraph: "",
      items: [],
    })
  );

  function updatePromoItem(idx: number, field: keyof PromoItem, val: string) {
    setPromo((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  function updateEventItem(idx: number, field: keyof EventItem, val: string) {
    setEvent((p) => ({ ...p, items: p.items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)) }));
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("promo_section", JSON.stringify(promo));
      formData.set("event_section", JSON.stringify(event));
      const result = await updateLayoutSettings(["promo_section", "event_section"], formData, "/admin/layout-pages/promo");
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
      pageTitle="Promo & Event"
      pageSubtitle="Kelola konten halaman promo dan event"
      pageIcon="fas fa-bullhorn"
      pageIconBg="linear-gradient(135deg, #F59E0B, #D97706)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "promo" && (
            <>
              <LayoutSection
                title="Section Promo"
                icon="fas fa-percentage"
                iconColor="#F59E0B"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Daftar promo yang ditampilkan di halaman Promo & Event."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={promo.subTitle} onChange={(e) => setPromo((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading (Normal)</label>
                    <input className="admin-form-input" value={promo.headingNormal} onChange={(e) => setPromo((p) => ({ ...p, headingNormal: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-form-label">Heading (Bold)</label>
                  <input className="admin-form-input" value={promo.heading} onChange={(e) => setPromo((p) => ({ ...p, heading: e.target.value }))} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {promo.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="admin-card-title">Promo {idx + 1}</span>
                        <button type="button" onClick={() => setPromo((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm"><i className="fas fa-trash"></i></button>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-group">
                          <label className="admin-form-label">Judul</label>
                          <input className="admin-form-input" value={item.title} onChange={(e) => updatePromoItem(idx, "title", e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.text} onChange={(e) => updatePromoItem(idx, "text", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <ImageUpload name={`promo_${idx}`} value={item.img} onChange={(url) => updatePromoItem(idx, "img", url)} label="Gambar" />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setPromo((p) => ({ ...p, items: [...p.items, { img: "", title: "", text: "" }] }))} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Promo
                </button>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "event" && (
            <>
              <LayoutSection
                title="Section Event"
                icon="fas fa-calendar-alt"
                iconColor="#6366F1"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Daftar event & aktivitas yang ditampilkan di halaman Promo & Event."
              >
                <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={event.subTitle} onChange={(e) => setEvent((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading (Normal)</label>
                    <input className="admin-form-input" value={event.headingNormal} onChange={(e) => setEvent((p) => ({ ...p, headingNormal: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-form-label">Heading (Bold)</label>
                  <input className="admin-form-input" value={event.heading} onChange={(e) => setEvent((p) => ({ ...p, heading: e.target.value }))} />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-form-label">Paragraf</label>
                  <textarea className="admin-form-textarea" value={event.paragraph} onChange={(e) => setEvent((p) => ({ ...p, paragraph: e.target.value }))} style={{ minHeight: 60 }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {event.items.map((item, idx) => (
                    <div key={idx} className="admin-card" style={{ marginBottom: 0 }}>
                      <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="admin-card-title">Event {idx + 1}</span>
                        <button type="button" onClick={() => setEvent((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} className="admin-btn admin-btn-danger admin-btn-sm"><i className="fas fa-trash"></i></button>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Judul</label>
                            <input className="admin-form-input" value={item.title} onChange={(e) => updateEventItem(idx, "title", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Tanggal</label>
                            <input className="admin-form-input" value={item.date} onChange={(e) => updateEventItem(idx, "date", e.target.value)} placeholder="21 Agustus 2025" />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Lokasi</label>
                          <input className="admin-form-input" value={item.location} onChange={(e) => updateEventItem(idx, "location", e.target.value)} placeholder="Instagram Live" />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Deskripsi</label>
                          <textarea className="admin-form-textarea" value={item.text} onChange={(e) => updateEventItem(idx, "text", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                        <div className="admin-form-grid admin-form-grid-2">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Button Text</label>
                            <input className="admin-form-input" value={item.btnText} onChange={(e) => updateEventItem(idx, "btnText", e.target.value)} placeholder="Lihat Detail" />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">Button Link</label>
                            <input className="admin-form-input" value={item.btnLink} onChange={(e) => updateEventItem(idx, "btnLink", e.target.value)} placeholder="#" />
                          </div>
                        </div>
                        <ImageUpload name={`event_${idx}`} value={item.img} onChange={(url) => updateEventItem(idx, "img", url)} label="Gambar" />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setEvent((p) => ({ ...p, items: [...p.items, { img: "", title: "", text: "", date: "", location: "", btnText: "Lihat Detail", btnLink: "#" }] }))} className="admin-btn admin-btn-secondary" style={{ marginTop: 12 }}>
                  <i className="fas fa-plus"></i> Tambah Event
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
