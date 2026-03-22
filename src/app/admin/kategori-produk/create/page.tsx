import Link from "next/link";
import { createProductCategory } from "../../actions";
import CategoryForm from "@/components/admin/CategoryForm";

export default function CreateKategoriProdukPage() {
  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/kategori-produk" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Kategori Produk</h1>
            <p className="admin-page-subtitle">Buat kategori produk baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card" style={{ maxWidth: 640 }}>
        <div className="admin-card-body">
          <CategoryForm
            action={createProductCategory}
            backHref="/admin/kategori-produk"
            showIcon
            showDescription
            entityName="Kategori Produk"
          />
        </div>
      </div>
    </>
  );
}
