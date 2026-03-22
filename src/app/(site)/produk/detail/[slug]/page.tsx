import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductImageGallery from "@/components/shared/ProductImageGallery";
import RelatedProductsSlider from "@/components/shared/RelatedProductsSlider";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, status: "published", deletedAt: null },
    include: { category: true },
  });

  if (!product) return notFound();

  const [relatedProducts, settings] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "published",
        deletedAt: null,
      },
      take: 6,
      select: { name: true, image: true, slug: true },
    }),
    getSiteSettings(),
  ]);

  const tokopediaUrl = settings.social_tokopedia || "https://www.tokopedia.com/seaquill";
  const shopeeUrl = settings.social_shopee || "https://shopee.co.id/seaquill";

  const ratingPercent = (product.rating / 5) * 100;

  return (
    <>
      <Breadcrumb title="Shop Details" />

      <section className="product-details overflow-hidden space-top space-extra-bottom">
        <div className="container">
          <div className="row gx-60">
            <div className="col-lg-6">
              <ProductImageGallery images={product.images} />
            </div>
            <div className="col-lg-6 align-self-center">
              <div className="product-about">
                <p className="price">
                  <del></del>
                </p>
                <h4 className="product-title">{product.name}</h4>
                <div className="product-rating">
                  <div
                    className="star-rating"
                    role="img"
                    aria-label={`Rated ${product.rating.toFixed(2)} out of 5`}
                  >
                    <span style={{ width: `${ratingPercent}%` }}>
                      Rated <strong className="rating">{product.rating.toFixed(2)}</strong> out of 5
                      based on <span className="rating">1</span> customer rating
                    </span>
                  </div>
                  <a href="#" className="woocommerce-review-link">
                    (<span className="count">{product.reviewCount}</span> customer reviews)
                  </a>
                </div>
                <p className="text">
                  {product.shortDescription}
                </p>
                {product.features.length > 0 && (
                  <div className="checklist style4">
                    <ul>
                      {product.features.map((feature, i) => (
                        <li key={i}>
                          <i className="fa-regular fa-check"></i> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="actions">
                  <div className="quantity"></div>
                  <div className="col-auto">
                    <span className="sub-title text-anime-style-2">
                      Temukan di Marketplace kami :{" "}
                    </span>
                    <div className="header-button d-none d-lg-block">
                      <a
                        href={tokopediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "0 6px" }}
                      >
                        <img
                          src="/assets/img/tokopedia-btn.png"
                          alt="Tokopedia"
                          style={{ height: "45px", width: "auto" }}
                        />
                      </a>
                      <a
                        href={shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "0 6px" }}
                      >
                        <img
                          src="/assets/img/shopee-btn.png"
                          alt="Shopee"
                          style={{ height: "30px", width: "auto" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="product_meta">
                  <span className="sku_wrapper">
                    SKU: <span className="sku">{product.sku}</span>
                  </span>
                  <span className="posted_in">
                    Kategori :{" "}
                    <Link href={`/produk/${product.category.slug}`} rel="tag">
                      {product.category.title}
                    </Link>
                  </span>
                  {product.tags.length > 0 && (
                    <span>
                      Tag:{" "}
                      <Link href="/produk">
                        {product.tags.join(", ")}
                      </Link>
                    </span>
                  )}
                  <span>
                    Stok: <a href="#">{product.stock ? "Tersedia" : "Habis"}</a>
                  </span>
                  <div className="product-cards"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <ul
            className="nav product-tab-style1"
            id="productTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <a
                className="nav-link th-btn"
                id="description-tab"
                data-bs-toggle="tab"
                href="#description"
                role="tab"
                aria-controls="description"
                aria-selected="false"
              >
                Deskripsi
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link th-btn"
                id="additional-tab"
                data-bs-toggle="tab"
                href="#additional"
                role="tab"
                aria-controls="additional"
                aria-selected="false"
              >
                Informasi Tambahan
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link th-btn active"
                id="reviews-tab"
                data-bs-toggle="tab"
                href="#reviews"
                role="tab"
                aria-controls="reviews"
                aria-selected="true"
              >
                Ulasan ({product.reviewCount})
              </a>
            </li>
          </ul>
          <div className="tab-content" id="productTabContent">
            <div
              className="tab-pane fade"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <h3 className="box-title">Deskripsi Produk</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
            <div
              className="tab-pane fade"
              id="additional"
              role="tabpanel"
              aria-labelledby="additional-tab"
            >
              <h3 className="box-title">Informasi Tambahan</h3>
              <ul>
                {product.composition && <li><b>Komposisi:</b> {product.composition}</li>}
                {product.dosage && <li><b>Aturan Pakai:</b> {product.dosage}</li>}
                <li>Kategori: {product.category.title}</li>
                <li>SKU: {product.sku}</li>
              </ul>
            </div>
            <div
              className="tab-pane fade show active"
              id="reviews"
              role="tabpanel"
              aria-labelledby="reviews-tab"
            >
              <div className="woocommerce-Reviews">
                <div className="th-comments-wrap">
                  <ul className="comment-list">
                    <li className="review th-comment-item">
                      <div className="th-post-comment">
                        <div className="comment-avater">
                          <img
                            src="/assets/img/blog/comment-author-1.jpg"
                            alt="Comment Author"
                          />
                        </div>
                        <div className="comment-content">
                          <h4 className="name">Ika Sari</h4>
                          <span className="commented-on">
                            <i className="far fa-clock"></i>22 April, 2025
                          </span>
                          <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                          >
                            <span style={{ width: "100%" }}>
                              Rated{" "}
                              <strong className="rating">5.00</strong> out
                              of 5 based on{" "}
                              <span className="rating">1</span> customer
                              rating
                            </span>
                          </div>
                          <p>
                            Sudah 3 bulan konsumsi Sea-Quill Omega 3 Salmon,
                            kolesterol turun dan badan terasa lebih fit!
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="review th-comment-item">
                      <div className="th-post-comment">
                        <div className="comment-avater">
                          <img
                            src="/assets/img/blog/comment-author-3.jpg"
                            alt="Comment Author"
                          />
                        </div>
                        <div className="comment-content">
                          <h4 className="name">Budi Purnama</h4>
                          <span className="commented-on">
                            <i className="far fa-clock"></i>26 April, 2025
                          </span>
                          <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                          >
                            <span style={{ width: "100%" }}>
                              Rated{" "}
                              <strong className="rating">5.00</strong> out
                              of 5 based on{" "}
                              <span className="rating">1</span> customer
                              rating
                            </span>
                          </div>
                          <p className="text">
                            Membantu banget untuk kesehatan jantung, kualitas
                            tidur juga makin baik.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="review th-comment-item">
                      <div className="th-post-comment">
                        <div className="comment-avater">
                          <img
                            src="/assets/img/blog/comment-author-1.jpg"
                            alt="Comment Author"
                          />
                        </div>
                        <div className="comment-content">
                          <h4 className="name">Ika Sari</h4>
                          <span className="commented-on">
                            <i className="far fa-clock"></i>22 April, 2025
                          </span>
                          <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                          >
                            <span style={{ width: "100%" }}>
                              Rated{" "}
                              <strong className="rating">5.00</strong> out
                              of 5 based on{" "}
                              <span className="rating">1</span> customer
                              rating
                            </span>
                          </div>
                          <p>
                            Sudah 3 bulan konsumsi Sea-Quill Omega 3 Salmon,
                            kolesterol turun dan badan terasa lebih fit!
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="review th-comment-item">
                      <div className="th-post-comment">
                        <div className="comment-avater">
                          <img
                            src="/assets/img/blog/comment-author-3.jpg"
                            alt="Comment Author"
                          />
                        </div>
                        <div className="comment-content">
                          <h4 className="name">Budi Purnama</h4>
                          <span className="commented-on">
                            <i className="far fa-clock"></i>26 April, 2025
                          </span>
                          <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                          >
                            <span style={{ width: "100%" }}>
                              Rated{" "}
                              <strong className="rating">5.00</strong> out
                              of 5 based on{" "}
                              <span className="rating">1</span> customer
                              rating
                            </span>
                          </div>
                          <p className="text">
                            Membantu banget untuk kesehatan jantung, kualitas
                            tidur juga makin baik.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                {/* Review Form */}
                <div className="th-comment-form">
                  <div className="form-title">
                    <h3 className="blog-inner-title">Tulis Ulasan</h3>
                  </div>
                  <div className="row">
                    <div className="form-group rating-select d-flex align-items-center">
                      <label>Rating Anda</label>
                      <p className="stars">
                        <span>
                          <a className="star-1" href="#">1</a>
                          <a className="star-2" href="#">2</a>
                          <a className="star-3" href="#">3</a>
                          <a className="star-4" href="#">4</a>
                          <a className="star-5" href="#">5</a>
                        </span>
                      </p>
                    </div>
                    <div className="col-12 form-group">
                      <textarea
                        placeholder="Tulis Ulasan"
                        className="form-control"
                      ></textarea>
                      <i className="text-title far fa-pencil-alt"></i>
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        placeholder="Nama"
                        className="form-control"
                      />
                      <i className="text-title far fa-user"></i>
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        placeholder="Alamat Email"
                        className="form-control"
                      />
                      <i className="text-title far fa-envelope"></i>
                    </div>
                    <div className="col-12 form-group">
                      <input id="reviewcheck" name="reviewcheck" type="checkbox" />
                      <label htmlFor="reviewcheck">
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="col-12 form-group mb-0">
                      <button className="th-btn">Posting Ulasan</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-extra-top mb-30">
              <div className="row justify-content-between align-items-center">
                <div className="col-md-auto">
                  <span className="sub-title">Produk Terkait</span>
                  <h2 className="sec-title text-center">
                    <span className="fw-normal">Mungkin Anda</span> Juga Suka
                  </h2>
                </div>
              </div>
              <RelatedProductsSlider products={relatedProducts} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
