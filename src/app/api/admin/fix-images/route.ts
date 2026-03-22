import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary endpoint to fix product images - DELETE after use
export async function GET() {
  const imageMap: Record<string, string> = {
    "omega-3-salmon": "/assets/img/product/product_1_1.jpg",
    "calcium": "/assets/img/product/product_1_2.jpg",
    "vitamin-c-1000mg": "/assets/img/product/product_1_3.jpg",
    "biotin": "/assets/img/product/product_1_4.jpg",
    "kids-multivitamin": "/assets/img/product/product_1_5.jpg",
    "glucosamine": "/assets/img/product/product_1_6.jpg",
    "collagen": "/assets/img/product/product_1_7.jpg",
    "red-yeast-rice": "/assets/img/product/product_1_8.jpg",
    "prenatal-dha": "/assets/img/product/product_1_9.jpg",
  };

  const results: { slug: string; image: string; status: string }[] = [];

  for (const [slug, image] of Object.entries(imageMap)) {
    try {
      const product = await prisma.product.findUnique({ where: { slug } });
      if (!product) {
        results.push({ slug, image, status: "not found" });
        continue;
      }
      await prisma.product.update({
        where: { slug },
        data: { image },
      });
      results.push({ slug, image, status: "updated" });
    } catch (err) {
      results.push({ slug, image, status: `error: ${err}` });
    }
  }

  return NextResponse.json({ results });
}
