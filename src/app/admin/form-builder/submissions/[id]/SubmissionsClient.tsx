"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  form: { id: number; name: string; slug: string };
  fields: Array<{ name: string; label: string }>;
  submissions: Array<{
    id: number;
    data: string;
    ip: string;
    read: boolean;
    createdAt: string;
  }>;
}

export default function SubmissionsClient({ form, fields, submissions }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detailId, setDetailId] = useState<number | null>(null);

  const parsedSubmissions = submissions.map((s) => {
    let data: Record<string, string> = {};
    try { data = JSON.parse(s.data); } catch { /* empty */ }
    return { ...s, parsed: data };
  });

  // Display columns: first 3 fields + date
  const displayFields = fields.slice(0, 3);

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === submissions.length) setSelected(new Set());
    else setSelected(new Set(submissions.map((s) => s.id)));
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Hapus ${selected.size} submission?`)) return;

    try {
      const res = await fetch(`/api/admin/forms/${form.id}/submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success(`${selected.size} submission dihapus`);
      setSelected(new Set());
      router.refresh();
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  const detailSubmission = detailId ? parsedSubmissions.find((s) => s.id === detailId) : null;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <i className="fas fa-inbox" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
            Submissions: {form.name}
          </h1>
          <p className="admin-page-subtitle">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => router.push("/admin/form-builder")} className="admin-btn admin-btn-secondary">
            <i className="fas fa-arrow-left"></i> Kembali
          </button>
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger">
              <i className="fas fa-trash"></i> Hapus ({selected.size})
            </button>
          )}
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <i className="fas fa-inbox" style={{ fontSize: 48, color: "#CBD5E1", marginBottom: 16, display: "block" }}></i>
          <h3 style={{ margin: "0 0 8px", color: "#475569" }}>Belum ada submission</h3>
          <p style={{ color: "#94A3B8" }}>Form ini belum pernah disubmit.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="admin-form-checkbox"
                      checked={selected.size === submissions.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th style={{ width: 60 }}>#</th>
                  {displayFields.map((f) => (
                    <th key={f.name}>{f.label}</th>
                  ))}
                  <th>Tanggal</th>
                  <th style={{ width: 80 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {parsedSubmissions.map((sub, idx) => (
                  <tr key={sub.id} style={{ background: !sub.read ? "#FEFCE8" : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        className="admin-form-checkbox"
                        checked={selected.has(sub.id)}
                        onChange={() => toggleSelect(sub.id)}
                      />
                    </td>
                    <td style={{ color: "#94A3B8" }}>{idx + 1}</td>
                    {displayFields.map((f) => (
                      <td key={f.name} style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sub.parsed[f.name] || "-"}
                      </td>
                    ))}
                    <td style={{ color: "#64748B", fontSize: 13 }}>
                      {new Date(sub.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <button onClick={() => setDetailId(sub.id)} className="admin-btn admin-btn-ghost admin-btn-sm">
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailSubmission && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setDetailId(null)}
        >
          <div
            className="admin-card"
            style={{ maxWidth: 600, width: "100%", maxHeight: "80vh", overflow: "auto", marginBottom: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="admin-card-title">Submission #{detailSubmission.id}</span>
              <button onClick={() => setDetailId(null)} className="admin-btn admin-btn-ghost admin-btn-sm">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-card-body" style={{ padding: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {fields.map((f) => (
                  <div key={f.name}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 2 }}>{f.label}</label>
                    <div style={{ fontSize: 14, color: "#1E293B", whiteSpace: "pre-wrap" }}>
                      {detailSubmission.parsed[f.name] || "-"}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #E2E8F0", display: "flex", gap: 16, fontSize: 12, color: "#94A3B8" }}>
                <span><i className="fas fa-clock"></i> {new Date(detailSubmission.createdAt).toLocaleString("id-ID")}</span>
                {detailSubmission.ip && <span><i className="fas fa-globe"></i> {detailSubmission.ip}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
