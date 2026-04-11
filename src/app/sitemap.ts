import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://seaquill-cms-production.up.railway.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/produk`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/artikel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/galeri`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/promo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/hubungi-kami`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic: product categories
  const productCategories = await prisma.productCategory.findMany({
    where: { deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const categoryPages: MetadataRoute.Sitemap = productCategories.map(
    (cat) => ({
      url: `${BASE_URL}/produk/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // Dynamic: products
  const products = await prisma.product.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/produk/detail/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic: blog categories
  const blogCategories = await prisma.blogCategory.findMany({
    where: { deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const blogCatPages: MetadataRoute.Sitemap = blogCategories.map((cat) => ({
    url: `${BASE_URL}/artikel/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic: blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/artikel/detail/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...blogCatPages,
    ...blogPages,
  ];
}
