import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  const [
    productCategories,
    products,
    blogCategories,
    blogPosts,
    adminUsers,
    heroSlideGroups,
    heroSlides,
    brandPartners,
    galleryItems,
    promoItems,
    eventItems,
    siteSettings,
  ] = await Promise.all([
    prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.blogCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.blogPost.findMany({ where: { deletedAt: null }, orderBy: { publishedAt: "asc" } }),
    prisma.adminUser.findMany(),
    prisma.heroSlideGroup.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brandPartner.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.promoItem.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.eventItem.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);

  const output = {
    productCategories,
    products,
    blogCategories,
    blogPosts,
    adminUsers,
    heroSlideGroups,
    heroSlides,
    brandPartners,
    galleryItems,
    promoItems,
    eventItems,
    siteSettings,
  };

  const outPath = path.join(__dirname, "db-export.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`✅ Exported to ${outPath}`);
  console.log(`   productCategories: ${productCategories.length}`);
  console.log(`   products: ${products.length}`);
  console.log(`   blogCategories: ${blogCategories.length}`);
  console.log(`   blogPosts: ${blogPosts.length}`);
  console.log(`   adminUsers: ${adminUsers.length}`);
  console.log(`   heroSlideGroups: ${heroSlideGroups.length}`);
  console.log(`   heroSlides: ${heroSlides.length}`);
  console.log(`   brandPartners: ${brandPartners.length}`);
  console.log(`   galleryItems: ${galleryItems.length}`);
  console.log(`   promoItems: ${promoItems.length}`);
  console.log(`   eventItems: ${eventItems.length}`);
  console.log(`   siteSettings: ${siteSettings.length}`);

  await pool.end();
}

main().catch(console.error);
