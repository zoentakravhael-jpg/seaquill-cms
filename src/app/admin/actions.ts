"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-log";
import { getSession } from "@/lib/session";

export type ActionResult = { success: true; redirect: string } | { success: false; error: string };

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createProductCategory(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!title || !slug) {
    return { success: false, error: "Title dan slug wajib diisi." };
  }

  const cat = await prisma.productCategory.create({
    data: { title, slug, icon: icon || "", description: description || "", sortOrder },
  });

  await logActivity("create", "product_category", cat.id, title);
  revalidatePath("/admin/kategori-produk");
  return { success: true, redirect: "/admin/kategori-produk" };
}

export async function updateProductCategory(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!title || !slug) {
    return { success: false, error: "Title dan slug wajib diisi." };
  }

  await prisma.productCategory.update({
    where: { id },
    data: { title, slug, icon: icon || "", description: description || "", sortOrder },
  });

  await logActivity("update", "product_category", id, title);
  revalidatePath("/admin/kategori-produk");
  return { success: true, redirect: "/admin/kategori-produk" };
}

export async function deleteProductCategory(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const cat = await prisma.productCategory.findUnique({ where: { id } });
  await prisma.productCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity("delete", "product_category", id, cat?.title);
  revalidatePath("/admin/kategori-produk");
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const images = (formData.get("images") as string)?.trim().split("\n").filter(Boolean).map(s => s.trim());
  const shortDescription = (formData.get("shortDescription") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const composition = (formData.get("composition") as string)?.trim() || "";
  const dosage = (formData.get("dosage") as string)?.trim() || "";
  const sku = (formData.get("sku") as string)?.trim() || "";
  const tags = (formData.get("tags") as string)?.trim().split(",").filter(Boolean).map(s => s.trim().toLowerCase());
  const features = (formData.get("features") as string)?.trim().split("\n").filter(Boolean).map(s => s.trim());
  const stock = formData.get("stock") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";
  const isNew = formData.get("isNew") === "on";
  const rating = parseFloat(formData.get("rating") as string) || 5.0;
  const reviewCount = parseInt(formData.get("reviewCount") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const categoryId = parseInt(formData.get("categoryId") as string);
  const status = (formData.get("status") as string)?.trim() || "draft";
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || "";
  const metaDescription = (formData.get("metaDescription") as string)?.trim() || "";
  const ogImage = (formData.get("ogImage") as string)?.trim() || "";

  if (!name || !slug || !categoryId) {
    return { success: false, error: "Name, slug, dan kategori wajib diisi." };
  }

  const product = await prisma.product.create({
    data: {
      name, slug, image: image || "", images, shortDescription, description,
      composition, dosage, sku, tags, features, stock, isBestSeller, isNew,
      rating, reviewCount, sortOrder, categoryId, status,
      metaTitle, metaDescription, ogImage,
    },
  });

  await logActivity("create", "product", product.id, name);
  revalidatePath("/admin/produk");
  return { success: true, redirect: "/admin/produk" };
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const images = (formData.get("images") as string)?.trim().split("\n").filter(Boolean).map(s => s.trim());
  const shortDescription = (formData.get("shortDescription") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const composition = (formData.get("composition") as string)?.trim() || "";
  const dosage = (formData.get("dosage") as string)?.trim() || "";
  const sku = (formData.get("sku") as string)?.trim() || "";
  const tags = (formData.get("tags") as string)?.trim().split(",").filter(Boolean).map(s => s.trim().toLowerCase());
  const features = (formData.get("features") as string)?.trim().split("\n").filter(Boolean).map(s => s.trim());
  const stock = formData.get("stock") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";
  const isNew = formData.get("isNew") === "on";
  const rating = parseFloat(formData.get("rating") as string) || 5.0;
  const reviewCount = parseInt(formData.get("reviewCount") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const categoryId = parseInt(formData.get("categoryId") as string);
  const status = (formData.get("status") as string)?.trim() || "draft";
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || "";
  const metaDescription = (formData.get("metaDescription") as string)?.trim() || "";
  const ogImage = (formData.get("ogImage") as string)?.trim() || "";

  if (!name || !slug || !categoryId) {
    return { success: false, error: "Name, slug, dan kategori wajib diisi." };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name, slug, image: image || "", images, shortDescription, description,
      composition, dosage, sku, tags, features, stock, isBestSeller, isNew,
      rating, reviewCount, sortOrder, categoryId, status,
      metaTitle, metaDescription, ogImage,
    },
  });

  await logActivity("update", "product", id, name);
  revalidatePath("/admin/produk");
  return { success: true, redirect: "/admin/produk" };
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const product = await prisma.product.findUnique({ where: { id } });
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity("delete", "product", id, product?.name);
  revalidatePath("/admin/produk");
}

export async function duplicateProduct(id: number): Promise<void> {
  await requireAuth();
  const source = await prisma.product.findUnique({ where: { id } });
  if (!source) return;

  // Generate unique slug
  let baseSlug = `${source.slug}-copy`;
  let candidate = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-${counter++}`;
  }

  const copy = await prisma.product.create({
    data: {
      name: `${source.name} (Copy)`,
      slug: candidate,
      image: source.image,
      images: source.images,
      shortDescription: source.shortDescription,
      description: source.description,
      composition: source.composition,
      dosage: source.dosage,
      sku: source.sku ? `${source.sku}-copy` : "",
      tags: source.tags,
      features: source.features,
      stock: source.stock,
      rating: source.rating,
      reviewCount: 0,
      isBestSeller: source.isBestSeller,
      isNew: source.isNew,
      status: "draft",
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      ogImage: source.ogImage,
      sortOrder: source.sortOrder,
      categoryId: source.categoryId,
    },
  });

  await logActivity("create", "product", copy.id, copy.name);
  revalidatePath("/admin/produk");
}

export async function createBlogCategory(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!title || !slug) {
    return { success: false, error: "Title dan slug wajib diisi." };
  }

  const bc = await prisma.blogCategory.create({
    data: { title, slug, sortOrder },
  });

  await logActivity("create", "blog_category", bc.id, title);
  revalidatePath("/admin/kategori-artikel");
  return { success: true, redirect: "/admin/kategori-artikel" };
}

export async function updateBlogCategory(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!title || !slug) {
    return { success: false, error: "Title dan slug wajib diisi." };
  }

  await prisma.blogCategory.update({
    where: { id },
    data: { title, slug, sortOrder },
  });

  await logActivity("update", "blog_category", id, title);
  revalidatePath("/admin/kategori-artikel");
  return { success: true, redirect: "/admin/kategori-artikel" };
}

export async function deleteBlogCategory(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const bc = await prisma.blogCategory.findUnique({ where: { id } });
  await prisma.blogCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity("delete", "blog_category", id, bc?.title);
  revalidatePath("/admin/kategori-artikel");
}

export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || "";
  const author = (formData.get("author") as string)?.trim() || "";
  const content = (formData.get("content") as string)?.trim() || "";
  const excerpt = (formData.get("excerpt") as string)?.trim() || "";
  const tags = (formData.get("tags") as string)?.trim().split(",").filter(Boolean).map(s => s.trim().toLowerCase());
  const categoryId = parseInt(formData.get("categoryId") as string);
  const status = (formData.get("status") as string)?.trim() || "draft";
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || "";
  const metaDescription = (formData.get("metaDescription") as string)?.trim() || "";
  const ogImage = (formData.get("ogImage") as string)?.trim() || "";

  if (!title || !slug || !categoryId) {
    return { success: false, error: "Title, slug, dan kategori wajib diisi." };
  }

  const post = await prisma.blogPost.create({
    data: { title, slug, image, author, content, excerpt, tags, categoryId, status, metaTitle, metaDescription, ogImage },
  });

  await logActivity("create", "article", post.id, title);
  revalidatePath("/admin/artikel");
  return { success: true, redirect: "/admin/artikel" };
}

export async function updateBlogPost(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || "";
  const author = (formData.get("author") as string)?.trim() || "";
  const content = (formData.get("content") as string)?.trim() || "";
  const excerpt = (formData.get("excerpt") as string)?.trim() || "";
  const tags = (formData.get("tags") as string)?.trim().split(",").filter(Boolean).map(s => s.trim().toLowerCase());
  const categoryId = parseInt(formData.get("categoryId") as string);
  const status = (formData.get("status") as string)?.trim() || "draft";
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || "";
  const metaDescription = (formData.get("metaDescription") as string)?.trim() || "";
  const ogImage = (formData.get("ogImage") as string)?.trim() || "";

  if (!title || !slug || !categoryId) {
    return { success: false, error: "Title, slug, dan kategori wajib diisi." };
  }

  await prisma.blogPost.update({
    where: { id },
    data: { title, slug, image, author, content, excerpt, tags, categoryId, status, metaTitle, metaDescription, ogImage },
  });

  await logActivity("update", "article", id, title);
  revalidatePath("/admin/artikel");
  return { success: true, redirect: "/admin/artikel" };
}

export async function deleteBlogPost(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const post = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity("delete", "article", id, post?.title);
  revalidatePath("/admin/artikel");
}

export async function duplicateBlogPost(id: number): Promise<void> {
  await requireAuth();
  const source = await prisma.blogPost.findUnique({ where: { id } });
  if (!source) return;

  // Generate unique slug
  let baseSlug = `${source.slug}-copy`;
  let candidate = baseSlug;
  let counter = 1;
  while (await prisma.blogPost.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-${counter++}`;
  }

  const copy = await prisma.blogPost.create({
    data: {
      title: `${source.title} (Copy)`,
      slug: candidate,
      image: source.image,
      author: source.author,
      content: source.content,
      excerpt: source.excerpt,
      tags: source.tags,
      categoryId: source.categoryId,
      status: "draft",
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      ogImage: source.ogImage,
    },
  });

  await logActivity("create", "article", copy.id, copy.title);
  revalidatePath("/admin/artikel");
}

export async function deleteContactMessage(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  await prisma.contactMessage.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity("delete", "contact_message", id, msg?.name);
  revalidatePath("/admin/pesan");
}

export async function deleteMediaFile(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const file = await prisma.mediaFile.findUnique({ where: { id } });
  if (file) {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "public", file.url);
      await fs.unlink(filePath);
    } catch {
      // File might not exist, continue anyway
    }
    await prisma.mediaFile.delete({ where: { id } });
    await logActivity("delete", "media", id, file.filename);
  }
  revalidatePath("/admin/media");
}

// ──────────────────────────────────────────
// Bulk Actions (soft delete)
// ──────────────────────────────────────────

export async function bulkDeleteProducts(ids: number[]) {
  await requireAuth();
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
  await logActivity("bulk_delete", "product", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/produk");
}

export async function bulkUpdateProductStatus(ids: number[], status: string) {
  await requireAuth();
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status } });
  await logActivity("bulk_status", "product", undefined, undefined, `${ids.length} items → ${status}`);
  revalidatePath("/admin/produk");
}

export async function bulkDeleteBlogPosts(ids: number[]) {
  await requireAuth();
  await prisma.blogPost.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
  await logActivity("bulk_delete", "article", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/artikel");
}

export async function bulkUpdateBlogPostStatus(ids: number[], status: string) {
  await requireAuth();
  await prisma.blogPost.updateMany({ where: { id: { in: ids } }, data: { status } });
  await logActivity("bulk_status", "article", undefined, undefined, `${ids.length} items → ${status}`);
  revalidatePath("/admin/artikel");
}

export async function bulkDeleteProductCategories(ids: number[]) {
  await requireAuth();
  await prisma.productCategory.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
  await logActivity("bulk_delete", "product_category", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/kategori-produk");
}

export async function bulkDeleteBlogCategories(ids: number[]) {
  await requireAuth();
  await prisma.blogCategory.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
  await logActivity("bulk_delete", "blog_category", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/kategori-artikel");
}

export async function bulkDeleteContactMessages(ids: number[]) {
  await requireAuth();
  await prisma.contactMessage.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
  await logActivity("bulk_delete", "contact_message", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/pesan");
}

// ──────────────────────────────────────────
// Trash Actions (restore & permanent delete)
// ──────────────────────────────────────────

export async function restoreItem(entity: string, id: number) {
  await requireAuth();
  switch (entity) {
    case "product":
      await prisma.product.update({ where: { id }, data: { deletedAt: null } });
      break;
    case "article":
      await prisma.blogPost.update({ where: { id }, data: { deletedAt: null } });
      break;
    case "product_category":
      await prisma.productCategory.update({ where: { id }, data: { deletedAt: null } });
      break;
    case "blog_category":
      await prisma.blogCategory.update({ where: { id }, data: { deletedAt: null } });
      break;
    case "contact_message":
      await prisma.contactMessage.update({ where: { id }, data: { deletedAt: null } });
      break;
  }
  await logActivity("restore", entity, id);
  revalidatePath("/admin/trash");
}

export async function permanentDelete(entity: string, id: number) {
  await requireAuth();
  switch (entity) {
    case "product":
      await prisma.product.delete({ where: { id } });
      break;
    case "article":
      await prisma.blogPost.delete({ where: { id } });
      break;
    case "product_category":
      await prisma.productCategory.delete({ where: { id } });
      break;
    case "blog_category":
      await prisma.blogCategory.delete({ where: { id } });
      break;
    case "contact_message":
      await prisma.contactMessage.delete({ where: { id } });
      break;
  }
  revalidatePath("/admin/trash");
}

export async function emptyTrash() {
  await requireAuth();
  await Promise.all([
    prisma.product.deleteMany({ where: { deletedAt: { not: null } } }),
    prisma.blogPost.deleteMany({ where: { deletedAt: { not: null } } }),
    prisma.productCategory.deleteMany({ where: { deletedAt: { not: null } } }),
    prisma.blogCategory.deleteMany({ where: { deletedAt: { not: null } } }),
    prisma.contactMessage.deleteMany({ where: { deletedAt: { not: null } } }),
  ]);
  await logActivity("empty_trash", "all");
  revalidatePath("/admin/trash");
}

// ──────────────────────────────────────────
// Settings Actions
// ──────────────────────────────────────────

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const keys = [
    "site_name", "site_tagline", "site_description", "site_copyright",
    "contact_email", "contact_phone", "contact_address", "contact_whatsapp",
    "header_logo", "header_logo_sticky", "header_badges",
    "nav_menu", "footer_nav", "footer_visibility",
    "social_facebook", "social_instagram", "social_twitter", "social_youtube",
    "social_tiktok", "social_linkedin", "social_pinterest",
    "social_shopee", "social_tokopedia", "social_lazada", "social_tiktok_shop",
    "home_feature_cards", "home_about_section", "home_service_list",
    "home_product_section", "home_blog_section",
    "email_smtp_config",
  ];

  for (const key of keys) {
    const value = (formData.get(key) as string)?.trim() || "";
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await logActivity("update", "settings");
  revalidatePath("/admin/settings");
  return { success: true, redirect: "/admin/settings" };
}

// ──────────────────────────────────────────
// Layout Settings Actions
// ──────────────────────────────────────────

export async function updateLayoutSettings(
  keys: string[],
  formData: FormData,
  redirectPath: string
): Promise<ActionResult> {
  await requireAuth();
  for (const key of keys) {
    const value = (formData.get(key) as string)?.trim() || "";
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await logActivity("update", "layout");
  revalidatePath(redirectPath);
  revalidatePath("/");
  return { success: true, redirect: redirectPath };
}

// ──────────────────────────────────────────
// User Management Actions
// ──────────────────────────────────────────

export async function createAdminUser(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string);
  const role = (formData.get("role") as string)?.trim() || "viewer";

  if (!name || !email || !password) {
    return { success: false, error: "Nama, email, dan password wajib diisi." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email sudah terdaftar." };
  }

  const { hashSync } = await import("bcryptjs");
  const hashed = hashSync(password, 10);

  const user = await prisma.adminUser.create({
    data: { name, email, password: hashed, role },
  });

  await logActivity("create", "user", user.id, name);
  revalidatePath("/admin/users");
  return { success: true, redirect: "/admin/users" };
}

export async function updateAdminUser(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string);
  const role = (formData.get("role") as string)?.trim() || "viewer";

  if (!name || !email) {
    return { success: false, error: "Nama dan email wajib diisi." };
  }

  const existing = await prisma.adminUser.findFirst({ where: { email, NOT: { id } } });
  if (existing) {
    return { success: false, error: "Email sudah digunakan user lain." };
  }

  const data: Record<string, string> = { name, email, role };
  if (password) {
    const { hashSync } = await import("bcryptjs");
    data.password = hashSync(password, 10);
  }

  await prisma.adminUser.update({ where: { id }, data });

  await logActivity("update", "user", id, name);
  revalidatePath("/admin/users");
  return { success: true, redirect: "/admin/users" };
}

export async function deleteAdminUser(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const user = await prisma.adminUser.findUnique({ where: { id } });
  await prisma.adminUser.delete({ where: { id } });
  await logActivity("delete", "user", id, user?.name);
  revalidatePath("/admin/users");
}

// ──────────────────────────────────────────
// Hero Slider Config Actions
// ──────────────────────────────────────────

export async function updateHeroSliderConfig(data: {
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  pauseOnHover: boolean;
}): Promise<ActionResult> {
  await requireAuth();
  const config = JSON.stringify({
    autoplay: !!data.autoplay,
    autoplayDelay: Math.max(1000, Math.min(30000, data.autoplayDelay || 5000)),
    loop: !!data.loop,
    pauseOnHover: !!data.pauseOnHover,
  });

  await prisma.siteSetting.upsert({
    where: { key: "hero_slider_config" },
    update: { value: config },
    create: { key: "hero_slider_config", value: config },
  });

  await logActivity("update", "settings", undefined, "Hero Slider Config");
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { success: true, redirect: "/admin/hero-slides" };
}

// ──────────────────────────────────────────
// Hero Slide Group Actions
// ──────────────────────────────────────────

export async function createHeroSlideGroup(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const active = formData.get("active") === "on";

  if (!name) {
    return { success: false, error: "Nama grup wajib diisi." };
  }

  // If activating this group, deactivate all others
  if (active) {
    await prisma.heroSlideGroup.updateMany({ data: { active: false } });
  }

  const group = await prisma.heroSlideGroup.create({
    data: { name, description, active },
  });

  await logActivity("create", "hero_slide_group", group.id, name);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { success: true, redirect: "/admin/hero-slides" };
}

export async function updateHeroSlideGroup(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const active = formData.get("active") === "on";

  if (!name) {
    return { success: false, error: "Nama grup wajib diisi." };
  }

  // If activating this group, deactivate all others
  if (active) {
    await prisma.heroSlideGroup.updateMany({
      where: { id: { not: id } },
      data: { active: false },
    });
  }

  await prisma.heroSlideGroup.update({
    where: { id },
    data: { name, description, active },
  });

  await logActivity("update", "hero_slide_group", id, name);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { success: true, redirect: "/admin/hero-slides" };
}

export async function deleteHeroSlideGroup(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const group = await prisma.heroSlideGroup.findUnique({ where: { id } });

  // Unlink slides from this group before deleting
  await prisma.heroSlide.updateMany({
    where: { groupId: id },
    data: { groupId: null },
  });

  await prisma.heroSlideGroup.delete({ where: { id } });
  await logActivity("delete", "hero_slide_group", id, group?.name);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

export async function activateHeroSlideGroup(id: number) {
  await requireAuth();
  // Deactivate all groups, then activate this one
  await prisma.heroSlideGroup.updateMany({ data: { active: false } });
  const group = await prisma.heroSlideGroup.update({
    where: { id },
    data: { active: true },
  });
  await logActivity("update", "hero_slide_group", id, group.name, "activated");
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

// ──────────────────────────────────────────
// Hero Slide Actions
// ──────────────────────────────────────────

export async function createHeroSlide(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const subtitle = (formData.get("subtitle") as string)?.trim() || "";
  const title = (formData.get("title") as string)?.trim();
  const bgImage = (formData.get("bgImage") as string)?.trim() || "";
  const ctaText = (formData.get("ctaText") as string)?.trim() || "";
  const ctaLink = (formData.get("ctaLink") as string)?.trim() || "";
  const ctaText2 = (formData.get("ctaText2") as string)?.trim() || "";
  const ctaLink2 = (formData.get("ctaLink2") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";
  const groupIdRaw = formData.get("groupId") as string;
  const groupId = groupIdRaw && groupIdRaw !== "" ? parseInt(groupIdRaw) : null;

  if (!title) {
    return { success: false, error: "Title wajib diisi." };
  }

  const slide = await prisma.heroSlide.create({
    data: { subtitle, title, bgImage, ctaText, ctaLink, ctaText2, ctaLink2, sortOrder, active, groupId },
  });

  await logActivity("create", "hero_slide", slide.id, title);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { success: true, redirect: "/admin/hero-slides" };
}

export async function updateHeroSlide(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const subtitle = (formData.get("subtitle") as string)?.trim() || "";
  const title = (formData.get("title") as string)?.trim();
  const bgImage = (formData.get("bgImage") as string)?.trim() || "";
  const ctaText = (formData.get("ctaText") as string)?.trim() || "";
  const ctaLink = (formData.get("ctaLink") as string)?.trim() || "";
  const ctaText2 = (formData.get("ctaText2") as string)?.trim() || "";
  const ctaLink2 = (formData.get("ctaLink2") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";
  const groupIdRaw = formData.get("groupId") as string;
  const groupId = groupIdRaw && groupIdRaw !== "" ? parseInt(groupIdRaw) : null;

  if (!title) {
    return { success: false, error: "Title wajib diisi." };
  }

  await prisma.heroSlide.update({
    where: { id },
    data: { subtitle, title, bgImage, ctaText, ctaLink, ctaText2, ctaLink2, sortOrder, active, groupId },
  });

  await logActivity("update", "hero_slide", id, title);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { success: true, redirect: "/admin/hero-slides" };
}

export async function deleteHeroSlide(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  await prisma.heroSlide.delete({ where: { id } });
  await logActivity("delete", "hero_slide", id, slide?.title);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

export async function bulkDeleteHeroSlides(ids: number[]) {
  await requireAuth();
  await prisma.heroSlide.deleteMany({ where: { id: { in: ids } } });
  await logActivity("bulk_delete", "hero_slide", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

export async function toggleHeroSlideActive(id: number) {
  await requireAuth();
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) return;
  const newActive = !slide.active;
  await prisma.heroSlide.update({
    where: { id },
    data: { active: newActive },
  });
  await logActivity("update", "hero_slide", id, slide.title, newActive ? "activated" : "deactivated");
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

// ──────────────────────────────────────────
// Brand Partner Actions
// ──────────────────────────────────────────

export async function createBrandPartner(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const name = (formData.get("name") as string)?.trim();
  const logoImage = (formData.get("logoImage") as string)?.trim() || "";
  const url = (formData.get("url") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!name) {
    return { success: false, error: "Nama wajib diisi." };
  }

  const brand = await prisma.brandPartner.create({
    data: { name, logoImage, url, sortOrder, active },
  });

  await logActivity("create", "brand_partner", brand.id, name);
  revalidatePath("/admin/brand-partners");
  revalidatePath("/");
  return { success: true, redirect: "/admin/brand-partners" };
}

export async function updateBrandPartner(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const logoImage = (formData.get("logoImage") as string)?.trim() || "";
  const url = (formData.get("url") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!name) {
    return { success: false, error: "Nama wajib diisi." };
  }

  await prisma.brandPartner.update({
    where: { id },
    data: { name, logoImage, url, sortOrder, active },
  });

  await logActivity("update", "brand_partner", id, name);
  revalidatePath("/admin/brand-partners");
  revalidatePath("/");
  return { success: true, redirect: "/admin/brand-partners" };
}

export async function deleteBrandPartner(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const brand = await prisma.brandPartner.findUnique({ where: { id } });
  await prisma.brandPartner.delete({ where: { id } });
  await logActivity("delete", "brand_partner", id, brand?.name);
  revalidatePath("/admin/brand-partners");
  revalidatePath("/");
}

export async function bulkDeleteBrandPartners(ids: number[]) {
  await requireAuth();
  await prisma.brandPartner.deleteMany({ where: { id: { in: ids } } });
  await logActivity("bulk_delete", "brand_partner", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/brand-partners");
  revalidatePath("/");
}

// ──────────────────────────────────────────
// Gallery Item Actions
// ──────────────────────────────────────────

export async function createGalleryItem(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const image = (formData.get("image") as string)?.trim() || "";
  const caption = (formData.get("caption") as string)?.trim() || "";
  const platform = (formData.get("platform") as string)?.trim() || "instagram";
  const url = (formData.get("url") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!image) {
    return { success: false, error: "Image wajib diisi." };
  }

  const item = await prisma.galleryItem.create({
    data: { image, caption, platform, url, sortOrder, active },
  });

  await logActivity("create", "gallery_item", item.id, caption || "Gallery Item");
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  return { success: true, redirect: "/admin/gallery" };
}

export async function updateGalleryItem(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const image = (formData.get("image") as string)?.trim() || "";
  const caption = (formData.get("caption") as string)?.trim() || "";
  const platform = (formData.get("platform") as string)?.trim() || "instagram";
  const url = (formData.get("url") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!image) {
    return { success: false, error: "Image wajib diisi." };
  }

  await prisma.galleryItem.update({
    where: { id },
    data: { image, caption, platform, url, sortOrder, active },
  });

  await logActivity("update", "gallery_item", id, caption || "Gallery Item");
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  return { success: true, redirect: "/admin/gallery" };
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  await prisma.galleryItem.delete({ where: { id } });
  await logActivity("delete", "gallery_item", id, item?.caption);
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
}

export async function bulkDeleteGalleryItems(ids: number[]) {
  await requireAuth();
  await prisma.galleryItem.deleteMany({ where: { id: { in: ids } } });
  await logActivity("bulk_delete", "gallery_item", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
}

// ──────────────────────────────────────────
// Promo Item Actions
// ──────────────────────────────────────────

export async function createPromoItem(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const image = (formData.get("image") as string)?.trim() || "";
  const ctaText = (formData.get("ctaText") as string)?.trim() || "";
  const ctaLink = (formData.get("ctaLink") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!title) {
    return { success: false, error: "Title wajib diisi." };
  }

  const item = await prisma.promoItem.create({
    data: { title, description, image, ctaText, ctaLink, sortOrder, active },
  });

  await logActivity("create", "promo_item", item.id, title);
  revalidatePath("/admin/promo");
  revalidatePath("/promo");
  return { success: true, redirect: "/admin/promo" };
}

export async function updatePromoItem(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const image = (formData.get("image") as string)?.trim() || "";
  const ctaText = (formData.get("ctaText") as string)?.trim() || "";
  const ctaLink = (formData.get("ctaLink") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!title) {
    return { success: false, error: "Title wajib diisi." };
  }

  await prisma.promoItem.update({
    where: { id },
    data: { title, description, image, ctaText, ctaLink, sortOrder, active },
  });

  await logActivity("update", "promo_item", id, title);
  revalidatePath("/admin/promo");
  revalidatePath("/promo");
  return { success: true, redirect: "/admin/promo" };
}

export async function deletePromoItem(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const item = await prisma.promoItem.findUnique({ where: { id } });
  await prisma.promoItem.delete({ where: { id } });
  await logActivity("delete", "promo_item", id, item?.title);
  revalidatePath("/admin/promo");
  revalidatePath("/promo");
}

export async function bulkDeletePromoItems(ids: number[]) {
  await requireAuth();
  await prisma.promoItem.deleteMany({ where: { id: { in: ids } } });
  await logActivity("bulk_delete", "promo_item", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/promo");
  revalidatePath("/promo");
}

// ──────────────────────────────────────────
// Event Item Actions
// ──────────────────────────────────────────

export async function createEventItem(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const image = (formData.get("image") as string)?.trim() || "";
  const date = (formData.get("date") as string)?.trim() || "";
  const location = (formData.get("location") as string)?.trim() || "";
  const ctaText = (formData.get("ctaText") as string)?.trim() || "";
  const ctaLink = (formData.get("ctaLink") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!title) {
    return { success: false, error: "Title wajib diisi." };
  }

  const item = await prisma.eventItem.create({
    data: { title, description, image, date, location, ctaText, ctaLink, sortOrder, active },
  });

  await logActivity("create", "event_item", item.id, title);
  revalidatePath("/admin/events");
  revalidatePath("/promo");
  return { success: true, redirect: "/admin/events" };
}

export async function updateEventItem(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const image = (formData.get("image") as string)?.trim() || "";
  const date = (formData.get("date") as string)?.trim() || "";
  const location = (formData.get("location") as string)?.trim() || "";
  const ctaText = (formData.get("ctaText") as string)?.trim() || "";
  const ctaLink = (formData.get("ctaLink") as string)?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const active = formData.get("active") === "on";

  if (!title) {
    return { success: false, error: "Title wajib diisi." };
  }

  await prisma.eventItem.update({
    where: { id },
    data: { title, description, image, date, location, ctaText, ctaLink, sortOrder, active },
  });

  await logActivity("update", "event_item", id, title);
  revalidatePath("/admin/events");
  revalidatePath("/promo");
  return { success: true, redirect: "/admin/events" };
}

export async function deleteEventItem(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const item = await prisma.eventItem.findUnique({ where: { id } });
  await prisma.eventItem.delete({ where: { id } });
  await logActivity("delete", "event_item", id, item?.title);
  revalidatePath("/admin/events");
  revalidatePath("/promo");
}

export async function bulkDeleteEventItems(ids: number[]) {
  await requireAuth();
  await prisma.eventItem.deleteMany({ where: { id: { in: ids } } });
  await logActivity("bulk_delete", "event_item", undefined, undefined, `${ids.length} items`);
  revalidatePath("/admin/events");
  revalidatePath("/promo");
}
