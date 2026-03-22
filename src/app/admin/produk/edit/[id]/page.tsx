import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../../actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: parseInt(id) } }),
    prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/produk" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Produk</h1>
            <p className="admin-page-subtitle">{product.name}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <ProductForm
            categories={categories}
            initialData={product}
            action={updateProduct}
            backHref="/admin/produk"
          />
        </div>
      </div>
    </>
  );
}
