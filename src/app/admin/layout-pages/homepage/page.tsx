import { prisma } from "@/lib/prisma";
import HomepageLayoutClient from "./HomepageLayoutClient";

export default async function HomepageLayoutPage() {
  const [heroCount, brandCount, settings] = await Promise.all([
    prisma.heroSlide.count({ where: { active: true } }),
    prisma.brandPartner.count({ where: { active: true } }),
    prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "home_feature_cards",
            "home_about_section",
            "home_service_list",
            "home_product_section",
            "home_featured_flags",
            "product_slider_config",
            "brand_slider_config",
            "blog_slider_config",
            "home_blog_section",
          ],
        },
      },
    }),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return (
    <HomepageLayoutClient
      settings={settingsMap}
      heroCount={heroCount}
      brandCount={brandCount}
    />
  );
}
