import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/home/HeroSlider";

export const metadata: Metadata = {
  title: "Seaquill - Suplemen Kesehatan Terpercaya | Bersertifikat BPOM & Halal",
  description: "Sea-Quill menyediakan suplemen kesehatan berkualitas premium dengan sertifikasi BPOM dan Halal. Temukan produk terbaik untuk kesehatan jantung, kulit, sendi, dan daya tahan tubuh.",
  openGraph: {
    title: "Seaquill - Suplemen Kesehatan Terpercaya",
    description: "Sea-Quill menyediakan suplemen kesehatan berkualitas premium dengan sertifikasi BPOM dan Halal.",
    type: "website",
    locale: "id_ID",
    siteName: "Seaquill",
  },
};
import type { HeroSliderConfig } from "@/components/home/HeroSlider";
import FeatureCards from "@/components/home/FeatureCards";
import AboutSection from "@/components/home/AboutSection";
import ServiceList from "@/components/home/ServiceList";
import ProductSlider from "@/components/home/ProductSlider";
import BrandPartners from "@/components/home/BrandPartners";
import BlogSlider from "@/components/home/BlogSlider";

export const dynamic = "force-dynamic";

async function getSettings(keys: string[]) {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export default async function Home() {
  // Check if there's an active slide group
  const activeGroup = await prisma.heroSlideGroup.findFirst({
    where: { active: true },
    select: { id: true },
  });

  const heroSlideWhere = activeGroup
    ? { active: true, groupId: activeGroup.id }
    : { active: true };

  const [heroSlides, brandPartners, featuredProducts, recentBlogs, settings] =
    await Promise.all([
      prisma.heroSlide.findMany({
        where: heroSlideWhere,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.brandPartner.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: {
          deletedAt: null,
          status: "published",
          OR: [{ isBestSeller: true }, { isNew: true }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          shortDescription: true,
          isBestSeller: true,
          isNew: true,
        },
        orderBy: { sortOrder: "asc" },
        take: 12,
      }),
      prisma.blogPost.findMany({
        where: { deletedAt: null, status: "published" },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          author: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 6,
      }),
      getSettings([
        "home_feature_cards",
        "home_about_section",
        "home_service_list",
        "home_product_section",
        "home_featured_flags",
        "product_slider_config",
        "brand_slider_config",
        "blog_slider_config",
        "home_blog_section",
        "social_instagram",
        "social_facebook",
        "social_twitter",
        "social_linkedin",
        "hero_slider_config",
      ]),
    ]);

  const featureCards = JSON.parse(settings.home_feature_cards || "[]");
  const aboutSection = JSON.parse(settings.home_about_section || "{}");
  const serviceList = JSON.parse(settings.home_service_list || "{}");
  const productSection = JSON.parse(settings.home_product_section || "{}");
  const featuredFlags = JSON.parse(settings.home_featured_flags || '{"bestSeller":true,"newProduct":true}');
  const productSliderConfig = JSON.parse(settings.product_slider_config || '{"autoplay":true,"autoplayDelay":4000,"loop":true,"pauseOnHover":true}');
  const brandSliderConfig = JSON.parse(settings.brand_slider_config || '{"autoplay":true,"autoplayDelay":3000,"loop":true,"pauseOnHover":false}');
  const blogSliderConfig = JSON.parse(settings.blog_slider_config || '{"autoplay":true,"autoplayDelay":4000,"loop":true,"pauseOnHover":true}');
  const blogSection = JSON.parse(settings.home_blog_section || "{}");

  // Filter products based on active featured flags
  const filteredProducts = featuredProducts.filter((p) => {
    if (featuredFlags.bestSeller && p.isBestSeller) return true;
    if (featuredFlags.newProduct && p.isNew) return true;
    return false;
  }).slice(0, 8);

  const socialLinks = {
    instagram: settings.social_instagram || "",
    facebook: settings.social_facebook || "",
    twitter: settings.social_twitter || "",
    linkedin: settings.social_linkedin || "",
  };

  const heroSliderConfig: HeroSliderConfig = JSON.parse(
    settings.hero_slider_config || '{"autoplay":true,"autoplayDelay":5000,"loop":true,"pauseOnHover":true}'
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seaquill-cms-production.up.railway.app";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sea-Quill Indonesia",
    url: siteUrl,
    logo: `${siteUrl}/assets/img/logo.svg`,
    sameAs: [
      socialLinks.instagram,
      socialLinks.facebook,
      socialLinks.twitter,
      socialLinks.linkedin,
    ].filter(Boolean),
    description: "Sea-Quill menyediakan suplemen kesehatan berkualitas premium dengan sertifikasi BPOM dan Halal.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {/* Hero Area */}
      <HeroSlider slides={heroSlides} socialLinks={socialLinks} sliderConfig={heroSliderConfig} />

      {/* Brand Partners */}
      <BrandPartners brands={brandPartners} sliderConfig={brandSliderConfig} />

      {/* Feature Cards */}
      <FeatureCards features={featureCards} />

      {/* About Area */}
      <AboutSection data={aboutSection} />

      {/* Service Area */}
      <ServiceList data={serviceList} />

      {/* Product Slider */}
      <ProductSlider products={filteredProducts} section={productSection} activeFlags={featuredFlags} sliderConfig={productSliderConfig} />

      {/* Blog Slider */}
      <BlogSlider blogs={recentBlogs} section={blogSection} sliderConfig={blogSliderConfig} />
    </>
  );
}
