import Link from "next/link";
import { createBlogCategory } from "../../actions";
import CategoryForm from "@/components/admin/CategoryForm";

export default function CreateKategoriArtikelPage() {
  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/kategori-artikel" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Kategori Artikel</h1>
            <p className="admin-page-subtitle">Buat kategori artikel baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card" style={{ maxWidth: 640 }}>
        <div className="admin-card-body">
          <CategoryForm
            action={createBlogCategory}
            backHref="/admin/kategori-artikel"
            entityName="Kategori Artikel"
          />
        </div>
      </div>
    </>
  );
}
