import Link from "next/link";
import { createBrandPartner } from "../../actions";
import BrandPartnerForm from "@/components/admin/BrandPartnerForm";

export default function CreateBrandPartnerPage() {
  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/brand-partners" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Brand Partner</h1>
            <p className="admin-page-subtitle">Tambahkan brand partner baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <BrandPartnerForm action={createBrandPartner} backHref="/admin/brand-partners" />
        </div>
      </div>
    </>
  );
}
