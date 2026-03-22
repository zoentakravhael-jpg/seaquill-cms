import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteProductCategory, bulkDeleteProductCategories } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function KategoriProdukPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "sortOrder";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const where: Record<string, unknown> = { deletedAt: null };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const [categories, totalCount] = await Promise.all([
    prisma.productCategory.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { _count: { select: { products: true } } },
    }),
    prisma.productCategory.count({ where }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "title", label: "Judul", sortable: true },
    { key: "slug", label: "Slug", sortable: true, type: "code" },
    { key: "icon", label: "Icon" },
    { key: "sortOrder", label: "Urutan", sortable: true },
    { key: "products", label: "Produk", type: "badge", nestedKey: "_count.products", badgeVariant: "blue" },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kategori Produk</h1>
          <p className="admin-page-subtitle">{totalCount} kategori</p>
        </div>
        <Link href="/admin/kategori-produk/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah Kategori
        </Link>
      </div>
      <AdminListPage
        columns={columns}
        data={categories}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        editBasePath="/admin/kategori-produk/edit"
        deleteAction={deleteProductCategory}
        bulkDeleteAction={bulkDeleteProductCategories}
        entityName="Kategori Produk"
        searchPlaceholder="Cari kategori..."
      />
    </>
  );
}
