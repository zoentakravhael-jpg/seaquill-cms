import { prisma } from "@/lib/prisma";
import GaleriLayoutClient from "./GaleriLayoutClient";

export default async function GaleriLayoutPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: { in: ["galeri_instagram", "galeri_facebook", "galeri_tiktok"] },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return <GaleriLayoutClient settings={settingsMap} />;
}
