import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateGalleryItem } from "../../../actions";
import GalleryItemForm from "@/components/admin/GalleryItemForm";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/gallery" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Gallery Item</h1>
            <p className="admin-page-subtitle">{item.caption || `Item #${item.id}`}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <GalleryItemForm initialData={item} action={updateGalleryItem} backHref="/admin/gallery" />
        </div>
      </div>
    </>
  );
}
