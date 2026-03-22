import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteBlogPost, bulkDeleteBlogPosts, bulkUpdateBlogPostStatus } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ArtikelAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";
  const statusFilter = params.status || "";
  const categoryFilter = params.category || "";

  const where: Record<string, unknown> = { deletedAt: null };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
    ];
  }
  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }
  if (categoryFilter && categoryFilter !== "all") {
    where.categoryId = parseInt(categoryFilter);
  }

  const [posts, totalCount, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "Gambar", type: "image", imageAltKey: "title", imageFit: "cover" },
    { key: "title", label: "Judul", sortable: true, type: "strong" },
    { key: "category", label: "Kategori", type: "badge", nestedKey: "category.title", badgeVariant: "purple" },
    { key: "author", label: "Penulis", sortable: true },
    { key: "status", label: "Status", sortable: true, type: "status" },
    { key: "publishedAt", label: "Tanggal", sortable: true, type: "date" },
  ];

  const filters = [
    {
      key: "status",
      label: "Semua Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
    },
    {
      key: "category",
      label: "Semua Kategori",
      options: categories.map((c) => ({ label: c.title, value: String(c.id) })),
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Artikel</h1>
          <p className="admin-page-subtitle">{totalCount} artikel terdaftar</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/api/admin/export/articles" className="admin-btn-export" download>
            <i className="fas fa-file-csv"></i> Export CSV
          </a>
          <Link href="/admin/artikel/create" className="admin-btn admin-btn-primary">
            <i className="fas fa-plus"></i> Tambah Artikel
          </Link>
        </div>
      </div>
      <AdminListPage
        columns={columns}
        data={posts}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        filters={filters}
        activeFilters={{ status: statusFilter, category: categoryFilter }}
        editBasePath="/admin/artikel/edit"
        deleteAction={deleteBlogPost}
        bulkDeleteAction={bulkDeleteBlogPosts}
        bulkStatusAction={bulkUpdateBlogPostStatus}
        entityName="Artikel"
        searchPlaceholder="Cari judul atau penulis..."
        hasStatus
      />
    </>
  );
}
