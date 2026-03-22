import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createHeroSlide } from "../../actions";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

export default async function CreateHeroSlidePage() {
  const groups = await prisma.heroSlideGroup.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/hero-slides" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Hero Slide</h1>
            <p className="admin-page-subtitle">Buat slide baru untuk homepage</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <HeroSlideForm action={createHeroSlide} backHref="/admin/hero-slides" groups={groups} />
        </div>
      </div>
    </>
  );
}
