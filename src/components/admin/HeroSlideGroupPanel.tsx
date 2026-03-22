"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createHeroSlideGroup,
  updateHeroSlideGroup,
  deleteHeroSlideGroup,
  activateHeroSlideGroup,
} from "@/app/admin/actions";

interface Group {
  id: number;
  name: string;
  description: string;
  active: boolean;
  _count: { slides: number };
}

interface HeroSlideGroupPanelProps {
  groups: Group[];
}

export default function HeroSlideGroupPanel({ groups }: HeroSlideGroupPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeFlag, setActiveFlag] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeGroup = groups.find((g) => g.active);

  function startEdit(group: Group) {
    setEditingId(group.id);
    setName(group.name);
    setDescription(group.description);
    setActiveFlag(group.active);
    setShowCreate(false);
  }

  function startCreate() {
    setShowCreate(true);
    setEditingId(null);
    setName("");
    setDescription("");
    setActiveFlag(false);
  }

  function cancelForm() {
    setShowCreate(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setActiveFlag(false);
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Nama grup wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("description", description.trim());
      if (activeFlag) formData.set("active", "on");

      if (editingId) {
        formData.set("id", String(editingId));
        const result = await updateHeroSlideGroup(formData);
        if (result.success) {
          toast.success("Grup berhasil diupdate!");
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createHeroSlideGroup(formData);
        if (result.success) {
          toast.success("Grup berhasil dibuat!");
        } else {
          toast.error(result.error);
        }
      }
      cancelForm();
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, groupName: string) {
    if (!confirm(`Hapus grup "${groupName}"? Slide di dalam grup ini tidak akan dihapus.`)) return;
    try {
      const formData = new FormData();
      formData.set("id", String(id));
      await deleteHeroSlideGroup(formData);
      toast.success("Grup berhasil dihapus");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus grup");
    }
  }

  async function handleActivate(id: number) {
    try {
      await activateHeroSlideGroup(id);
      toast.success("Grup berhasil diaktifkan!");
      router.refresh();
    } catch {
      toast.error("Gagal mengaktifkan grup");
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: 24 }}>
      <div
        className="admin-card-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fas fa-layer-group" style={{ color: "var(--admin-primary)" }}></i>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
            Grup Slide
          </h3>
          {activeGroup && (
            <span
              className="admin-badge admin-badge-green"
              style={{ marginLeft: 8, fontSize: 12 }}
            >
              <i className="fas fa-play" style={{ fontSize: 9, marginRight: 4 }}></i>
              {activeGroup.name}
            </span>
          )}
        </div>
        <i
          className={`fas fa-chevron-${open ? "up" : "down"}`}
          style={{ fontSize: 12, color: "var(--admin-text-muted)" }}
        ></i>
      </div>

      {open && (
        <div className="admin-card-body" style={{ padding: 0 }}>
          {/* Active group banner */}
          {activeGroup ? (
            <div
              style={{
                padding: "12px 20px",
                background: "var(--admin-success-bg, #f0fdf4)",
                borderBottom: "1px solid var(--admin-border)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
              }}
            >
              <i className="fas fa-check-circle" style={{ color: "var(--admin-primary, #16a34a)" }}></i>
              <span>
                Grup aktif: <strong>{activeGroup.name}</strong> ({activeGroup._count.slides} slide)
              </span>
            </div>
          ) : (
            <div
              style={{
                padding: "12px 20px",
                background: "var(--admin-warning-bg, #fffbeb)",
                borderBottom: "1px solid var(--admin-border)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
              }}
            >
              <i className="fas fa-info-circle" style={{ color: "#d97706" }}></i>
              <span>Belum ada grup aktif. Semua slide aktif akan ditampilkan.</span>
            </div>
          )}

          {/* Groups table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--admin-text-secondary)" }}>Nama Grup</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--admin-text-secondary)" }}>Deskripsi</th>
                  <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "var(--admin-text-secondary)" }}>Slide</th>
                  <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "var(--admin-text-secondary)" }}>Status</th>
                  <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "var(--admin-text-secondary)" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", color: "var(--admin-text-muted)" }}>
                      Belum ada grup. Buat grup untuk mengelompokkan slide.
                    </td>
                  </tr>
                )}
                {groups.map((group) => (
                  <tr key={group.id} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 500 }}>{group.name}</td>
                    <td style={{ padding: "10px 16px", color: "var(--admin-text-secondary)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {group.description || "—"}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                      <span className="admin-badge admin-badge-blue">{group._count.slides}</span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                      {group.active ? (
                        <span className="admin-badge admin-badge-green">
                          <i className="fas fa-play" style={{ fontSize: 9, marginRight: 4 }}></i>
                          Aktif
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-red" style={{ cursor: "pointer" }} onClick={() => handleActivate(group.id)}>
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        {!group.active && (
                          <button
                            type="button"
                            className="admin-btn-icon"
                            title="Aktifkan grup ini"
                            onClick={() => handleActivate(group.id)}
                            style={{ color: "var(--admin-primary, #16a34a)" }}
                          >
                            <i className="fas fa-play"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          className="admin-btn-icon edit"
                          title="Edit"
                          onClick={() => startEdit(group)}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          type="button"
                          className="admin-btn-icon delete"
                          title="Hapus"
                          onClick={() => handleDelete(group.id, group.name)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create/Edit form */}
          {(showCreate || editingId) && (
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--admin-border)",
                background: "var(--admin-bg-secondary, #f9fafb)",
              }}
            >
              <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>
                {editingId ? "Edit Grup" : "Buat Grup Baru"}
              </h4>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div className="admin-form-group" style={{ flex: "1 1 200px", marginBottom: 0 }}>
                  <label className="admin-form-label">Nama Grup <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Promo Lebaran"
                  />
                </div>
                <div className="admin-form-group" style={{ flex: "2 1 300px", marginBottom: 0 }}>
                  <label className="admin-form-label">Deskripsi <span className="admin-form-optional">(optional)</span></label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi singkat grup slide"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 2 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={activeFlag}
                      onChange={(e) => setActiveFlag(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "var(--admin-primary)" }}
                    />
                    Langsung aktifkan
                  </label>
                </div>
                <div style={{ display: "flex", gap: 8, paddingBottom: 2 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={cancelForm}
                    style={{ padding: "8px 16px", fontSize: 13 }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: "8px 16px", fontSize: 13 }}
                  >
                    {saving ? "Menyimpan..." : editingId ? "Update" : "Buat Grup"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom actions */}
          {!showCreate && !editingId && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--admin-border)" }}>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={startCreate}
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }}></i>
                Tambah Grup
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
