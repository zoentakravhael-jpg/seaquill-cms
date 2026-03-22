import { prisma } from "@/lib/prisma";
import TrashClient from "./TrashClient";

export default async function TrashPage() {
  const [products, articles, productCategories, blogCategories, messages] = await Promise.all([
    prisma.product.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" }, select: { id: true, name: true, deletedAt: true } }),
    prisma.blogPost.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" }, select: { id: true, title: true, deletedAt: true } }),
    prisma.productCategory.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" }, select: { id: true, title: true, deletedAt: true } }),
    prisma.blogCategory.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" }, select: { id: true, title: true, deletedAt: true } }),
    prisma.contactMessage.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" }, select: { id: true, name: true, subject: true, deletedAt: true } }),
  ]);

  const items = [
    ...products.map(p => ({ id: p.id, entity: "product" as const, name: p.name, deletedAt: p.deletedAt! })),
    ...articles.map(a => ({ id: a.id, entity: "article" as const, name: a.title, deletedAt: a.deletedAt! })),
    ...productCategories.map(c => ({ id: c.id, entity: "product_category" as const, name: c.title, deletedAt: c.deletedAt! })),
    ...blogCategories.map(c => ({ id: c.id, entity: "blog_category" as const, name: c.title, deletedAt: c.deletedAt! })),
    ...messages.map(m => ({ id: m.id, entity: "contact_message" as const, name: `${m.name} — ${m.subject || "Tanpa subjek"}`, deletedAt: m.deletedAt! })),
  ].sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tempat Sampah</h1>
          <p className="admin-page-subtitle">{items.length} item di tempat sampah</p>
        </div>
      </div>
      <TrashClient items={items.map(i => ({ ...i, deletedAt: i.deletedAt.toISOString() }))} />
    </>
  );
}
