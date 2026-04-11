import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BlogSidebar from "@/components/shared/BlogSidebar";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { sanitizeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "published", deletedAt: null },
    select: { title: true, excerpt: true, metaTitle: true, metaDescription: true, ogImage: true, image: true, author: true, publishedAt: true },
  });
  if (!post) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: post.metaTitle || `${post.title} | Sea-Quill Blog`,
    description: post.metaDescription || post.excerpt || `Baca artikel ${post.title} dari Sea-Quill.`,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      images: post.ogImage || post.image ? [{ url: post.ogImage || post.image }] : [],
      type: "article",
      authors: [post.author],
      publishedTime: post.publishedAt.toISOString(),
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "published", deletedAt: null },
    include: { category: true },
  });

  if (!post) return notFound();

  const settings = await getSiteSettings();

  const formattedDate = post.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Sea-Quill Indonesia",
      logo: {
        "@type": "ImageObject",
        url: "/assets/img/logo.svg",
      },
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    description: post.excerpt || post.title,
    articleSection: post.category.title,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb title="About Us" />

      <section className="th-blog-wrapper blog-details space-top space-extra-bottom">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-lg-7">
              <div className="th-blog blog-single">
                <div className="blog-img global-img">
                  <Image src={post.image} alt={post.title} width={800} height={450} sizes="(max-width: 992px) 100vw, 66vw" priority />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <a className="author" href="#">
                      <i className="fa-solid fa-user"></i>by {post.author}{" "}
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-calendar-days"></i> {formattedDate}
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-tags"></i>{post.category.title}
                    </a>
                  </div>
                  <h2 className="blog-title">
                    {post.title}
                  </h2>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />

                  <div className="share-links clearfix">
                    <div className="row justify-content-between">
                      <div className="col-sm-auto">
                        <span className="share-links-title">Tags:</span>
                        <div className="tagcloud">
                          {post.tags.map((tag) => (
                            <a key={tag} href="#">{tag}</a>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-auto text-xl-end">
                        <span className="share-links-title">Share:</span>
                        <ul className="social-links">
                          <li>
                            <a href={settings.social_facebook || "https://facebook.com/"} target="_blank" rel="noopener noreferrer">
                              <i className="fab fa-facebook-f"></i>
                            </a>
                          </li>
                          <li>
                            <a href={settings.social_twitter || "https://twitter.com/"} target="_blank" rel="noopener noreferrer">
                              <i className="fab fa-twitter"></i>
                            </a>
                          </li>
                          <li>
                            <a href={settings.social_linkedin || "https://linkedin.com/"} target="_blank" rel="noopener noreferrer">
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          </li>
                          <li>
                            <a href={settings.social_instagram || "https://instagram.com/"} target="_blank" rel="noopener noreferrer">
                              <i className="fab fa-instagram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="th-comments-wrap">
                <h2 className="blog-inner-title h4 fw-semibold">Komentar (3)</h2>
                <ul className="comment-list">
                  <li className="th-comment-item">
                    <div className="th-post-comment">
                      <div className="comment-avater">
                        <img src="/assets/img/blog/comment-author-2.jpg" alt="Comment Author" />
                      </div>
                      <div className="comment-content">
                        <h3 className="name">Rina Kusuma</h3>
                        <span className="commented-on">25 Apr, 2025 08:56pm</span>
                        <p className="text">
                          Artikel yang sangat bermanfaat! Sekarang saya lebih paham pentingnya menjaga kesehatan dengan suplemen yang tepat.
                        </p>
                        <div className="reply_and_edit">
                          <a href="#" className="reply-btn">
                            <i className="fas fa-reply"></i>Balas
                          </a>
                        </div>
                      </div>
                    </div>
                    <ul className="children">
                      <li className="th-comment-item">
                        <div className="th-post-comment">
                          <div className="comment-avater">
                            <img src="/assets/img/blog/comment-author-1.jpg" alt="Comment Author" />
                          </div>
                          <div className="comment-content">
                            <h3 className="name">Budi Purnama</h3>
                            <span className="commented-on">26 Apr, 2025 08:56pm</span>
                            <p className="text">
                              Setuju, informasi tentang nutrisi dan suplemen di sini sangat lengkap dan mudah dipahami.
                            </p>
                            <div className="reply_and_edit">
                              <a href="#" className="reply-btn">
                                <i className="fas fa-reply"></i>Balas
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className="th-comment-item">
                    <div className="th-post-comment">
                      <div className="comment-avater">
                        <img src="/assets/img/blog/comment-author-3.jpg" alt="Comment Author" />
                      </div>
                      <div className="comment-content">
                        <h3 className="name">Siti Nurhaliza</h3>
                        <span className="commented-on">28 Apr, 2025 08:56pm</span>
                        <p className="text">
                          Terima kasih sudah berbagi tips kesehatan yang praktis. Sangat membantu untuk keluarga saya.
                        </p>
                        <div className="reply_and_edit">
                          <a href="#" className="reply-btn">
                            <i className="fas fa-reply"></i>Balas
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Comment Form */}
              <div className="th-comment-form">
                <div className="form-title mb-25">
                  <h3 className="blog-inner-title h4">Tulis Komentar</h3>
                  <p>Alamat email Anda tidak akan dipublikasikan. Kolom wajib ditandai *</p>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input type="text" placeholder="Nama Anda*" className="form-control" />
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="col-md-6 form-group">
                    <input type="text" placeholder="Email Anda*" className="form-control" />
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="col-12 form-group">
                    <input type="text" placeholder="Website" className="form-control" />
                    <i className="fal fa-globe"></i>
                  </div>
                  <div className="col-12 form-group">
                    <textarea placeholder="Tulis Komentar*" className="form-control"></textarea>
                    <i className="fa-regular fa-pencil"></i>
                  </div>
                  <div className="col-12 form-group">
                    <input type="checkbox" id="html" />
                    <label htmlFor="html">
                      Simpan nama, email, dan situs web saya untuk komentar berikutnya.
                    </label>
                  </div>
                  <div className="col-12 form-group mb-0">
                    <button className="th-btn">
                      Kirim Komentar <i className="fa-light fa-arrow-right-long"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-lg-5">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
