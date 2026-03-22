import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductGrid from "@/components/shared/ProductGrid";
import Pagination from "@/components/shared/Pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ kategori: string }>;
}

export default async function ProductCategoryPage({ params }: Props) {
  const { kategori } = await params;

  // Special virtual categories
  const specialCategories: Record<string, { title: string; where: object }> = {
    "best-seller": {
      title: "Best Seller",
      where: { isBestSeller: true },
    },
    "produk-baru": {
      title: "Produk Baru",
      where: { isNew: true },
    },
  };

  let title: string;
  let products;

  if (specialCategories[kategori]) {
    title = specialCategories[kategori].title;
    products = await prisma.product.findMany({
      where: { ...specialCategories[kategori].where, status: "published", deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, image: true, slug: true, tags: true, isBestSeller: true, isNew: true },
    });
  } else {
    const category = await prisma.productCategory.findUnique({
      where: { slug: kategori, deletedAt: null },
    });

    if (!category) {
      notFound();
    }

    title = category.title;
    products = await prisma.product.findMany({
      where: { categoryId: category.id, status: "published", deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, image: true, slug: true, tags: true, isBestSeller: true, isNew: true },
    });
  }

  return (
    <>
      <Breadcrumb title="Shop Page" />

      <section className="space-top space-extra-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="title-area text-center">
                <span className="sub-title">Produk Sea-Quill</span>
                <h2 className="sec-title">
                  {title}{" "}
                  <span className="fw-normal">
                    Terbaik untuk Kesehatan Anda
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="gallery-divider"></div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-5">
              <p className="sec-text fs-18">Belum ada produk di kategori ini.</p>
            </div>
          )}
          <Pagination basePath={`/produk/${kategori}`} />
        </div>
      </section>
    </>
  );
}
