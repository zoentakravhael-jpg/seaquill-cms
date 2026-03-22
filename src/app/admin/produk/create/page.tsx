import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "../../actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function CreateProdukPage() {
  const categories = await prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/produk" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Produk</h1>
            <p className="admin-page-subtitle">Buat produk baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <ProductForm
            categories={categories}
            action={createProduct}
            backHref="/admin/produk"
          />
        </div>
      </div>
    </>
  );
}
