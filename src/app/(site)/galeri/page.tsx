import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import GallerySliders from "@/components/galeri/GallerySliders";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri Sea-Quill | Foto & Video",
  description: "Lihat koleksi galeri foto dan video Sea-Quill dari berbagai platform media sosial.",
  openGraph: {
    title: "Galeri Sea-Quill | Foto & Video",
    description: "Lihat koleksi galeri foto dan video Sea-Quill.",
    type: "website",
  },
};

const platformConfig = [
  { platform: "instagram", label: "Instagram", icon: "/assets/img/icon/instagram.svg" },
  { platform: "facebook", label: "Facebook", icon: "/assets/img/icon/facebook.svg" },
  { platform: "tiktok", label: "Tiktok", icon: "/assets/img/icon/tiktok.svg" },
];

export default async function GaleriPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const sections = platformConfig
    .map((cfg) => ({
      label: cfg.label,
      icon: cfg.icon,
      items: galleryItems
        .filter((g) => g.platform === cfg.platform)
        .map((g) => ({ id: g.id, image: g.image, caption: g.caption, url: g.url })),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <Breadcrumb title="About Us" />
      {sections.length > 0 ? (
        <GallerySliders sections={sections} />
      ) : (
        <section className="space-top space-extra-bottom">
          <div className="container text-center">
            <p className="sec-text fs-18">Belum ada galeri yang tersedia.</p>
          </div>
        </section>
      )}
    </>
  );
}
