import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteBrandPartner, bulkDeleteBrandPartners } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BrandPartnersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "sortOrder";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const where: Record<string, unknown> = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [brands, totalCount] = await Promise.all([
    prisma.brandPartner.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.brandPartner.count({ where }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "logoImage", label: "Logo", type: "image", imageAltKey: "name", imageSize: 60, imageFit: "contain" },
    { key: "name", label: "Nama", sortable: true, type: "strong" },
    { key: "url", label: "URL", type: "truncate", maxWidth: 200 },
    { key: "active", label: "Status", type: "boolean-badge", trueLabel: "Aktif", falseLabel: "Nonaktif", trueVariant: "green", falseVariant: "red" },
    { key: "sortOrder", label: "Urutan", sortable: true },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Brand Partners</h1>
          <p className="admin-page-subtitle">{totalCount} brand terdaftar</p>
        </div>
        <Link href="/admin/brand-partners/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah Brand
        </Link>
      </div>
      <AdminListPage
        columns={columns}
        data={brands}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        editBasePath="/admin/brand-partners/edit"
        deleteAction={deleteBrandPartner}
        bulkDeleteAction={bulkDeleteBrandPartners}
        entityName="Brand"
        searchPlaceholder="Cari nama brand..."
      />
    </>
  );
}
