import { prisma } from "@/lib/prisma";
import ProdukLayoutClient from "./ProdukLayoutClient";

export default async function ProdukLayoutPage() {
  const [categoryCount, productCount, settings] = await Promise.all([
    prisma.productCategory.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { status: "published", deletedAt: null } }),
    prisma.siteSetting.findMany({
      where: { key: { in: ["produk_page_heading"] } },
    }),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return (
    <ProdukLayoutClient
      settings={settingsMap}
      categoryCount={categoryCount}
      productCount={productCount}
    />
  );
}
