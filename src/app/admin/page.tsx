import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BarChart, LineChart, DonutChart } from "@/components/admin/DashboardCharts";

export default async function AdminDashboardPage() {
  const [productCount, articleCount, categoryCount, blogCategoryCount, messageCount] =
    await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.blogPost.count({ where: { deletedAt: null } }),
      prisma.productCategory.count({ where: { deletedAt: null } }),
      prisma.blogCategory.count({ where: { deletedAt: null } }),
      prisma.contactMessage.count({ where: { deletedAt: null } }),
    ]);

  const recentMessages = await prisma.contactMessage.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentProducts = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: true },
  });

  // Chart data: products per category
  const productsPerCategory = await prisma.productCategory.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: { where: { deletedAt: null } } } } },
    orderBy: { sortOrder: "asc" },
  });

  // Chart data: articles per month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const recentArticles = await prisma.blogPost.findMany({
    where: { deletedAt: null, createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const articlesByMonth: { label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.getMonth();
    const year = d.getFullYear();
    const count = recentArticles.filter(a => a.createdAt.getMonth() === month && a.createdAt.getFullYear() === year).length;
    articlesByMonth.push({ label: monthLabels[month], value: count });
  }

  // Chart data: messages per month (last 6 months)
  const recentMsgs = await prisma.contactMessage.findMany({
    where: { deletedAt: null, createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });

  const messagesByMonth: { label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.getMonth();
    const year = d.getFullYear();
    const count = recentMsgs.filter(m => m.createdAt.getMonth() === month && m.createdAt.getFullYear() === year).length;
    messagesByMonth.push({ label: monthLabels[month], value: count });
  }

  const stats = [
    { label: "Total Produk", value: productCount, icon: "fas fa-box-open", color: "blue", href: "/admin/produk" },
    { label: "Total Artikel", value: articleCount, icon: "fas fa-file-alt", color: "green", href: "/admin/artikel" },
    { label: "Kategori Produk", value: categoryCount, icon: "fas fa-tags", color: "purple", href: "/admin/kategori-produk" },
    { label: "Kategori Artikel", value: blogCategoryCount, icon: "fas fa-folder-open", color: "orange", href: "/admin/kategori-artikel" },
    { label: "Pesan Masuk", value: messageCount, icon: "fas fa-envelope", color: "red", href: "/admin/pesan" },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Selamat datang di Sea-Quill CMS</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="admin-stat-card">
              <div className={`admin-stat-icon ${stat.color}`}>
                <i className={stat.icon}></i>
              </div>
              <div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-label">{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 24 }}>
        <DonutChart
          title="Produk per Kategori"
          data={productsPerCategory.map(c => ({ label: c.title, value: c._count.products }))}
        />
        <LineChart
          title="Artikel per Bulan"
          data={articlesByMonth}
          color="#10B981"
        />
        <LineChart
          title="Pesan per Bulan"
          data={messagesByMonth}
          color="#EF4444"
        />
      </div>

      {/* Two Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent Messages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Pesan Terbaru</span>
            <Link href="/admin/pesan" className="admin-btn admin-btn-secondary admin-btn-sm">
              Lihat Semua
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon"><i className="fas fa-envelope-open"></i></div>
              <p className="admin-empty-text">Belum ada pesan masuk.</p>
            </div>
          ) : (
            <div>
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--admin-border)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--admin-text-primary)" }}>
                        {msg.name}
                      </span>
                      <span
                        className={`admin-badge ${msg.source === "consultation" ? "admin-badge-purple" : "admin-badge-blue"}`}
                      >
                        {msg.source === "consultation" ? "Konsultasi" : "Kontak"}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--admin-text-secondary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--admin-text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {msg.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Produk Terbaru</span>
            <Link href="/admin/produk" className="admin-btn admin-btn-secondary admin-btn-sm">
              Lihat Semua
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon"><i className="fas fa-box"></i></div>
              <p className="admin-empty-text">Belum ada produk.</p>
            </div>
          ) : (
            <div>
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid var(--admin-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        objectFit: "contain",
                        background: "#F8FAFC",
                        border: "1px solid var(--admin-border)",
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--admin-text-primary)" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
                      {product.category.title}
                    </div>
                  </div>
                  <Link href={`/admin/produk/edit/${product.id}`} className="admin-btn-icon edit" title="Edit">
                    <i className="fas fa-pen"></i>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
