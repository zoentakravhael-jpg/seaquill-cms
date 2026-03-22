"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LayoutPageEditor, { LayoutSection } from "@/components/admin/LayoutPageEditor";
import { updateLayoutSettings } from "../../actions";

interface Props {
  settings: Record<string, string>;
  categoryCount: number;
  productCount: number;
}

const tabs = [
  { key: "heading", label: "Heading Halaman", icon: "fas fa-heading" },
  { key: "categories", label: "Kategori Produk", icon: "fas fa-tags" },
  { key: "products", label: "Daftar Produk", icon: "fas fa-box-open" },
];

interface PageHeading {
  subTitle: string;
  heading: string;
  headingNormal: string;
}

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default function ProdukLayoutClient({ settings, categoryCount, productCount }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [heading, setHeading] = useState<PageHeading>(
    parseJSON(settings.produk_page_heading, {
      subTitle: "Produk Sea-Quill",
      heading: "Pilihan Suplemen",
      headingNormal: "Terbaik untuk Kesehatan Anda",
    })
  );

  async function handleSave() {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("produk_page_heading", JSON.stringify(heading));
      const result = await updateLayoutSettings(["produk_page_heading"], formData, "/admin/layout-pages/produk");
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
      pageTitle="Produk Seaquill"
      pageSubtitle="Kelola tampilan halaman daftar produk"
      pageIcon="fas fa-box-open"
      pageIconBg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
      tabs={tabs}
    >
      {(activeTab) => (
        <>
          {activeTab === "heading" && (
            <>
              <LayoutSection
                title="Heading Halaman Produk"
                icon="fas fa-heading"
                iconColor="#8B5CF6"
                badge={{ type: "json", label: "JSON Setting" }}
                info="Judul dan subtitle yang muncul di bagian atas halaman produk."
              >
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sub Title</label>
                    <input className="admin-form-input" value={heading.subTitle} onChange={(e) => setHeading((p) => ({ ...p, subTitle: e.target.value }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Heading (Bold)</label>
                    <input className="admin-form-input" value={heading.heading} onChange={(e) => setHeading((p) => ({ ...p, heading: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Heading (Normal)</label>
                  <input className="admin-form-input" value={heading.headingNormal} onChange={(e) => setHeading((p) => ({ ...p, headingNormal: e.target.value }))} />
                </div>
              </LayoutSection>
              {saveBtn}
            </>
          )}

          {activeTab === "categories" && (
            <LayoutSection
              title="Kategori Produk"
              icon="fas fa-tags"
              iconColor="#10B981"
              badge={{ type: "db", label: "Database" }}
              manageLink={{ href: "/admin/kategori-produk", label: "Kelola Kategori" }}
              info={`Saat ini ada <strong>${categoryCount}</strong> kategori produk. Kategori ditampilkan sebagai card grid di halaman produk. Kelola melalui halaman CRUD terpisah.`}
            />
          )}

          {activeTab === "products" && (
            <LayoutSection
              title="Daftar Produk"
              icon="fas fa-box-open"
              iconColor="#3B82F6"
              badge={{ type: "db", label: "Database" }}
              manageLink={{ href: "/admin/produk", label: "Kelola Produk" }}
              info={`Saat ini ada <strong>${productCount}</strong> produk published. Produk ditampilkan dalam grid dengan filter di bawah section kategori. Kelola melalui halaman CRUD terpisah.`}
            />
          )}
        </>
      )}
    </LayoutPageEditor>
  );
}
