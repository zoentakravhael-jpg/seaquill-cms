import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BlogGridCard from "@/components/shared/BlogGridCard";
import BlogSidebar from "@/components/shared/BlogSidebar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ kategori: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const category = await prisma.blogCategory.findUnique({
    where: { slug: kategori, deletedAt: null },
    select: { title: true },
  });
  if (!category) return { title: "Kategori Tidak Ditemukan" };
  return {
    title: `${category.title} | Artikel Sea-Quill`,
    description: `Kumpulan artikel tentang ${category.title} dari Sea-Quill. Tips dan informasi kesehatan terpercaya.`,
    openGraph: {
      title: `${category.title} | Artikel Sea-Quill`,
      description: `Kumpulan artikel tentang ${category.title} dari Sea-Quill.`,
      type: "website",
    },
  };
}

export default async function ArticleCategoryPage({ params }: Props) {
  const { kategori } = await params;

  const category = await prisma.blogCategory.findUnique({
    where: { slug: kategori, deletedAt: null },
  });

  if (!category) {
    notFound();
  }

  const blogPosts = await prisma.blogPost.findMany({
    where: { categoryId: category.id, status: "published", deletedAt: null },
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
                    <p className="sec-text fs-18">Belum ada artikel di kategori ini.</p>
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
