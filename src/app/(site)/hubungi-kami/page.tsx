import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/layout/Breadcrumb";
import HubungiKamiClient from "@/components/hubungi/HubungiKamiClient";

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

  return (
    <>
      <Breadcrumb title="About Us" />
      <HubungiKamiClient
        socialSection={socialSection}
        marketplaceSection={marketplaceSection}
        contactSection={contactSection}
      />
    </>
  );
}
