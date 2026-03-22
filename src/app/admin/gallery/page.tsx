import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import { deleteGalleryItem, bulkDeleteGalleryItems } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function GalleryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(params.perPage || "10")));
  const search = params.search?.trim() || "";
  const sortBy = params.sortBy || "sortOrder";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";
  const platformFilter = params.platform || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { caption: { contains: search, mode: "insensitive" } },
      { platform: { contains: search, mode: "insensitive" } },
    ];
  }
  if (platformFilter) {
    where.platform = platformFilter;
  }

  const [items, totalCount] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.galleryItem.count({ where }),
  ]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "Image", type: "image", imageAltKey: "caption", imageSize: 80 },
    { key: "caption", label: "Caption", sortable: true, type: "strong" },
    { key: "platform", label: "Platform", sortable: true, type: "badge" },
    { key: "active", label: "Status", type: "boolean-badge", trueLabel: "Aktif", falseLabel: "Nonaktif", trueVariant: "green", falseVariant: "red" },
    { key: "sortOrder", label: "Urutan", sortable: true },
  ];

  const filters = [
    {
      key: "platform",
      label: "Platform",
      value: platformFilter,
      options: [
        { value: "", label: "Semua Platform" },
        { value: "instagram", label: "Instagram" },
        { value: "facebook", label: "Facebook" },
        { value: "tiktok", label: "TikTok" },
      ],
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-subtitle">{totalCount} item terdaftar</p>
        </div>
        <Link href="/admin/gallery/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah Item
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
        editBasePath="/admin/gallery/edit"
        deleteAction={deleteGalleryItem}
        bulkDeleteAction={bulkDeleteGalleryItems}
        entityName="Gallery Item"
        searchPlaceholder="Cari caption atau platform..."
        filters={filters}
      />
    </>
  );
}
