import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/layout/Breadcrumb";
import HubungiKamiClient from "@/components/hubungi/HubungiKamiClient";

export const metadata: Metadata = {
  title: "Hubungi Kami | Sea-Quill Indonesia",
  description: "Hubungi Sea-Quill untuk informasi produk, konsultasi kesehatan, atau kerja sama bisnis. Kami siap membantu Anda.",
  openGraph: {
    title: "Hubungi Kami | Sea-Quill Indonesia",
    description: "Hubungi Sea-Quill untuk informasi produk dan konsultasi kesehatan.",
    type: "website",
  },
};

export default async function HubungiKamiPage() {
  const settingKeys = [
    "hubungi_social_section",
    "hubungi_marketplace_section",
    "hubungi_contact_section",
  ];

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: settingKeys } },
  });

  const getJson = (key: string) => {
    const s = settings.find((s) => s.key === key);
    if (!s?.value) return {};
    try { return JSON.parse(s.value); } catch { return {}; }
  };

  const socialSection = getJson("hubungi_social_section");
  const marketplaceSection = getJson("hubungi_marketplace_section");
  const contactSection = getJson("hubungi_contact_section");

  // Fetch custom form if selected
  let customForm: { slug: string; fields: string; settings: string } | null = null;
  if (contactSection.formSlug) {
    const form = await prisma.form.findUnique({
      where: { slug: contactSection.formSlug },
      select: { slug: true, fields: true, settings: true, status: true, deletedAt: true },
    });
    if (form && !form.deletedAt && form.status === "published") {
      customForm = { slug: form.slug, fields: form.fields, settings: form.settings };
    }
  }

  return (
    <>
      <Breadcrumb title="About Us" />
      <HubungiKamiClient
        socialSection={socialSection}
        marketplaceSection={marketplaceSection}
        contactSection={contactSection}
        customForm={customForm}
      />
    </>
  );
}
