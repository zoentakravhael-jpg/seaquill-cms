import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductGrid from "@/components/shared/ProductGrid";
import Pagination from "@/components/shared/Pagination";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Produk Sea-Quill | Suplemen Kesehatan Berkualitas",
  description: "Jelajahi berbagai pilihan suplemen kesehatan Sea-Quill berkualitas premium. Produk bersertifikat BPOM dan Halal untuk kesehatan jantung, kulit, sendi, dan daya tahan tubuh.",
  openGraph: {
    title: "Produk Sea-Quill | Suplemen Kesehatan Berkualitas",
    description: "Jelajahi berbagai pilihan suplemen kesehatan Sea-Quill berkualitas premium.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function ProdukPage() {
  const [categories, products] = await Promise.all([
    prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { status: "published", deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, image: true, slug: true, tags: true, isBestSeller: true, isNew: true },
    }),
  ]);

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
                  Pilihan Suplemen{" "}
                  <span className="fw-normal">
                    Terbaik untuk Kesehatan Anda
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="gallery-divider"></div>

          {/* Category Cards */}
          <section
            className="position-relative overflow-hidden space overflow-hidden"
            id="service-sec"
          >
            <div className="container">
              <div className="row gy-4">
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="col-md-6 col-lg-4 col-xxl-3"
                  >
                    <div className="service-card style2">
                      <div className="box-content">
                        <div className="box-icon">
                          <Image src={cat.icon} alt={cat.title} width={64} height={64} />
                        </div>
                        <h3 className="box-title">
                          <Link href={`/produk/${cat.slug}`}>{cat.title}</Link>
                        </h3>
                        <p className="box-text">{cat.description}</p>
                        <Link
                          href={`/produk/${cat.slug}`}
                          className="th-btn black-border"
                        >
                          Selengkapnya{" "}
                          <i className="fa-light fa-arrow-right-long ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="gallery-divider"></div>

          {/* Product Grid with Filter */}
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-5">
              <p className="sec-text fs-18">Belum ada produk yang tersedia.</p>
            </div>
          )}
          <Pagination basePath="/produk" />
        </div>
      </section>
    </>
  );
}
