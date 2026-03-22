import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteContactMessage, bulkDeleteContactMessages } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PesanPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";
  const sourceFilter = params.source || "";

  const where: Record<string, unknown> = { deletedAt: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
    ];
  }
  if (sourceFilter && sourceFilter !== "all") {
    where.source = sourceFilter;
  }

  const [messages, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Nama", sortable: true, type: "strong" },
    { key: "email", label: "Email", sortable: true },
    { key: "subject", label: "Subjek", sortable: true },
    { key: "source", label: "Sumber", type: "mapped-badge", badgeMap: { contact: { label: "Kontak", variant: "blue" }, consultation: { label: "Konsultasi", variant: "purple" } } },
    { key: "message", label: "Pesan", type: "truncate", maxWidth: 250 },
    { key: "createdAt", label: "Tanggal", sortable: true, type: "date", dateOptions: { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } },
  ];

  const filters = [
    {
      key: "source",
      label: "Semua Sumber",
      options: [
        { label: "Kontak", value: "contact" },
        { label: "Konsultasi", value: "consultation" },
      ],
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pesan Masuk</h1>
          <p className="admin-page-subtitle">{totalCount} pesan</p>
        </div>
      </div>
      <AdminListPage
        columns={columns}
        data={messages}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        filters={filters}
        activeFilters={{ source: sourceFilter }}
        deleteAction={deleteContactMessage}
        bulkDeleteAction={bulkDeleteContactMessages}
        entityName="Pesan"
        searchPlaceholder="Cari nama, email, atau subjek..."
      />
    </>
  );
}
