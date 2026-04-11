export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FormBuilderPage() {
  const forms = await prisma.form.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: { where: { deletedAt: null } } } } },
  });

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <i className="fas fa-wpforms" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
            Form Builder
          </h1>
          <p className="admin-page-subtitle">Buat dan kelola form kontak kustom</p>
        </div>
        <Link href="/admin/form-builder/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Buat Form Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            <i className="fas fa-wpforms"></i>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{forms.length}</div>
            <div className="admin-stat-label">Total Form</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{forms.filter((f) => f.status === "published").length}</div>
            <div className="admin-stat-label">Published</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
            <i className="fas fa-inbox"></i>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{forms.reduce((sum, f) => sum + f.submitCount, 0)}</div>
            <div className="admin-stat-label">Total Submissions</div>
          </div>
        </div>
      </div>

      {/* Form Cards */}
      {forms.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <i className="fas fa-wpforms" style={{ fontSize: 48, color: "#CBD5E1", marginBottom: 16, display: "block" }}></i>
          <h3 style={{ margin: "0 0 8px", color: "#475569" }}>Belum ada form</h3>
          <p style={{ color: "#94A3B8", margin: "0 0 20px" }}>Buat form pertama Anda untuk mulai menerima pesan.</p>
          <Link href="/admin/form-builder/create" className="admin-btn admin-btn-primary">
            <i className="fas fa-plus"></i> Buat Form Baru
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
          {forms.map((form) => (
            <div key={form.id} className="admin-card" style={{ marginBottom: 0 }}>
              <div className="admin-card-body" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>{form.name}</h3>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>/{form.slug}</span>
                  </div>
                  <span
                    className="admin-badge"
                    style={{
                      background: form.status === "published" ? "#DCFCE7" : form.status === "draft" ? "#FEF3C7" : "#F1F5F9",
                      color: form.status === "published" ? "#16A34A" : form.status === "draft" ? "#D97706" : "#64748B",
                    }}
                  >
                    {form.status}
                  </span>
                </div>

                {form.description && (
                  <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.5 }}>{form.description}</p>
                )}

                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>
                  <span><i className="fas fa-inbox"></i> {form._count.submissions} submission{form._count.submissions !== 1 ? "s" : ""}</span>
                  <span><i className="fas fa-calendar"></i> {new Date(form.createdAt).toLocaleDateString("id-ID")}</span>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link href={`/admin/form-builder/edit/${form.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                  <Link href={`/admin/form-builder/submissions/${form.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                    <i className="fas fa-inbox"></i> Submissions
                  </Link>
                  <Link href={`/admin/form-builder/preview/${form.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                    <i className="fas fa-eye"></i> Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
