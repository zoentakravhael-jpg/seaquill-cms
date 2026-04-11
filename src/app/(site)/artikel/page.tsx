import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BlogGridCard from "@/components/shared/BlogGridCard";
import BlogSidebar from "@/components/shared/BlogSidebar";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Artikel Kesehatan | Sea-Quill Blog",
  description: "Baca artikel dan tips kesehatan terpercaya dari Sea-Quill. Informasi lengkap tentang suplemen, nutrisi, dan gaya hidup sehat.",
  openGraph: {
    title: "Artikel Kesehatan | Sea-Quill Blog",
    description: "Baca artikel dan tips kesehatan terpercaya dari Sea-Quill.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function ArtikelPage() {
  const blogPosts = await prisma.blogPost.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <>
      <Breadcrumb title="Medical Insights Grid View with Sidebar" />

      <section className="th-blog-wrapper space-top space-extra-bottom">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-lg-7">
              <div className="row">
                {blogPosts.length > 0 ? blogPosts.map((post) => (
                  <BlogGridCard
                    key={post.id}
                    title={post.title}
                    image={post.image}
                    slug={post.slug}
                    author={post.author}
                  />
                )) : (
                  <div className="col-12 text-center py-5">
                    <p className="sec-text fs-18">Belum ada artikel yang tersedia.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="col-xxl-4 col-lg-5">
              <BlogSidebar />
            </div>
          </div>
          <div className="th-pagination mt-30">
            <ul>
              <li>
                <a href="#">
                  <i className="fa-regular fa-arrow-left"></i>
                </a>
              </li>
              <li>
                <a href="#">1</a>
              </li>
              <li>
                <a href="#">2</a>
              </li>
              <li>
                <a href="#">3</a>
              </li>
              <li>
                <a href="#">4</a>
              </li>
              <li>
                <a href="#">
                  Next <i className="fa-regular fa-arrow-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
