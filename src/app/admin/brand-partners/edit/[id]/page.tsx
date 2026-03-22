import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBrandPartner } from "../../../actions";
import BrandPartnerForm from "@/components/admin/BrandPartnerForm";

export default async function EditBrandPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brandPartner.findUnique({ where: { id: parseInt(id) } });
  if (!brand) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/brand-partners" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Brand Partner</h1>
            <p className="admin-page-subtitle">{brand.name}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <BrandPartnerForm initialData={brand} action={updateBrandPartner} backHref="/admin/brand-partners" />
        </div>
      </div>
    </>
  );
}
