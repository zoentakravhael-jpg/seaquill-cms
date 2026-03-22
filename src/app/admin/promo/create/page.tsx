import Link from "next/link";
import { createPromoItem } from "../../actions";
import PromoItemForm from "@/components/admin/PromoItemForm";

export default function CreatePromoItemPage() {
  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/promo" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Promo</h1>
            <p className="admin-page-subtitle">Buat promo baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <PromoItemForm action={createPromoItem} backHref="/admin/promo" />
        </div>
      </div>
    </>
  );
}
