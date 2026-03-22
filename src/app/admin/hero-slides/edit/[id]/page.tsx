import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateHeroSlide } from "../../../actions";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [slide, groups] = await Promise.all([
    prisma.heroSlide.findUnique({ where: { id: parseInt(id) } }),
    prisma.heroSlideGroup.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!slide) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/hero-slides" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Hero Slide</h1>
            <p className="admin-page-subtitle">{slide.title}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <HeroSlideForm initialData={slide} action={updateHeroSlide} backHref="/admin/hero-slides" groups={groups} />
        </div>
      </div>
    </>
  );
}
