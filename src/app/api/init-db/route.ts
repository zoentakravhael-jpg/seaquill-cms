import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";

// This endpoint initializes the database if it's empty
export async function GET() {
  try {
    // Check if data already exists
    const productCount = await prisma.productCategory.count();
    if (productCount > 0) {
      return NextResponse.json({ message: "Database already initialized", status: "ok" });
    }

    console.log("[INIT-DB] Starting database initialization...");

    // Clean existing data
    await prisma.product.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.blogCategory.deleteMany();
    await prisma.heroSlide.deleteMany();
    await prisma.brandPartner.deleteMany();
    await prisma.galleryItem.deleteMany();
    await prisma.siteSetting.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.adminUser.deleteMany();
    await prisma.heroSlideGroup.deleteMany();

    // ──────────────────────────────────────────
    // Product Categories
    // ──────────────────────────────────────────
    const productCategories = await Promise.all([
      prisma.productCategory.create({
        data: {
          slug: "beauty-health",
          title: "Beauty & Health",
          icon: "/assets/img/icon/service_1_1.svg",
          description:
            "Membantu menjaga kecantikan kulit, rambut, dan kuku dari dalam, serta mendukung kesehatan tubuh secara menyeluruh.",
          sortOrder: 1,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "mom-kids",
          title: "Mom & Kids",
          icon: "/assets/img/icon/service_1_2.svg",
          description:
            "Formula khusus untuk kebutuhan ibu dan anak, membantu pertumbuhan optimal, menjaga daya tahan tubuh.",
          sortOrder: 2,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "multivitamin",
          title: "Multivitamin",
          icon: "/assets/img/icon/service_1_3.svg",
          description:
            "Suplemen multivitamin lengkap untuk memenuhi kebutuhan harian vitamin dan mineral.",
          sortOrder: 3,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "imun-daya-tahan-tubuh",
          title: "Imun & Daya Tahan Tubuh",
          icon: "/assets/img/icon/service_1_4.svg",
          description:
            "Produk khusus untuk meningkatkan sistem imun dan daya tahan tubuh terhadap berbagai penyakit.",
          sortOrder: 4,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "kesehatan-jantung",
          title: "Kesehatan Jantung",
          icon: "/assets/img/icon/service_1_5.svg",
          description: "Mendukung kesehatan jantung dan sistem peredaran darah dengan nutrisi khusus.",
          sortOrder: 5,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "kesehatan-kulit",
          title: "Kesehatan Kulit",
          icon: "/assets/img/icon/service_1_6.svg",
          description: "Produk untuk menjaga kesehatan, kelembutan, dan kecantikan kulit dari dalam.",
          sortOrder: 6,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "kesehatan-sendi",
          title: "Kesehatan Sendi",
          icon: "/assets/img/icon/service_1_7.svg",
          description: "Formula khusus untuk menjaga kesehatan sendi, tulang, dan fleksibilitas tubuh.",
          sortOrder: 7,
        },
      }),
      prisma.productCategory.create({
        data: {
          slug: "vitamin-kolesterol",
          title: "Vitamin Kolesterol",
          icon: "/assets/img/icon/service_1_8.svg",
          description: "Membantu menjaga kadar kolesterol dan lemak darah tetap normal dan sehat.",
          sortOrder: 8,
        },
      }),
    ]);

    // Create products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          slug: "sea-quill-omega-3",
          name: "Sea-Quill Omega 3",
          categoryId: productCategories[4].id,
          description: "Suplemen omega 3 premium untuk kesehatan jantung",
          image: "/assets/img/product/omega3.jpg",
          stock: true,
          sku: "SQ-OMEGA3-001",
          sortOrder: 1,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-vitamin-c",
          name: "Sea-Quill Vitamin C",
          categoryId: productCategories[2].id,
          description: "Vitamin C tinggi untuk imun tubuh",
          image: "/assets/img/product/vitc.jpg",
          stock: true,
          sku: "SQ-VITC-001",
          sortOrder: 2,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-collagen",
          name: "Sea-Quill Collagen",
          categoryId: productCategories[0].id,
          description: "Kolagen premium untuk kesehatan kulit",
          image: "/assets/img/product/collagen.jpg",
          stock: true,
          sku: "SQ-COL-001",
          sortOrder: 3,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-prenatal",
          name: "Sea-Quill Prenatal",
          categoryId: productCategories[1].id,
          description: "Formula khusus untuk ibu hamil",
          image: "/assets/img/product/prenatal.jpg",
          stock: true,
          sku: "SQ-PREN-001",
          sortOrder: 4,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-joint-care",
          name: "Sea-Quill Joint Care",
          categoryId: productCategories[6].id,
          description: "Suplemen untuk kesehatan sendi dan tulang",
          image: "/assets/img/product/joint.jpg",
          stock: true,
          sku: "SQ-JOINT-001",
          sortOrder: 5,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-glucosamine",
          name: "Sea-Quill Glucosamine",
          categoryId: productCategories[6].id,
          description: "Glucosamine untuk mobilitas sendi",
          image: "/assets/img/product/glucosamine.jpg",
          stock: true,
          sku: "SQ-GLUC-001",
          sortOrder: 6,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-vitamin-d",
          name: "Sea-Quill Vitamin D",
          categoryId: productCategories[2].id,
          description: "Vitamin D untuk kesehatan tulang dan imun",
          image: "/assets/img/product/vitd.jpg",
          stock: true,
          sku: "SQ-VITD-001",
          sortOrder: 7,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-multivitamin",
          name: "Sea-Quill Multivitamin",
          categoryId: productCategories[2].id,
          description: "Multivitamin lengkap untuk kebutuhan sehari-hari",
          image: "/assets/img/product/multivit.jpg",
          stock: true,
          sku: "SQ-MULTI-001",
          sortOrder: 8,
        },
      }),
      prisma.product.create({
        data: {
          slug: "sea-quill-beauty-boost",
          name: "Sea-Quill Beauty Boost",
          categoryId: productCategories[0].id,
          description: "Suplemen untuk kecantikan dari dalam",
          image: "/assets/img/product/beauty.jpg",
          stock: true,
          sku: "SQ-BEAUTY-001",
          sortOrder: 9,
        },
      }),
    ]);

    // Create blog categories
    const blogCategories = await Promise.all([
      prisma.blogCategory.create({
        data: {
          slug: "tips-kesehatan",
          title: "Tips Kesehatan",
          sortOrder: 1,
        },
      }),
      prisma.blogCategory.create({
        data: {
          slug: "resep-sehat",
          title: "Resep Sehat",
          sortOrder: 2,
        },
      }),
      prisma.blogCategory.create({
        data: {
          slug: "berita-produk",
          title: "Berita Produk",
          sortOrder: 3,
        },
      }),
      prisma.blogCategory.create({
        data: {
          slug: "testimoni",
          title: "Testimoni",
          sortOrder: 4,
        },
      }),
      prisma.blogCategory.create({
        data: {
          slug: "panduan-kesehatan",
          title: "Panduan Kesehatan",
          sortOrder: 5,
        },
      }),
    ]);

    // Create blog posts
    const now = new Date();
    await Promise.all([
      prisma.blogPost.create({
        data: {
          slug: "manfaat-omega-3-untuk-kesehatan-jantung",
          title: "Manfaat Omega 3 untuk Kesehatan Jantung",
          categoryId: blogCategories[0].id,
          content:
            "Omega 3 adalah asam lemak esensial yang sangat penting untuk kesehatan jantung. Dalam artikel ini kami membahas manfaat lengkapnya.",
          excerpt: "Pelajari manfaat omega 3 untuk jantung yang sehat.",
          image: "/assets/img/blog/omega3-benefit.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "vitamin-c-tingkatkan-imun",
          title: "Vitamin C untuk Meningkatkan Sistem Imun",
          categoryId: blogCategories[0].id,
          content: "Vitamin C adalah antioksidan yang membantu meningkatkan sistem imun tubuh.",
          excerpt: "Tingkatkan imun Anda dengan vitamin C berkualitas.",
          image: "/assets/img/blog/vitc-immune.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "resep-smoothie-sehat",
          title: "Resep Smoothie Sehat untuk Pagi",
          categoryId: blogCategories[1].id,
          content: "Resep smoothie yang mudah dibuat dengan bahan-bahan alami.",
          excerpt: "Mulai pagi Anda dengan smoothie sehat.",
          image: "/assets/img/blog/smoothie.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "peluncuran-produk-baru-2026",
          title: "Peluncuran Produk Baru Sea-Quill 2026",
          categoryId: blogCategories[2].id,
          content: "Sea-Quill memperkenalkan rangkaian produk baru dengan formula terbaik.",
          excerpt: "Produk terbaru dari Sea-Quill telah diluncurkan.",
          image: "/assets/img/blog/new-product.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "testimoni-pelanggan-puas",
          title: "Testimoni: Pelanggan Puas dengan Hasil",
          categoryId: blogCategories[3].id,
          content:
            "Ribuan pelanggan telah merasakan manfaat produk Sea-Quill untuk kesehatan mereka.",
          excerpt: "Baca testimoni pelanggan yang puas dengan produk kami.",
          image: "/assets/img/blog/testimonial.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "panduan-konsumsi-suplemen",
          title: "Panduan Lengkap Konsumsi Suplemen",
          categoryId: blogCategories[4].id,
          content: "Panduan cara minum suplemen yang benar untuk hasil optimal.",
          excerpt: "Panduan lengkap untuk hasil maksimal dari suplemen.",
          image: "/assets/img/blog/guide.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "kollagen-untuk-kulit-sehat",
          title: "Kollagen: Rahasia Kulit Sehat dan Muda",
          categoryId: blogCategories[0].id,
          content: "Kollagen adalah protein penting untuk elastisitas kulit.",
          excerpt: "Dapatkan kulit sehat dengan kollagen premium.",
          image: "/assets/img/blog/collagen-skin.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
      prisma.blogPost.create({
        data: {
          slug: "kesehatan-ibu-hamil",
          title: "Suplemen Terbaik untuk Kesehatan Ibu Hamil",
          categoryId: blogCategories[4].id,
          content: "Nutrisi penting yang dibutuhkan ibu hamil untuk kesehatan optimal.",
          excerpt: "Jaga kesehatan Anda dan bayi dengan suplemen tepat.",
          image: "/assets/img/blog/pregnant-health.jpg",
          author: "Admin",
          publishedAt: now,
          status: "published",
        },
      }),
    ]);

    // Create admin user
    const hashedPassword = hashSync("seaquill2025", 10);
    await prisma.adminUser.create({
      data: {
        email: "admin@seaquill.com",
        password: hashedPassword,
        name: "Admin Seaquill",
        role: "admin",
      },
    });

    // Create site settings
    const settings = [
      { key: "site_name", value: "Seaquill" },
      { key: "site_description", value: "Suplemen Kesehatan Terpercaya" },
      { key: "phone", value: "+62 812-3456-7890" },
      { key: "email", value: "info@seaquill.com" },
      { key: "address", value: "Jakarta, Indonesia" },
      { key: "facebook", value: "https://facebook.com/seaquill" },
      { key: "instagram", value: "https://instagram.com/seaquill" },
      { key: "whatsapp", value: "https://wa.me/6281234567890" },
      { key: "about_title", value: "Tentang Seaquill" },
      { key: "about_description", value: "Seaquill adalah penyedia suplemen kesehatan berkualitas premium." },
      { key: "hero_title", value: "Suplemen Kesehatan Terpercaya" },
      { key: "hero_subtitle", value: "Bersertifikat BPOM & Halal" },
      { key: "smtp_host", value: "" },
      { key: "smtp_port", value: "587" },
      { key: "smtp_user", value: "" },
      { key: "smtp_pass", value: "" },
      { key: "from_email", value: "noreply@seaquill.com" },
      { key: "from_name", value: "Seaquill" },
      { key: "currency_symbol", value: "Rp" },
      { key: "currency_code", value: "IDR" },
    ];

    for (const setting of settings) {
      await prisma.siteSetting.create({ data: setting });
    }

    // Create hero slides
    const heroSlideGroup = await prisma.heroSlideGroup.create({
      data: {
        name: "Default",
        active: true,
      },
    });

    await Promise.all([
      prisma.heroSlide.create({
        data: {
          title: "Suplemen Kesehatan Premium",
          subtitle: "Bersertifikat BPOM & Halal",
          bgImage: "/assets/img/banner/slide1.jpg",
          active: true,
          groupId: heroSlideGroup.id,
        },
      }),
      prisma.heroSlide.create({
        data: {
          title: "Produk Terbaik untuk Keluarga",
          subtitle: "Menjaga Kesehatan Anda",
          bgImage: "/assets/img/banner/slide2.jpg",
          active: true,
          groupId: heroSlideGroup.id,
        },
      }),
      prisma.heroSlide.create({
        data: {
          title: "Kualitas Terpercaya Sejak Lama",
          subtitle: "Dipercaya Jutaan Pelanggan",
          bgImage: "/assets/img/banner/slide3.jpg",
          active: true,
          groupId: heroSlideGroup.id,
        },
      }),
    ]);

    // Create brand partners
    await Promise.all([
      prisma.brandPartner.create({
        data: {
          name: "Partner 1",
          logoImage: "/assets/img/partner/partner1.png",
        },
      }),
      prisma.brandPartner.create({
        data: {
          name: "Partner 2",
          logoImage: "/assets/img/partner/partner2.png",
        },
      }),
      prisma.brandPartner.create({
        data: {
          name: "Partner 3",
          logoImage: "/assets/img/partner/partner3.png",
        },
      }),
      prisma.brandPartner.create({
        data: {
          name: "Partner 4",
          logoImage: "/assets/img/partner/partner4.png",
        },
      }),
      prisma.brandPartner.create({
        data: {
          name: "Partner 5",
          logoImage: "/assets/img/partner/partner5.png",
        },
      }),
      prisma.brandPartner.create({
        data: {
          name: "Partner 6",
          logoImage: "/assets/img/partner/partner6.png",
        },
      }),
      prisma.brandPartner.create({
        data: {
          name: "Partner 7",
          logoImage: "/assets/img/partner/partner7.png",
        },
      }),
    ]);

    // Create gallery items
    for (let i = 1; i <= 18; i++) {
      await prisma.galleryItem.create({
        data: {
          image: `/assets/img/gallery/gallery${i}.jpg`,
          caption: `Gallery Item ${i}`,
          platform: i % 3 === 0 ? "facebook" : i % 2 === 0 ? "tiktok" : "instagram",
        },
      });
    }

    console.log("[INIT-DB] Database initialized successfully!");
    return NextResponse.json({ message: "Database initialized successfully!", status: "initialized" });
  } catch (error) {
    console.error("[INIT-DB] Error initializing database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database", details: String(error) },
      { status: 500 }
    );
  }
}
