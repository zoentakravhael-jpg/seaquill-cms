import { prisma } from "@/lib/prisma";
import HubungiLayoutClient from "./HubungiLayoutClient";

export default async function HubungiLayoutPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "hubungi_social_section",
          "hubungi_marketplace_section",
          "hubungi_contact_section",
        ],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  const forms = await prisma.form.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, slug: true, status: true },
    orderBy: { name: "asc" },
  });

  return <HubungiLayoutClient settings={settingsMap} forms={forms} />;
}
