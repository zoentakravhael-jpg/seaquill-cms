import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deletePromoItem, bulkDeletePromoItems } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PromoPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "sortOrder";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, totalCount] = await Promise.all([
    prisma.promoItem.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.promoItem.count({ where }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "Image", type: "image", imageAltKey: "title", imageSize: 80 },
    { key: "title", label: "Title", sortable: true, type: "strong" },
    { key: "description", label: "Deskripsi", type: "truncate", maxWidth: 200 },
    { key: "active", label: "Status", type: "boolean-badge", trueLabel: "Aktif", falseLabel: "Nonaktif", trueVariant: "green", falseVariant: "red" },
    { key: "sortOrder", label: "Urutan", sortable: true },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Promo</h1>
          <p className="admin-page-subtitle">{totalCount} promo terdaftar</p>
        </div>
        <Link href="/admin/promo/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah Promo
        </Link>
      </div>
      <AdminListPage
        columns={columns}
        data={items}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        editBasePath="/admin/promo/edit"
        deleteAction={deletePromoItem}
        bulkDeleteAction={bulkDeletePromoItems}
        entityName="Promo"
        searchPlaceholder="Cari title atau deskripsi..."
      />
    </>
  );
}
