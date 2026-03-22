import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "../../../actions";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id: parseInt(id) } }),
    prisma.blogCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!post) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/artikel" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Artikel</h1>
            <p className="admin-page-subtitle">{post.title}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <ArticleForm
            categories={categories}
            initialData={post}
            action={updateBlogPost}
            backHref="/admin/artikel"
          />
        </div>
      </div>
    </>
  );
}
