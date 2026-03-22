import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePromoItem } from "../../../actions";
import PromoItemForm from "@/components/admin/PromoItemForm";

export default async function EditPromoItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.promoItem.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/promo" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Promo</h1>
            <p className="admin-page-subtitle">{item.title}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <PromoItemForm initialData={item} action={updatePromoItem} backHref="/admin/promo" />
        </div>
      </div>
    </>
  );
}
