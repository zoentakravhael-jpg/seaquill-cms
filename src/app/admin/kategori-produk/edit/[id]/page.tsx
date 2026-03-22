import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProductCategory } from "../../../actions";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditKategoriProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.productCategory.findUnique({ where: { id: parseInt(id) } });
  if (!category) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/kategori-produk" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Kategori Produk</h1>
            <p className="admin-page-subtitle">{category.title}</p>
          </div>
        </div>
      </div>
      <div className="admin-card" style={{ maxWidth: 640 }}>
        <div className="admin-card-body">
          <CategoryForm
            initialData={category}
            action={updateProductCategory}
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
