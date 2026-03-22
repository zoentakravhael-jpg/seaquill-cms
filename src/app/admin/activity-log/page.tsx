import { prisma } from "@/lib/prisma";

const entityLabels: Record<string, string> = {
  product: "Produk",
  article: "Artikel",
  product_category: "Kategori Produk",
  blog_category: "Kategori Artikel",
  contact_message: "Pesan",
  media: "Media",
  settings: "Pengaturan",
  user: "User",
  all: "Semua",
};

const actionLabels: Record<string, { label: string; icon: string; color: string }> = {
  create: { label: "Dibuat", icon: "fas fa-plus-circle", color: "var(--admin-success)" },
  update: { label: "Diubah", icon: "fas fa-edit", color: "var(--admin-primary)" },
  delete: { label: "Dihapus", icon: "fas fa-trash", color: "var(--admin-danger)" },
  restore: { label: "Dipulihkan", icon: "fas fa-undo", color: "var(--admin-warning)" },
  bulk_delete: { label: "Bulk Hapus", icon: "fas fa-trash", color: "var(--admin-danger)" },
  bulk_status: { label: "Bulk Status", icon: "fas fa-toggle-on", color: "var(--admin-warning)" },
  empty_trash: { label: "Kosongkan Sampah", icon: "fas fa-dumpster", color: "var(--admin-danger)" },
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ActivityLogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = 20;

  const [logs, totalCount] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.activityLog.count(),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity Log</h1>
          <p className="admin-page-subtitle">{totalCount} aktivitas tercatat</p>
        </div>
      </div>

      <div className="admin-card">
        {logs.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon"><i className="fas fa-history"></i></div>
            <p className="admin-empty-text">Belum ada aktivitas tercatat.</p>
          </div>
        ) : (
          <div>
            {logs.map((log) => {
              const actionInfo = actionLabels[log.action] || { label: log.action, icon: "fas fa-circle", color: "#888" };
              return (
                <div
                  key={log.id}
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--admin-border)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `${actionInfo.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <i className={actionInfo.icon} style={{ color: actionInfo.color, fontSize: 14 }}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: "var(--admin-text-primary)" }}>
                      <strong>{log.user.name}</strong>
                      {" "}
                      <span style={{ color: actionInfo.color, fontWeight: 600 }}>{actionInfo.label}</span>
                      {" "}
                      <span style={{ color: "var(--admin-text-secondary)" }}>{entityLabels[log.entity] || log.entity}</span>
                      {log.entityName && (
                        <span style={{ fontWeight: 500 }}>{" — "}{log.entityName}</span>
                      )}
                    </div>
                    {log.details && (
                      <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>{log.details}</div>
                    )}
                    <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 4 }}>
                      {log.createdAt.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "center", gap: 8 }}>
            {page > 1 && (
              <a href={`/admin/activity-log?page=${page - 1}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                <i className="fas fa-chevron-left"></i> Prev
              </a>
            )}
            <span style={{ padding: "6px 12px", fontSize: 13, color: "var(--admin-text-secondary)" }}>
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <a href={`/admin/activity-log?page=${page + 1}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                Next <i className="fas fa-chevron-right"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
