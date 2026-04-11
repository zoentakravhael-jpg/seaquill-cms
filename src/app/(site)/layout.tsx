export const revalidate = 60;

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ThemeInitializer from "@/components/layout/ThemeInitializer";
import AnimationInitializer from "@/components/layout/AnimationInitializer";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";
import type { NavCategory, NavProduct, RecentPost } from "@/types/layout";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteSettings, productCats, blogCats, latestPosts, allProducts] = await Promise.all([
    getSiteSettings(),
    prisma.productCategory.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true },
    }),
    prisma.blogCategory.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "published", deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 4,
      select: {
        slug: true,
        title: true,
        image: true,
        publishedAt: true,
        category: { select: { slug: true } },
      },
    }),
    prisma.product.findMany({
      where: { status: "published", deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const productCategories: NavCategory[] = productCats;
  const blogCategories: NavCategory[] = blogCats;
  const products: NavProduct[] = allProducts;
  const recentPosts: RecentPost[] = latestPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.image,
    publishedAt: p.publishedAt.toISOString(),
    categorySlug: p.category.slug,
  }));

  return (
    <>
      <Preloader />
      <Header
        siteSettings={siteSettings}
        productCategories={productCategories}
        blogCategories={blogCategories}
        recentPosts={recentPosts}
        products={products}
      />
      {children}
      <Footer
        siteSettings={siteSettings}
        productCategories={productCategories}
        blogCategories={blogCategories}
        recentPosts={recentPosts}
      />
      <ScrollToTop />
      <ThemeInitializer />
      <AnimationInitializer />
    </>
  );
}
