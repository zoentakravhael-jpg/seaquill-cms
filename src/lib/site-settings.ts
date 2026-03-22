import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type SiteSettings = Record<string, string>;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.siteSetting.findMany();
  const map: SiteSettings = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});
