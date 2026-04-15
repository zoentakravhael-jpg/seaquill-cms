import { prisma } from "@/lib/prisma";
import PopupFormClient from "./PopupFormClient";

export default async function PopupFormPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ["popup_connect_form"],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  const products = await prisma.product.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <PopupFormClient settings={settingsMap} products={products} />;
}
