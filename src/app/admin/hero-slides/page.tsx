import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminListPage, { type Column } from "@/components/admin/AdminListPage";
import HeroSliderConfigPanel from "@/components/admin/HeroSliderConfigPanel";
import HeroSlideGroupPanel from "@/components/admin/HeroSlideGroupPanel";
import { deleteHeroSlide, bulkDeleteHeroSlides, toggleHeroSlideActive } from "../actions";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function HeroSlidesPage({ searchParams }: Props) {
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
      { subtitle: { contains: search, mode: "insensitive" } },
    ];
  }

  const [slides, totalCount, configRow, groups] = await Promise.all([
    prisma.heroSlide.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { group: { select: { id: true, name: true } } },
    }),
    prisma.heroSlide.count({ where }),
    prisma.siteSetting.findUnique({ where: { key: "hero_slider_config" } }),
    prisma.heroSlideGroup.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { slides: true } } },
    }),
  ]);

  const sliderConfig = configRow
    ? JSON.parse(configRow.value)
    : undefined;

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "bgImage", label: "BG Image", type: "image", imageAltKey: "title", imageSize: 80 },
    { key: "title", label: "Title", sortable: true, type: "strong" },
    { key: "subtitle", label: "Subtitle", type: "truncate", maxWidth: 200 },
    { key: "group", label: "Grup", nestedKey: "group.name", type: "badge", badgeVariant: "blue" },
    { key: "active", label: "Status", type: "boolean-toggle", trueLabel: "Aktif", falseLabel: "Nonaktif", trueVariant: "green", falseVariant: "red" },
    { key: "sortOrder", label: "Urutan", sortable: true },
  ];

  // Flatten nested group name for display
  const slidesData = slides.map((s) => ({
    ...s,
    group: s.group ? { name: s.group.name } : { name: "—" },
  }));

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Hero Slides</h1>
          <p className="admin-page-subtitle">{totalCount} slide terdaftar</p>
        </div>
        <Link href="/admin/hero-slides/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah Slide
        </Link>
      </div>
      <HeroSlideGroupPanel groups={groups} />
      <HeroSliderConfigPanel initialConfig={sliderConfig} />
      <AdminListPage
        columns={columns}
        data={slidesData}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        search={search}
        editBasePath="/admin/hero-slides/edit"
        deleteAction={deleteHeroSlide}
        bulkDeleteAction={bulkDeleteHeroSlides}
        toggleActiveAction={toggleHeroSlideActive}
        entityName="Slide"
        searchPlaceholder="Cari title atau subtitle..."
      />
    </>
  );
}
