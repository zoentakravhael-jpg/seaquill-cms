import { prisma } from "@/lib/prisma";
import TentangLayoutClient from "./TentangLayoutClient";

export default async function TentangLayoutPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "tentang_about_section",
          "tentang_feature_cards",
          "tentang_project_slider",
        ],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return <TentangLayoutClient settings={settingsMap} />;
}
