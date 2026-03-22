import { prisma } from "@/lib/prisma";
import ArtikelLayoutClient from "./ArtikelLayoutClient";

export default async function ArtikelLayoutPage() {
  const [categoryCount, postCount, settings] = await Promise.all([
    prisma.blogCategory.count({ where: { deletedAt: null } }),
    prisma.blogPost.count({ where: { status: "published", deletedAt: null } }),
    prisma.siteSetting.findMany({
      where: { key: { in: ["artikel_page_heading"] } },
    }),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return (
    <ArtikelLayoutClient
      settings={settingsMap}
      categoryCount={categoryCount}
      postCount={postCount}
    />
  );
}
