import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteEventItem, bulkDeleteEventItems } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function EventsPage({ searchParams }: Props) {
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
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, totalCount] = await Promise.all([
    prisma.eventItem.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.eventItem.count({ where }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "Image", type: "image", imageAltKey: "title", imageSize: 80 },
    { key: "title", label: "Title", sortable: true, type: "strong" },
    { key: "date", label: "Tanggal", sortable: true, type: "date" },
    { key: "location", label: "Lokasi", type: "truncate", maxWidth: 150 },
    { key: "active", label: "Status", type: "boolean-badge", trueLabel: "Aktif", falseLabel: "Nonaktif", trueVariant: "green", falseVariant: "red" },
    { key: "sortOrder", label: "Urutan", sortable: true },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Events</h1>
          <p className="admin-page-subtitle">{totalCount} event terdaftar</p>
        </div>
        <Link href="/admin/events/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah Event
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
        editBasePath="/admin/events/edit"
        deleteAction={deleteEventItem}
        bulkDeleteAction={bulkDeleteEventItems}
        entityName="Event"
        searchPlaceholder="Cari title, deskripsi, atau lokasi..."
      />
    </>
  );
}
