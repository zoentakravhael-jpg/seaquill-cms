import { prisma } from "@/lib/prisma";
import PromoLayoutClient from "./PromoLayoutClient";

export default async function PromoLayoutPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: { in: ["promo_section", "event_section"] },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return <PromoLayoutClient settings={settingsMap} />;
}
