import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createBlogPost } from "../../actions";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function CreateArtikelPage() {
  const categories = await prisma.blogCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/artikel" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Artikel</h1>
            <p className="admin-page-subtitle">Buat artikel baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <ArticleForm
            categories={categories}
            action={createBlogPost}
            backHref="/admin/artikel"
          />
        </div>
      </div>
    </>
  );
}
