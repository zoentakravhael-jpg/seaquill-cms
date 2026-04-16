import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteProduct, bulkDeleteProducts, bulkUpdateProductStatus, duplicateProduct } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProdukPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "sortOrder";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";
  const statusFilter = params.status || "";
  const categoryFilter = params.category || "";

  // Build where clause
  const where: Record<string, unknown> = { deletedAt: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter;
  }
  if (categoryFilter && categoryFilter !== "all") {
    where.categoryId = parseInt(categoryFilter);
  }

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    }),
    prisma.product.count({ where }),
    prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "Gambar", type: "image", imageAltKey: "name", imageSize: 80, imageFit: "cover" },
    { key: "name", label: "Nama", sortable: true, type: "strong" },
    { key: "sku", label: "SKU", sortable: true },
    { key: "category", label: "Kategori", type: "badge", nestedKey: "category.title", badgeVariant: "blue" },
    { key: "status", label: "Status", sortable: true, type: "status" },
    { key: "isBestSeller", label: "Flag", type: "flags", flagKeys: [
      { key: "isBestSeller", label: "Best Seller", variant: "orange" },
      { key: "isNew", label: "Baru", variant: "green" },
    ] },
    { key: "stock", label: "Stok", type: "boolean-badge", trueLabel: "Ada", falseLabel: "Habis", trueVariant: "green", falseVariant: "red" },
    { key: "sortOrder", label: "Urutan", sortable: true },
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
          <h1 className="admin-page-title">Produk</h1>
          <p className="admin-page-subtitle">{totalCount} produk terdaftar</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/api/admin/export/products" className="admin-btn-export" download>
            <i className="fas fa-file-csv"></i> Export CSV
          </a>
          <Link href="/admin/produk/create" className="admin-btn admin-btn-primary">
            <i className="fas fa-plus"></i> Tambah Produk
          </Link>
        </div>
      </div>
      <AdminListPage
        columns={columns}
        data={products}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        filters={filters}
        activeFilters={{ status: statusFilter, category: categoryFilter }}
        editBasePath="/admin/produk/edit"
        deleteAction={deleteProduct}
        duplicateAction={duplicateProduct}
        bulkDeleteAction={bulkDeleteProducts}
        bulkStatusAction={bulkUpdateProductStatus}
        entityName="Produk"
        searchPlaceholder="Cari nama produk atau SKU..."
        hasStatus
      />
    </>
  );
}
