import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { prisma } from "@/lib/prisma";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let products: { name: string; slug: string; image: string; shortDescription: string; category: { slug: string; title: string } }[] = [];
  let articles: { title: string; slug: string; image: string; excerpt: string; publishedAt: Date; category: { slug: string; title: string } }[] = [];

  if (query.length >= 2) {
    [products, articles] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "published",
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query.toLowerCase()] } },
          ],
        },
        select: {
          name: true,
          slug: true,
          image: true,
          shortDescription: true,
          category: { select: { slug: true, title: true } },
        },
        take: 20,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.blogPost.findMany({
        where: {
          status: "published",
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query.toLowerCase()] } },
          ],
        },
        select: {
          title: true,
          slug: true,
          image: true,
          excerpt: true,
          publishedAt: true,
          category: { select: { slug: true, title: true } },
        },
        take: 20,
        orderBy: { publishedAt: "desc" },
      }),
    ]);
  }

  const totalResults = products.length + articles.length;

  return (
    <>
      <Breadcrumb title="Hasil Pencarian" />
      <section className="th-blog-wrapper space-top space-extra-bottom">
        <div className="container">
          <div className="title-area">
            <h2 className="sec-title">
              {query
                ? `Hasil pencarian untuk "${query}" (${totalResults} ditemukan)`
                : "Masukkan kata kunci pencarian"}
            </h2>
          </div>

          {/* Products Section */}
          {products.length > 0 && (
            <>
              <h3 className="mb-30">Produk ({products.length})</h3>
              <div className="row gy-30 mb-60">
                {products.map((product) => (
                  <div className="col-md-6 col-lg-4 col-xl-3" key={product.slug}>
                    <div className="th-product list-view">
                      <div className="product-img">
                        <Link href={`/produk/detail/${product.slug}`}>
                          <img src={product.image} alt={product.name} />
                        </Link>
                      </div>
                      <div className="product-content">
                        <h3 className="product-title">
                          <Link href={`/produk/detail/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p className="product-text">
                          {product.shortDescription.length > 80
                            ? product.shortDescription.slice(0, 80) + "..."
                            : product.shortDescription}
                        </p>
                        <span className="badge bg-primary">{product.category.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Articles Section */}
          {articles.length > 0 && (
            <>
              <h3 className="mb-30">Artikel ({articles.length})</h3>
              <div className="row gy-30">
                {articles.map((article) => (
                  <div className="col-md-6 col-lg-4" key={article.slug}>
                    <div className="th-blog blog-single has-post-thumbnail">
                      <div className="blog-img">
                        <Link href={`/artikel/detail/${article.slug}`}>
                          <img src={article.image} alt={article.title} />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <div className="blog-meta">
                          <a href="#">
                            <i className="fa-sharp fa-solid fa-calendar-days"></i>
                            {article.publishedAt.toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </a>
                        </div>
                        <h4 className="blog-title">
                          <Link href={`/artikel/detail/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h4>
                        <p>
                          {article.excerpt.length > 100
                            ? article.excerpt.slice(0, 100) + "..."
                            : article.excerpt}
                        </p>
                        <span className="badge bg-primary">{article.category.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* No results */}
          {query.length >= 2 && totalResults === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3 d-block"></i>
              <h4>Tidak ada hasil ditemukan</h4>
              <p className="text-muted">
                Coba gunakan kata kunci yang berbeda atau lebih umum.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
