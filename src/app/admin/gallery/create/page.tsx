import Link from "next/link";
import { createGalleryItem } from "../../actions";
import GalleryItemForm from "@/components/admin/GalleryItemForm";

export default function CreateGalleryItemPage() {
  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/gallery" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Gallery Item</h1>
            <p className="admin-page-subtitle">Tambah item baru ke galeri</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <GalleryItemForm action={createGalleryItem} backHref="/admin/gallery" />
        </div>
      </div>
    </>
  );
}
