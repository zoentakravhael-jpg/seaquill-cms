import { prisma } from "@/lib/prisma";
import BelanjaLayoutClient from "./BelanjaLayoutClient";

export default async function BelanjaLayoutPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "belanja_marketplace_section",
          "belanja_social_section",
          "belanja_header",
          "belanja_footer_link",
        ],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return <BelanjaLayoutClient settings={settingsMap} />;
}
