import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashSync } from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.product.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.blogCategory.deleteMany();

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
          "Membantu menjaga kecantikan kulit, rambut, dan kuku dari dalam, serta mendukung kesehatan tubuh secara menyeluruh. Cocok untuk Anda yang ingin tampil sehat dan percaya diri setiap hari.",
        sortOrder: 1,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "mom-kids",
        title: "Mom & Kids",
        icon: "/assets/img/icon/service_1_2.svg",
        description:
          "Formula khusus untuk kebutuhan ibu dan anak, membantu pertumbuhan optimal, menjaga daya tahan tubuh, serta mendukung kesehatan selama masa kehamilan, menyusui, dan tumbuh kembang si kecil.",
        sortOrder: 2,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "multivitamin",
        title: "Multivitamin",
        icon: "/assets/img/icon/service_1_3.svg",
        description:
          "Suplemen multivitamin lengkap untuk memenuhi kebutuhan harian vitamin dan mineral, menjaga stamina, meningkatkan energi, serta mendukung daya tahan tubuh sepanjang hari.",
        sortOrder: 3,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "vitamin-mineral",
        title: "Vitamin & Mineral",
        icon: "/assets/img/icon/service_1_4.svg",
        description:
          "Lengkapi kebutuhan vitamin dan mineral penting untuk menjaga kesehatan tulang, gigi, otot, serta fungsi tubuh lainnya. Ideal untuk menunjang aktivitas harian yang padat.",
        sortOrder: 4,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "kesehatan-jantung",
        title: "Kesehatan Jantung",
        icon: "/assets/img/icon/service_1_5.svg",
        description:
          "Suplemen dengan kandungan khusus seperti Omega-3 untuk membantu menjaga kesehatan jantung, menurunkan kolesterol, serta mendukung peredaran darah yang lancar.",
        sortOrder: 5,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "kesehatan-kulit",
        title: "Kesehatan Kulit",
        icon: "/assets/img/icon/service_1_6.svg",
        description:
          "Diformulasikan untuk membantu mencerahkan, melembapkan, dan melindungi kulit dari radikal bebas, sehingga kulit tetap sehat, halus, dan tampak awet muda serta mencegah tanda-tanda penuaan dini.",
        sortOrder: 6,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "kesehatan-sendi",
        title: "Kesehatan Sendi",
        icon: "/assets/img/icon/service_1_7.svg",
        description:
          "Membantu menjaga kelenturan dan kekuatan sendi, mengurangi nyeri sendi, serta menunjang aktivitas harian tanpa hambatan. Dengan kandungan nutrisi penting untuk kesehatan persendian.",
        sortOrder: 7,
      },
    }),
    prisma.productCategory.create({
      data: {
        slug: "vitamin-kolesterol",
        title: "Vitamin Kolesterol",
        icon: "/assets/img/icon/service_1_8.svg",
        description:
          "Membantu menurunkan kadar kolesterol dan trigliserida dalam darah secara alami, serta menjaga kesehatan pembuluh darah dan jantung, dan nutrisi penting yang mendukung metabolisme lemak.",
        sortOrder: 8,
      },
    }),
  ]);

  // Build category map for easy lookup
  const catMap = Object.fromEntries(
    productCategories.map((c) => [c.slug, c.id])
  );

  // ──────────────────────────────────────────
  // Products
  // ──────────────────────────────────────────
  await prisma.product.createMany({
    data: [
      {
        name: "Sea-Quill Omega 3 Salmon",
        slug: "omega-3-salmon",
        image: "/assets/img/product/product_1_1.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Omega 3 Salmon adalah suplemen minyak ikan premium yang mengandung asam lemak Omega-3 EPA & DHA murni dari salmon Norwegia. Membantu menjaga kesehatan jantung, fungsi otak, serta mendukung daya tahan tubuh setiap hari.",
        description:
          "Suplemen ini mengandung minyak ikan salmon alami yang kaya Omega-3 (EPA & DHA) untuk mendukung kesehatan jantung, otak, mata, dan persendian. Diproses dengan teknologi modern sehingga kualitas dan kemurniannya terjaga.",
        composition: "Salmon Oil, Gelatin, Glycerin, Water, Vitamin E.",
        dosage:
          "1-2 kapsul per hari setelah makan atau sesuai anjuran dokter.",
        sku: "SQ-OM3-60",
        tags: ["Kesehatan Jantung", "Otak", "Salmon Oil"],
        stock: true,
        rating: 5.0,
        reviewCount: 12,
        features: [
          "Sumber Omega-3 berkualitas tinggi dari salmon Norwegia",
          "Membantu menurunkan kolesterol & trigliserida",
          "Mendukung fungsi otak dan kesehatan mata",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: true,
        isNew: false,
        sortOrder: 1,
        categoryId: catMap["kesehatan-jantung"],
      },
      {
        name: "Sea-Quill Calcium",
        slug: "calcium",
        image: "/assets/img/product/product_1_2.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Calcium membantu menjaga kepadatan tulang dan gigi, serta mendukung fungsi otot dan saraf. Ideal untuk semua usia, terutama wanita dan lansia.",
        description:
          "Suplemen kalsium berkualitas tinggi untuk mendukung kesehatan tulang, gigi, dan fungsi otot. Dilengkapi dengan Vitamin D3 untuk penyerapan kalsium yang optimal.",
        composition: "Calcium Carbonate, Vitamin D3, Magnesium, Zinc.",
        dosage: "1 tablet per hari setelah makan.",
        sku: "SQ-CAL-60",
        tags: ["Tulang", "Kalsium", "Vitamin D"],
        stock: true,
        rating: 5.0,
        reviewCount: 8,
        features: [
          "Kalsium berkualitas tinggi untuk kepadatan tulang",
          "Dilengkapi Vitamin D3 untuk penyerapan optimal",
          "Cocok untuk semua usia",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: false,
        isNew: false,
        sortOrder: 2,
        categoryId: catMap["vitamin-mineral"],
      },
      {
        name: "Sea-Quill Vitamin C 1000mg",
        slug: "vitamin-c-1000mg",
        image: "/assets/img/product/product_1_3.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Vitamin C 1000mg dengan formula high-potency untuk meningkatkan daya tahan tubuh, membantu produksi kolagen, dan melindungi sel dari radikal bebas.",
        description:
          "Vitamin C dosis tinggi 1000mg dalam bentuk tablet yang mudah dikonsumsi. Membantu meningkatkan imunitas, mempercepat pemulihan, dan menjaga kesehatan kulit.",
        composition: "Ascorbic Acid 1000mg, Citrus Bioflavonoids, Rose Hips.",
        dosage: "1 tablet per hari setelah makan.",
        sku: "SQ-VC-1000",
        tags: ["Imunitas", "Vitamin C", "Antioksidan"],
        stock: true,
        rating: 5.0,
        reviewCount: 15,
        features: [
          "Vitamin C dosis tinggi 1000mg",
          "Meningkatkan daya tahan tubuh",
          "Membantu produksi kolagen untuk kulit sehat",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: true,
        isNew: false,
        sortOrder: 3,
        categoryId: catMap["multivitamin"],
      },
      {
        name: "Sea-Quill Biotin",
        slug: "biotin",
        image: "/assets/img/product/product_1_4.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Biotin mendukung kesehatan rambut, kulit, dan kuku dari dalam. Dengan formula premium untuk kecantikan alami Anda.",
        description:
          "Biotin (Vitamin B7) adalah nutrisi penting untuk menjaga kesehatan rambut, kulit, dan kuku. Membantu metabolisme energi dan mendukung pertumbuhan sel.",
        composition: "Biotin 5000mcg, Vitamin E, Zinc.",
        dosage: "1 kapsul per hari.",
        sku: "SQ-BIO-60",
        tags: ["Kecantikan", "Rambut", "Kulit", "Kuku"],
        stock: true,
        rating: 4.8,
        reviewCount: 6,
        features: [
          "Biotin 5000mcg untuk rambut dan kuku kuat",
          "Mendukung kesehatan kulit dari dalam",
          "Formula premium untuk kecantikan alami",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: false,
        isNew: true,
        sortOrder: 4,
        categoryId: catMap["beauty-health"],
      },
      {
        name: "Sea-Quill Kids Multivitamin",
        slug: "kids-multivitamin",
        image: "/assets/img/product/product_1_5.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Kids Multivitamin diformulasikan khusus untuk anak-anak, mendukung tumbuh kembang optimal dan menjaga daya tahan tubuh si kecil.",
        description:
          "Multivitamin lengkap untuk anak-anak dengan rasa buah yang disukai. Mengandung vitamin A, C, D, E, dan mineral penting untuk pertumbuhan.",
        composition:
          "Vitamin A, C, D3, E, B Complex, Zinc, Iron, Calcium.",
        dosage: "1 tablet kunyah per hari.",
        sku: "SQ-KID-60",
        tags: ["Anak", "Multivitamin", "Tumbuh Kembang"],
        stock: true,
        rating: 5.0,
        reviewCount: 10,
        features: [
          "Formula lengkap untuk tumbuh kembang anak",
          "Rasa buah yang disukai anak-anak",
          "Mengandung vitamin dan mineral essential",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: false,
        isNew: false,
        sortOrder: 5,
        categoryId: catMap["mom-kids"],
      },
      {
        name: "Sea-Quill Glucosamine",
        slug: "glucosamine",
        image: "/assets/img/product/product_1_6.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Glucosamine membantu menjaga kesehatan sendi dan tulang rawan, mengurangi nyeri sendi, serta menunjang mobilitas harian.",
        description:
          "Glucosamine Sulfate 1500mg untuk membantu regenerasi tulang rawan dan melindungi persendian. Cocok untuk usia 40+ dan mereka yang aktif berolahraga.",
        composition:
          "Glucosamine Sulfate 1500mg, Chondroitin Sulfate, MSM.",
        dosage: "1 tablet per hari setelah makan.",
        sku: "SQ-GLU-60",
        tags: ["Sendi", "Tulang Rawan", "Glucosamine"],
        stock: true,
        rating: 4.9,
        reviewCount: 7,
        features: [
          "Glucosamine 1500mg untuk kesehatan sendi",
          "Chondroitin & MSM untuk perlindungan tulang rawan",
          "Mengurangi nyeri dan kekakuan sendi",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: false,
        isNew: false,
        sortOrder: 6,
        categoryId: catMap["kesehatan-sendi"],
      },
      {
        name: "Sea-Quill Collagen",
        slug: "collagen",
        image: "/assets/img/product/product_1_7.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Collagen membantu menjaga elastisitas dan kelembapan kulit, mengurangi kerutan, serta mendukung kesehatan sendi dan tulang.",
        description:
          "Marine Collagen Peptides dari ikan laut dalam untuk penyerapan optimal. Membantu regenerasi kulit dan menjaga kekenyalan alami.",
        composition: "Marine Collagen Peptides, Vitamin C, Hyaluronic Acid.",
        dosage: "1-2 kapsul per hari.",
        sku: "SQ-COL-60",
        tags: ["Kulit", "Anti Aging", "Collagen"],
        stock: true,
        rating: 4.9,
        reviewCount: 11,
        features: [
          "Marine Collagen dari ikan laut dalam",
          "Menjaga elastisitas dan kelembapan kulit",
          "Dilengkapi Vitamin C & Hyaluronic Acid",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: true,
        isNew: false,
        sortOrder: 7,
        categoryId: catMap["kesehatan-kulit"],
      },
      {
        name: "Sea-Quill Red Yeast Rice",
        slug: "red-yeast-rice",
        image: "/assets/img/product/product_1_8.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Red Yeast Rice membantu menurunkan kadar kolesterol secara alami dan menjaga kesehatan kardiovaskular.",
        description:
          "Red Yeast Rice (Angkak) mengandung Monacolin K alami yang membantu menghambat produksi kolesterol berlebih di hati. Alternatif alami untuk menjaga kadar kolesterol.",
        composition: "Red Yeast Rice Extract, Coenzyme Q10, Vitamin E.",
        dosage: "1 kapsul per hari setelah makan malam.",
        sku: "SQ-RYR-60",
        tags: ["Kolesterol", "Jantung", "Red Yeast Rice"],
        stock: true,
        rating: 4.7,
        reviewCount: 5,
        features: [
          "Monacolin K alami untuk menurunkan kolesterol",
          "Dilengkapi CoQ10 untuk kesehatan jantung",
          "Alternatif alami tanpa efek samping statin",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: false,
        isNew: true,
        sortOrder: 8,
        categoryId: catMap["vitamin-kolesterol"],
      },
      {
        name: "Sea-Quill Prenatal DHA",
        slug: "prenatal-dha",
        image: "/assets/img/product/product_1_9.jpg",
        images: [
          "/assets/img/product/single-image-1.jpg",
          "/assets/img/product/single-image-2.jpg",
          "/assets/img/product/single-image-3.jpg",
        ],
        shortDescription:
          "Sea-Quill Prenatal DHA diformulasikan untuk ibu hamil dan menyusui, mendukung perkembangan otak dan mata janin.",
        description:
          "DHA berkualitas tinggi dari minyak ikan untuk mendukung perkembangan otak, mata, dan sistem saraf janin. Aman untuk ibu hamil dan menyusui.",
        composition: "DHA 200mg, EPA 100mg, Folic Acid, Iron, Calcium.",
        dosage: "1 kapsul per hari setelah makan.",
        sku: "SQ-PRE-60",
        tags: ["Kehamilan", "DHA", "Ibu Hamil"],
        stock: true,
        rating: 5.0,
        reviewCount: 9,
        features: [
          "DHA 200mg untuk perkembangan otak janin",
          "Dilengkapi asam folat dan zat besi",
          "Aman untuk ibu hamil & menyusui",
          "Telah bersertifikat BPOM & Halal",
        ],
        isBestSeller: false,
        isNew: true,
        sortOrder: 9,
        categoryId: catMap["mom-kids"],
      },
    ],
  });

  // ──────────────────────────────────────────
  // Blog Categories
  // ──────────────────────────────────────────
  const blogCategories = await Promise.all([
    prisma.blogCategory.create({
      data: { slug: "tips-sehat", title: "Tips Sehat", sortOrder: 1 },
    }),
    prisma.blogCategory.create({
      data: {
        slug: "imun-daya-tahan-tubuh",
        title: "Imun & Daya Tahan Tubuh",
        sortOrder: 2,
      },
    }),
    prisma.blogCategory.create({
      data: { slug: "nutrisi-gizi", title: "Nutrisi & Gizi", sortOrder: 3 },
    }),
    prisma.blogCategory.create({
      data: {
        slug: "panduan-suplemen",
        title: "Panduan Suplemen",
        sortOrder: 4,
      },
    }),
    prisma.blogCategory.create({
      data: { slug: "kecantikan", title: "Kecantikan", sortOrder: 5 },
    }),
  ]);

  const blogCatMap = Object.fromEntries(
    blogCategories.map((c) => [c.slug, c.id])
  );

  // ──────────────────────────────────────────
  // Blog Posts
  // ──────────────────────────────────────────
  await prisma.blogPost.createMany({
    data: [
      {
        title: "How to Keep Your Loved Ones Healthy Year-Round",
        slug: "keep-loved-ones-healthy",
        image: "/assets/img/blog/blog-grid-1.jpg",
        author: "Jane Doe",
        excerpt:
          "Preventive healthcare is the key to long-term well-being. Regular check-ups, screenings, and vaccinations help detect potential health issues early.",
        content:
          "Preventive healthcare is the key to long-term well-being. Regular check-ups, screenings, and vaccinations help detect potential health issues early, allowing for timely intervention and reducing the risk of serious illnesses. Simple lifestyle changes such as maintaining a balanced diet, staying active, and managing stress contribute significantly to disease prevention. Investing in preventive care today ensures a healthier future and lowers healthcare costs in the long run.",
        tags: ["Treatment", "Health", "Clinic", "Doctors"],
        categoryId: blogCatMap["tips-sehat"],
      },
      {
        title:
          "How to Choose the Right Primary Care Doctor for Your Need",
        slug: "choose-right-doctor",
        image: "/assets/img/blog/blog-grid-2.jpg",
        author: "Samantha Green",
        excerpt:
          "Choosing the right primary care doctor is a crucial decision for your health journey. Learn what to look for.",
        content:
          "Preventive healthcare is the key to long-term well-being. Regular check-ups, screenings, and vaccinations help detect potential health issues early, allowing for timely intervention and reducing the risk of serious illnesses. Hypertension, commonly known as high blood pressure, often develops without noticeable symptoms, making it a silent killer. If left untreated, it can lead to serious health complications such as heart disease, stroke, and kidney failure.",
        tags: ["Treatment", "Health", "Doctors"],
        categoryId: blogCatMap["panduan-suplemen"],
      },
      {
        title: "10 Essential Health Screenings You Shouldn't Ignore",
        slug: "essential-health-screenings",
        image: "/assets/img/blog/blog-grid-3.jpg",
        author: "Robin Son",
        excerpt:
          "Regular health screenings are vital for early detection. Here are 10 screenings you shouldn't skip.",
        content:
          "Advancements in technology are revolutionizing the healthcare industry, improving patient outcomes and making medical services more accessible. Telemedicine allows patients to consult with doctors remotely, reducing wait times and increasing convenience.",
        tags: ["Health", "Screening"],
        categoryId: blogCatMap["tips-sehat"],
      },
      {
        title: "Strategies for Effective Time Management",
        slug: "effective-time-management",
        image: "/assets/img/blog/blog-grid-4.jpg",
        author: "Jenny Lee",
        excerpt:
          "Managing your time effectively can significantly improve your health and productivity.",
        content:
          "Mental health is closely connected to physical well-being. Stress, anxiety, and depression can contribute to physical ailments such as high blood pressure, digestive issues, and a weakened immune system.",
        tags: ["Health", "Lifestyle"],
        categoryId: blogCatMap["nutrisi-gizi"],
      },
      {
        title: "Techniques for Enhancing Team Collaboration",
        slug: "enhancing-team-collaboration",
        image: "/assets/img/blog/blog-grid-5.jpg",
        author: "Jane Doe",
        excerpt:
          "Collaboration in healthcare teams leads to better patient outcomes and more efficient care delivery.",
        content:
          "A well-balanced diet plays a crucial role in preventing chronic diseases such as diabetes, obesity, and heart disease. Nutrient-dense foods rich in vitamins, minerals, and antioxidants strengthen the immune system and promote overall health.",
        tags: ["Health", "Wellness"],
        categoryId: blogCatMap["kecantikan"],
      },
      {
        title: "10 Essential Health Screenings You Shouldn't Ignore",
        slug: "essential-screenings-2",
        image: "/assets/img/blog/blog-grid-6.jpg",
        author: "John Smith",
        excerpt:
          "Don't miss these essential health screenings that could save your life.",
        content:
          "Reducing processed foods, consuming more fruits and vegetables, and staying hydrated are essential for optimal well-being. Healthy eating is not just about weight management—it's about fueling the body for longevity and disease prevention.",
        tags: ["Screening", "Health"],
        categoryId: blogCatMap["imun-daya-tahan-tubuh"],
      },
      {
        title: "How to Keep Your Loved Ones Healthy Year-Round",
        slug: "keep-loved-ones-2",
        image: "/assets/img/blog/blog-grid-7.jpg",
        author: "Samantha Green",
        excerpt:
          "Keep your family healthy throughout the year with these practical tips.",
        content:
          "Investing in preventive care today ensures a healthier future and lowers healthcare costs in the long run. Simple lifestyle changes such as maintaining a balanced diet, staying active, and managing stress contribute significantly to disease prevention.",
        tags: ["Family", "Health"],
        categoryId: blogCatMap["tips-sehat"],
      },
      {
        title:
          "How to Choose the Right Primary Care Doctor for Your Need",
        slug: "choose-right-doctor-2",
        image: "/assets/img/blog/blog-grid-8.jpg",
        author: "Michael Brown",
        excerpt:
          "Finding the right doctor is key to your healthcare journey.",
        content:
          "Choosing the right primary care doctor is about more than just proximity. Consider their specialization, communication style, and patient reviews to find the best fit for your needs.",
        tags: ["Doctors", "Healthcare"],
        categoryId: blogCatMap["panduan-suplemen"],
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(
    `   Created ${productCategories.length} product categories`
  );
  console.log(`   Created 9 products`);
  console.log(`   Created ${blogCategories.length} blog categories`);
  console.log(`   Created 8 blog posts`);

  // ──────────────────────────────────────────
  // Admin User
  // ──────────────────────────────────────────
  await prisma.activityLog.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.adminUser.create({
    data: {
      email: "admin@seaquill.com",
      password: hashSync("seaquill2025", 12),
      name: "Administrator",
    },
  });
  console.log(`   Created admin user: admin@seaquill.com / seaquill2025`);

  // ──────────────────────────────────────────
  // Site Settings (default values)
  // ──────────────────────────────────────────
  await prisma.siteSetting.deleteMany();
  const defaultSettings: Record<string, string> = {
    site_name: "Sea-Quill Indonesia",
    site_tagline: "Pilihan Suplemen Tepat untuk Kesehatan Optimal Anda",
    site_description:
      "Sea-Quill adalah suplemen kesehatan berkualitas dengan berbagai pilihan produk yang telah bersertifikat BPOM dan Halal. Kami berkomitmen membantu masyarakat Indonesia hidup lebih sehat dan aktif setiap hari.",
    site_copyright: "Copyright © 2025 Seaquill. All Rights Reserved.",
    contact_email: "info.seaquill@gmail.com",
    contact_phone: "021-1234-5678",
    contact_address: "Jl. Harmoni Plaza Blok A No. 8, Jakarta Pusat 10150",
    contact_whatsapp: "https://wa.me/6281234567890",
    social_facebook: "https://www.facebook.com/seaquill",
    social_instagram: "https://www.instagram.com/seaquill",
    social_twitter: "https://www.twitter.com/seaquill",
    social_youtube: "https://www.youtube.com/@seaquill",
    social_tiktok: "https://www.tiktok.com/@seaquill",
    social_linkedin: "https://www.linkedin.com/company/seaquill",
    social_pinterest: "",
    header_logo: "/assets/img/logo.svg",
    header_logo_sticky: "/assets/img/logo.jpg",
    header_badges: JSON.stringify([
      { icon: "/assets/img/certified.png", label: "Certified", value: "BPOM Certified" },
      { icon: "/assets/img/original.png", label: "Quality", value: "100% Original" },
      { icon: "/assets/img/halal.png", label: "Certified", value: "100% Halal" },
    ]),
    nav_menu: JSON.stringify([
      { label: "Beranda", href: "/", submenuSource: "" },
      { label: "Tentang Seaquill", href: "/tentang", submenuSource: "" },
      { label: "Produk Seaquill", href: "/produk", submenuSource: "produk" },
      { label: "Artikel", href: "/artikel", submenuSource: "artikel" },
      { label: "Promo & Event", href: "/promo", submenuSource: "" },
      { label: "Galeri", href: "/galeri", submenuSource: "" },
      { label: "Hubungi Kami", href: "/hubungi-kami", submenuSource: "" },
    ]),
    footer_nav: JSON.stringify([
      {
        title: "Produk Seaquill",
        source: "produk",
        links: [],
      },
      {
        title: "Artikel Kesehatan",
        source: "artikel",
        links: [],
      },
      {
        title: "Bantuan & Support",
        source: "custom",
        links: [
          { label: "FAQs", href: "/faq" },
          { label: "Kontak Kami", href: "/hubungi-kami" },
          { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
          { label: "Pusat Bantuan", href: "/pusat-bantuan" },
          { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
        ],
      },
    ]),
    social_shopee: "https://shopee.co.id/seaquill",
    social_tokopedia: "https://www.tokopedia.com/seaquill",
    social_lazada: "",
    social_tiktok_shop: "",
    home_feature_cards: JSON.stringify([
      {
        title: "Tips & Edukasi Kesehatan",
        text: "Temukan artikel, tips kesehatan, dan informasi gaya hidup sehat untuk mendukung aktivitas dan keseharian Anda bersama Sea-Quill",
        btnText: "Baca Artikel",
        href: "/artikel",
      },
      {
        title: "Terstandar BPOM & Halal",
        text: "Seluruh produk Sea-Quill telah bersertifikat BPOM dan Halal, diproduksi dengan standar internasional untuk kualitas dan keamanan maksimal.",
        btnText: "Tentang Seaquill",
        href: "/tentang",
      },
      {
        title: "100% Original & Promo Menarik",
        text: "Nikmati produk original langsung dari distributor resmi dengan promo spesial setiap bulan. Belanja aman dan nyaman di sini.",
        btnText: "Lihat Promo",
        href: "/hubungi-kami",
      },
    ]),
    home_about_section: JSON.stringify({
      subTitle: "Tentang Seaquill",
      heading: "Pilihan Tepat, untuk Hidup Sehat dan Berkualitas",
      paragraph: "Sea-Quill menghadirkan suplemen kesehatan terpercaya, dibuat dengan standar internasional dan inovasi terkini. Kami berkomitmen mendukung Anda dan keluarga dalam menjaga daya tahan tubuh dan kualitas hidup setiap hari.",
      checklist: [
        "Telah lulus uji BPOM dan bersertifikat Halal.",
        "Direkomendasikan oleh para ahli nutrisi.",
        "Formula sesuai kebutuhan masyarakat Indonesia.",
        "Mendukung gaya hidup sehat dan aktif.",
        "Pilihan lengkap untuk berbagai kebutuhan nutrisi.",
      ],
      ctaText: "Selengkapnya tentang Sea-Quill",
      ctaLink: "/tentang",
      image1: "/assets/img/home/home-3.jpg",
      image2: "/assets/img/home/home-1.jpg",
      image3: "/assets/img/home/home-2.jpg",
    }),
    home_service_list: JSON.stringify({
      subTitle: "Pilihan Produk",
      heading: "Manfaat Utama Produk Sea-Quill",
      paragraph: "Dapatkan manfaat optimal dari produk-produk Sea-Quill, diproses dengan teknologi terbaik dan selalu mengutamakan kualitas, keamanan, dan edukasi untuk keluarga Indonesia.",
      items: [
        {
          icon: "/assets/img/icon/service_1_1.svg",
          title: "Imunitas & Daya Tahan Tubuh",
          text: "Bantu tingkatkan sistem kekebalan tubuh Anda agar tetap fit dan tidak mudah sakit, cocok untuk segala usia.",
          image: "/assets/img/home/home-4.jpg",
        },
        {
          icon: "/assets/img/icon/service_1_2.svg",
          title: "Kesehatan Jantung & Pembuluh Darah",
          text: "Jaga kesehatan jantung, kolesterol, dan tekanan darah Anda dengan suplemen yang diformulasikan khusus.",
          image: "/assets/img/home/home-5.jpg",
        },
        {
          icon: "/assets/img/icon/service_1_3.svg",
          title: "Nutrisi Anak & Keluarga",
          text: "Dukungan nutrisi lengkap untuk tumbuh kembang anak dan kesehatan seluruh keluarga.",
          image: "/assets/img/home/home-6.jpg",
        },
        {
          icon: "/assets/img/icon/service_1_4.svg",
          title: "Vitalitas & Energi",
          text: "Bantu tingkatkan stamina, energi, dan vitalitas tubuh untuk aktivitas sehari-hari yang optimal.",
          image: "/assets/img/home/home-7.jpg",
        },
      ],
    }),
    home_product_section: JSON.stringify({
      subTitle: "Sea-Quill",
      heading: "Produk Unggulan",
      paragraph: "Temukan suplemen terbaik Sea-Quill untuk mendukung kesehatan keluarga Anda. Setiap produk terjamin keaslian, kualitas, dan sudah BPOM serta Halal.",
    }),
    home_blog_section: JSON.stringify({
      subTitle: "Artikel Kesehatan",
      heading: "Blog & Berita Sea-Quill",
      paragraph: "Temukan update seputar produk, edukasi, dan tren kesehatan terbaru langsung dari Sea-Quill.",
    }),
    // ── Phase 6C: Tentang Page Settings ──
    tentang_about_section: JSON.stringify({
      subTitle: "Tentang Seaquill",
      headingNormal: "Pilihan Tepat,",
      heading: "untuk Hidup Sehat dan Berkualitas",
      paragraph: "Sea-Quill menghadirkan suplemen kesehatan terpercaya, dibuat dengan standar internasional dan inovasi terkini. Kami berkomitmen mendukung Anda dan keluarga dalam menjaga daya tahan tubuh dan kualitas hidup setiap hari..",
      checklist: [
        "Formulasi berbahan baku alami & premium",
        "Aman, sudah bersertifikat BPOM & Halal MUI",
        "Membantu menjaga daya tahan tubuh setiap hari",
        "Mendukung kesehatan jantung, otak, dan sendi",
        "Pilihan suplemen lengkap sesuai kebutuhan Anda",
      ],
      aboutImage: "/assets/img/normal/about_4_1.jpg",
      videoImage: "/assets/img/normal/about-video.jpg",
      videoUrl: "https://www.youtube.com/watch?v=_sI_Ps7JSEk",
    }),
    tentang_feature_cards: JSON.stringify([
      {
        title: "Pilihan Suplemen Lengkap",
        text: "Dari kesehatan jantung, daya tahan tubuh, hingga kecantikan kulit – Sea-Quill hadir untuk seluruh kebutuhan keluarga.",
        btnText: "Lihat Produk",
        href: "/produk",
      },
      {
        title: "Terbukti Aman & Berkualitas",
        text: "Seluruh produk Sea-Quill telah lolos uji BPOM dan bersertifikat Halal, serta diproduksi sesuai standar internasional.",
        btnText: "Tentang Kami",
        href: "/tentang",
      },
      {
        title: "Dukungan Konsultasi",
        text: "Konsultasikan kebutuhan suplemen Anda dengan tim kami. Kami siap membantu memilih produk yang paling sesuai.",
        btnText: "Konsultasi",
        href: "/hubungi-kami",
      },
    ]),
    tentang_project_slider: JSON.stringify({
      subTitle: "Tentang Sea-Quill",
      headingNormal: "Solusi Suplemen Modern,",
      heading: "Kesehatan Berkualitas Setiap Hari",
      paragraph: "Sea-Quill adalah merek suplemen kesehatan terkemuka yang telah dipercaya masyarakat Indonesia untuk mendukung gaya hidup sehat. Dengan formulasi berkualitas tinggi, bahan alami, dan sertifikasi BPOM serta Halal, Sea-Quill selalu berkomitmen menghadirkan inovasi dan manfaat nyata bagi setiap keluarga Indonesia.",
      sideParagraph: "We have world class lab assistants. We are equipped with best medical services & reagents. We ensure best quality findings.",
      items: [
        {
          img: "/assets/img/project/project_1_1.jpg",
          title: "Produk Original 100% (BPOM & Halal)",
          text: "Setiap produk Sea-Quill terjamin keasliannya, memiliki sertifikasi BPOM dan Halal MUI. Aman untuk dikonsumsi setiap hari.",
        },
        {
          img: "/assets/img/project/project_1_2.jpg",
          title: "Varian Produk Lengkap",
          text: "Tersedia lebih dari 30 varian produk: multivitamin, Omega-3, herbal, kalsium, dan lain-lain, sesuai kebutuhan kesehatan Anda.",
        },
        {
          img: "/assets/img/project/project_1_3.jpg",
          title: "Manfaat Terbukti & Inovasi Terkini",
          text: "Didukung riset ilmiah, Sea-Quill terus menghadirkan inovasi formula untuk hasil optimal bagi kesehatan keluarga Anda.",
        },
      ],
    }),
    // ── Phase 6C: Hubungi Kami Page Settings ──
    hubungi_social_section: JSON.stringify({
      heading: "Temukan dan Ikuti Sea-Quill",
      subTitle: "Platform Sosial Media Kami",
      items: [
        {
          platform: "Instagram",
          icon: "/assets/img/icon/instagram.svg",
          title: "@seaquill.id",
          description: "Dapatkan info promo, edukasi kesehatan, dan inspirasi gaya hidup sehat langsung dari Instagram resmi Sea-Quill.",
          link: "https://instagram.com/seaquill.id",
          btnText: "Kunjungi Instagram",
        },
        {
          platform: "Facebook",
          icon: "/assets/img/icon/facebook.svg",
          title: "Sea-Quill Indonesia",
          description: "Like dan follow Facebook Sea-Quill untuk update berita, tips kesehatan, dan testimoni pengguna.",
          link: "https://facebook.com/seaquill.indonesia",
          btnText: "Kunjungi Facebook",
        },
        {
          platform: "TikTok",
          icon: "/assets/img/icon/tiktok.svg",
          title: "@seaquill.id",
          description: "Saksikan konten seru, tips kesehatan, dan edukasi suplemen dengan format video di TikTok Sea-Quill.",
          link: "https://tiktok.com/@seaquill.id",
          btnText: "Kunjungi TikTok",
        },
      ],
    }),
    hubungi_marketplace_section: JSON.stringify({
      heading: "Belanja Produk Sea-Quill di Sini",
      subTitle: "Marketplace Resmi Sea-Quill",
      items: [
        {
          platform: "Tokopedia",
          icon: "/assets/img/icon/tokopedia.svg",
          title: "Tokopedia Official",
          description: "Dapatkan produk Sea-Quill original dan promo menarik langsung dari official store kami di Tokopedia.",
          link: "https://tokopedia.com/seaquill",
          btnText: "Beli di Tokopedia",
        },
        {
          platform: "Shopee",
          icon: "/assets/img/icon/shopee.svg",
          title: "Shopee Official",
          description: "Cari produk Sea-Quill dan nikmati kemudahan belanja serta voucher di Shopee.",
          link: "https://shopee.co.id/seaquill",
          btnText: "Beli di Shopee",
        },
        {
          platform: "Lazada",
          icon: "/assets/img/icon/lazada.svg",
          title: "Lazada Official Store",
          description: "Nikmati pengalaman belanja produk Sea-Quill yang aman dan mudah, dengan promo eksklusif dan layanan pengiriman cepat hanya di Lazada Official Store kami.",
          link: "https://www.lazada.co.id/shop/seaquill-official/",
          btnText: "Beli di Lazada",
        },
        {
          platform: "TikTok Shop",
          icon: "/assets/img/icon/tiktok.svg",
          title: "TikTok Shop Official",
          description: "Belanja langsung lewat TikTok Shop Sea-Quill dan dapatkan penawaran spesial serta flash sale selama live streaming bersama kami!",
          link: "https://www.tiktok.com/@seaquill.id/shop",
          btnText: "Beli di TikTok Shop",
        },
      ],
    }),
    hubungi_contact_section: JSON.stringify({
      heading: "Kirim Pesan kepada Kami",
      subTitle: "Hubungi Kami",
    }),
  };
  await Promise.all(
    Object.entries(defaultSettings).map(([key, value]) =>
      prisma.siteSetting.create({ data: { key, value } })
    )
  );
  console.log(`   Created ${Object.keys(defaultSettings).length} site settings`);

  // ──────────────────────────────────────────
  // Hero Slides
  // ──────────────────────────────────────────
  await prisma.heroSlide.deleteMany();
  await Promise.all([
    prisma.heroSlide.create({
      data: {
        subtitle: "Sehat Setiap Hari, Nikmati Hidup Berkualitas",
        title: "Sea-Quill, Suplemen Terpercaya Untuk Kesehatan Anda dan Keluarga.",
        bgImage: "/assets/img/hero/hero_bg_1_1.jpg",
        ctaText: "Jelajahi Produk",
        ctaLink: "/produk",
        ctaText2: "Cek Manfaat Suplemen",
        ctaLink2: "/artikel",
        sortOrder: 1,
        active: true,
      },
    }),
    prisma.heroSlide.create({
      data: {
        subtitle: "Imun Kuat, Aktivitas Tanpa Batas",
        title: "Dukung Daya Tahan Tubuh Dengan Sea-Quill Solusi Suplemen Pilihan.",
        bgImage: "/assets/img/hero/hero_bg_1_1.jpg",
        ctaText: "Jelajahi Produk",
        ctaLink: "/produk",
        ctaText2: "Cek Manfaat Suplemen",
        ctaLink2: "/artikel",
        sortOrder: 2,
        active: true,
      },
    }),
    prisma.heroSlide.create({
      data: {
        subtitle: "Pilihan Suplemen Terbaik Untuk Anda",
        title: "Raih Hidup Sehat, Aktif, dan Bugar Bersama Sea-Quill, Setiap Hari.",
        bgImage: "/assets/img/hero/hero_bg_1_1.jpg",
        ctaText: "Jelajahi Produk",
        ctaLink: "/produk",
        ctaText2: "Cek Manfaat Suplemen",
        ctaLink2: "/artikel",
        sortOrder: 3,
        active: true,
      },
    }),
  ]);
  console.log("   Created 3 hero slides");

  // ──────────────────────────────────────────
  // Brand Partners
  // ──────────────────────────────────────────
  await prisma.brandPartner.deleteMany();
  const brandData = [
    { name: "Kimia Farma", logoImage: "/assets/img/home/kimia-farma.png", sortOrder: 1 },
    { name: "Watsons", logoImage: "/assets/img/home/watson.png", sortOrder: 2 },
    { name: "Guardian", logoImage: "/assets/img/home/guardian.png", sortOrder: 3 },
    { name: "Wellings", logoImage: "/assets/img/home/wellings.png", sortOrder: 4 },
    { name: "Boston", logoImage: "/assets/img/home/boston.png", sortOrder: 5 },
    { name: "Century", logoImage: "/assets/img/home/century.png", sortOrder: 6 },
    { name: "Boots", logoImage: "/assets/img/home/boots.png", sortOrder: 7 },
  ];
  await Promise.all(
    brandData.map((b) => prisma.brandPartner.create({ data: { ...b, active: true } }))
  );
  console.log(`   Created ${brandData.length} brand partners`);

  // ──────────────────────────────────────────
  // Gallery Items
  // ──────────────────────────────────────────
  await prisma.galleryItem.deleteMany();
  const galleryData = [
    { image: "/assets/img/widget/gallery_1_1.jpg", caption: "Seaquill Products", platform: "instagram", url: "https://www.instagram.com/p/C6yIzzALxZe/", sortOrder: 1 },
    { image: "/assets/img/widget/gallery_1_2.jpg", caption: "Healthy Living", platform: "instagram", url: "https://www.instagram.com/p/C6yIzzALxZe/", sortOrder: 2 },
    { image: "/assets/img/widget/gallery_1_3.jpg", caption: "Wellness Tips", platform: "instagram", url: "https://www.instagram.com/p/C6yIzzALxZe/", sortOrder: 3 },
    { image: "/assets/img/widget/gallery_1_4.jpg", caption: "Supplement Guide", platform: "instagram", url: "https://www.instagram.com/p/C6yIzzALxZe/", sortOrder: 4 },
    { image: "/assets/img/widget/gallery_1_1.jpg", caption: "Product Showcase", platform: "instagram", url: "https://www.instagram.com/p/C6yIzzALxZe/", sortOrder: 5 },
    { image: "/assets/img/widget/gallery_1_2.jpg", caption: "Health Education", platform: "instagram", url: "https://www.instagram.com/p/C6yIzzALxZe/", sortOrder: 6 },
    { image: "/assets/img/widget/gallery_1_1.jpg", caption: "Seaquill Community", platform: "facebook", url: "https://facebook.com/seaquill.indonesia", sortOrder: 1 },
    { image: "/assets/img/widget/gallery_1_2.jpg", caption: "Health Tips", platform: "facebook", url: "https://facebook.com/seaquill.indonesia", sortOrder: 2 },
    { image: "/assets/img/widget/gallery_1_3.jpg", caption: "Product Info", platform: "facebook", url: "https://facebook.com/seaquill.indonesia", sortOrder: 3 },
    { image: "/assets/img/widget/gallery_1_4.jpg", caption: "Wellness Journey", platform: "facebook", url: "https://facebook.com/seaquill.indonesia", sortOrder: 4 },
    { image: "/assets/img/widget/gallery_1_1.jpg", caption: "Daily Health", platform: "facebook", url: "https://facebook.com/seaquill.indonesia", sortOrder: 5 },
    { image: "/assets/img/widget/gallery_1_2.jpg", caption: "Supplement Facts", platform: "facebook", url: "https://facebook.com/seaquill.indonesia", sortOrder: 6 },
    { image: "/assets/img/widget/gallery_1_1.jpg", caption: "Seaquill TikTok", platform: "tiktok", url: "https://tiktok.com/@seaquill.id", sortOrder: 1 },
    { image: "/assets/img/widget/gallery_1_2.jpg", caption: "Health Reels", platform: "tiktok", url: "https://tiktok.com/@seaquill.id", sortOrder: 2 },
    { image: "/assets/img/widget/gallery_1_3.jpg", caption: "Supplement Tips", platform: "tiktok", url: "https://tiktok.com/@seaquill.id", sortOrder: 3 },
    { image: "/assets/img/widget/gallery_1_4.jpg", caption: "Healthy Lifestyle", platform: "tiktok", url: "https://tiktok.com/@seaquill.id", sortOrder: 4 },
    { image: "/assets/img/widget/gallery_1_1.jpg", caption: "Wellness Content", platform: "tiktok", url: "https://tiktok.com/@seaquill.id", sortOrder: 5 },
    { image: "/assets/img/widget/gallery_1_2.jpg", caption: "Product Review", platform: "tiktok", url: "https://tiktok.com/@seaquill.id", sortOrder: 6 },
  ];
  await Promise.all(
    galleryData.map((g) => prisma.galleryItem.create({ data: { ...g, active: true } }))
  );
  console.log(`   Created ${galleryData.length} gallery items`);

  // ──────────────────────────────────────────
  // Promo Items
  // ──────────────────────────────────────────
  await prisma.promoItem.deleteMany();
  const promoData = [
    {
      title: "Flash Sale 8.8 Seaquill",
      description: "Diskon hingga 40% untuk produk pilihan! Promo hanya berlaku 8-10 Agustus 2025. Jangan lewatkan!",
      image: "/assets/img/gallery/gallery_1_1.jpg",
      sortOrder: 1,
    },
    {
      title: "Cashback Spesial Shopee",
      description: "Belanja Seaquill di Shopee dapatkan cashback hingga Rp 50.000 tanpa minimum belanja.",
      image: "/assets/img/gallery/gallery_1_3.jpg",
      sortOrder: 2,
    },
    {
      title: "Gratis Ongkir Tokopedia",
      description: "Dapatkan gratis ongkir untuk pembelian semua produk Seaquill di Tokopedia selama bulan ini!",
      image: "/assets/img/gallery/gallery_1_4.jpg",
      sortOrder: 3,
    },
    {
      title: "Beli 2 Gratis 1 Multivitamin",
      description: "Setiap pembelian 2 botol multivitamin Seaquill, dapatkan 1 botol gratis. Berlaku hanya untuk produk tertentu selama Agustus 2025.",
      image: "/assets/img/gallery/gallery_1_5.jpg",
      sortOrder: 4,
    },
    {
      title: "Bundling Hemat Seaquill",
      description: "Dapatkan paket bundling Seaquill dengan harga spesial! Kombinasi produk pilihan untuk kebutuhan kesehatan keluarga Anda.",
      image: "/assets/img/gallery/gallery_1_2.jpg",
      sortOrder: 5,
    },
  ];
  await Promise.all(
    promoData.map((p) => prisma.promoItem.create({ data: { ...p, active: true } }))
  );
  console.log(`   Created ${promoData.length} promo items`);

  // ──────────────────────────────────────────
  // Event Items
  // ──────────────────────────────────────────
  await prisma.eventItem.deleteMany();
  const eventData = [
    {
      title: 'Live Streaming: "Rahasia Imun Kuat Bersama Nutritionist"',
      description: "Jangan lewatkan sesi live edukasi bareng pakar nutrisi Seaquill. Ada hadiah voucher untuk penanya terbaik!",
      image: "/assets/img/blog/blog_4_1.jpg",
      date: "21 Agustus 2025",
      location: "Instagram Live",
      sortOrder: 1,
    },
    {
      title: 'Seaquill Tokopedia Play: "Quiz & Hadiah"',
      description: "Main quiz live di Tokopedia Play, menangkan produk Seaquill gratis untuk 5 peserta tercepat!",
      image: "/assets/img/blog/blog_4_2.jpg",
      date: "31 Agustus 2025",
      location: "Tokopedia Play",
      sortOrder: 2,
    },
    {
      title: "Fun Walk & Health Check Gratis",
      description: "Ikuti Fun Walk Seaquill di Jakarta dan dapatkan pemeriksaan kesehatan gratis serta goody bag menarik!",
      image: "/assets/img/blog/blog_4_3.jpg",
      date: "10 September 2025",
      location: "Offline Jakarta",
      sortOrder: 3,
    },
  ];
  await Promise.all(
    eventData.map((e) => prisma.eventItem.create({ data: { ...e, active: true } }))
  );
  console.log(`   Created ${eventData.length} event items`);

  // ── Media Files ──────────────────────────────────────────
  console.log("Seeding media files...");
  const mediaData = [
    { filename: "logo.png", url: "/assets/img/logo.png", mimeType: "image/png", size: 15000, alt: "Logo Sea-Quill" },
    { filename: "logo-white.svg", url: "/assets/img/logo-white.svg", mimeType: "image/svg+xml", size: 8000, alt: "Logo Sea-Quill White" },
    { filename: "hero-1.jpg", url: "/assets/img/hero/hero-1.jpg", mimeType: "image/jpeg", size: 250000, alt: "Hero Slide 1" },
    { filename: "hero-2.jpg", url: "/assets/img/hero/hero-2.jpg", mimeType: "image/jpeg", size: 240000, alt: "Hero Slide 2" },
    { filename: "hero-3.jpg", url: "/assets/img/hero/hero-3.jpg", mimeType: "image/jpeg", size: 230000, alt: "Hero Slide 3" },
    { filename: "certified.png", url: "/assets/img/certified.png", mimeType: "image/png", size: 12000, alt: "Sertifikasi" },
    { filename: "halal.png", url: "/assets/img/halal.png", mimeType: "image/png", size: 10000, alt: "Halal" },
    { filename: "original.png", url: "/assets/img/original.png", mimeType: "image/png", size: 11000, alt: "Original" },
  ];
  await Promise.all(
    mediaData.map((m) => prisma.mediaFile.create({ data: m }))
  );
  console.log(`   Created ${mediaData.length} media files`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
