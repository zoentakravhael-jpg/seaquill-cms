"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";

interface Props {
  settings: Record<string, string>;
  categoryCount: number;
  postCount: number;
}

const tabs = [
  { key: "heading", label: "Heading Halaman", icon: "fas fa-heading" },
  { key: "articles", label: "Daftar Artikel", icon: "fas fa-file-alt" },
  { key: "sidebar", label: "Sidebar", icon: "fas fa-columns" },
];

interface PageHeading {
  breadcrumbTitle: string;
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function ArtikelLayoutClient({ settings, categoryCount, postCount }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [heading, setHeading] = useState<PageHeading>(
    parseJSON(settings.artikel_page_heading, { breadcrumbTitle: "Blog Page" })
  );

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("artikel_page_heading", JSON.stringify(heading));
      const result = await updateLayoutSettings(["artikel_page_heading"], formData, "/admin/layout-pages/artikel");
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
      pageTitle="Artikel"
      pageSubtitle="Kelola tampilan halaman daftar artikel"
      pageIcon="fas fa-file-alt"
      pageIconBg="linear-gradient(135deg, #EC4899, #BE185D)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "heading" && (
            <>
              <LayoutSection
                title="Heading Halaman Artikel"
                icon="fas fa-heading"
                iconColor="#EC4899"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Konfigurasi heading breadcrumb halaman artikel."
              >
                <div className="admin-form-group">
                  <label className="admin-form-label">Judul Breadcrumb</label>
                  <input className="admin-form-input" value={heading.breadcrumbTitle} onChange={(e) => setHeading((p) => ({ ...p, breadcrumbTitle: e.target.value }))} placeholder="Blog Page" />
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "articles" && (
            <LayoutSection
              title="Daftar Artikel"
              icon="fas fa-file-alt"
              iconColor="#3B82F6"
              badge={{ type: "db", label: "Database" }}
              manageLink={{ href: "/admin/artikel", label: "Kelola Artikel" }}
              info={`Saat ini ada <strong>${postCount}</strong> artikel published dalam <strong>${categoryCount}</strong> kategori. Artikel ditampilkan dalam grid layout 8+4 kolom (konten + sidebar).`}
            />
          )}

          {activeTab === "sidebar" && (
            <LayoutSection
              title="Sidebar Artikel"
              icon="fas fa-columns"
              iconColor="#F59E0B"
              badge={{ type: "db", label: "Database" }}
              info="Sidebar menampilkan: <strong>Search box</strong>, <strong>Kategori populer</strong> (dari BlogCategory), dan <strong>Artikel terbaru</strong> (5 artikel terbaru otomatis). Semua data diambil otomatis dari database."
            >
              <div className="admin-layout-info-box" style={{ marginTop: 12 }}>
                <i className="fas fa-lightbulb"></i>
                <span>Untuk mengubah kategori yang tampil, kelola melalui <a href="/admin/kategori-artikel" style={{ color: "var(--admin-primary)" }}>Kategori Artikel</a>.</span>
              </div>
            </LayoutSection>
          )}
        </>
      )}
    </LayoutPageEditor>
  );
}
