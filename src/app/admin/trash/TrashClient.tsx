"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { restoreItem, permanentDelete, emptyTrash } from "../actions";

const entityLabels: Record<string, { label: string; icon: string; color: string }> = {
  product: { label: "Produk", icon: "fas fa-box-open", color: "var(--admin-primary)" },
  article: { label: "Artikel", icon: "fas fa-file-alt", color: "var(--admin-success)" },
  product_category: { label: "Kategori Produk", icon: "fas fa-tags", color: "#8B5CF6" },
  blog_category: { label: "Kategori Artikel", icon: "fas fa-folder-open", color: "#F59E0B" },
  contact_message: { label: "Pesan", icon: "fas fa-envelope", color: "var(--admin-danger)" },
};

interface TrashItem {
  id: number;
  entity: string;
  name: string;
  deletedAt: string;
}

export default function TrashClient({ items }: { items: TrashItem[] }) {
  const router = useRouter();

  async function handleRestore(entity: string, id: number) {
    await restoreItem(entity, id);
    toast.success("Item berhasil dipulihkan");
    router.refresh();
  }

  async function handlePermanentDelete(entity: string, id: number) {
    if (!confirm("Hapus permanen? Data tidak bisa dikembalikan.")) return;
    await permanentDelete(entity, id);
    toast.success("Item dihapus permanen");
    router.refresh();
  }

  async function handleEmptyTrash() {
    if (!confirm("Kosongkan tempat sampah? Semua data akan dihapus permanen.")) return;
    await emptyTrash();
    toast.success("Tempat sampah dikosongkan");
    router.refresh();
  }

  return (
    <div className="admin-card">
      {items.length > 0 && (
        <div className="admin-card-header">
          <span className="admin-card-title">{items.length} item</span>
          <button onClick={handleEmptyTrash} className="admin-btn admin-btn-danger admin-btn-sm">
            <i className="fas fa-dumpster"></i> Kosongkan Semua
          </button>
        </div>
      )}
      {items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><i className="fas fa-trash"></i></div>
          <p className="admin-empty-text">Tempat sampah kosong.</p>
        </div>
      ) : (
        <div>
          {items.map((item) => {
            const info = entityLabels[item.entity] || { label: item.entity, icon: "fas fa-circle", color: "#888" };
            return (
              <div
                key={`${item.entity}-${item.id}`}
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--admin-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${info.color}15`, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={info.icon} style={{ color: info.color, fontSize: 14 }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--admin-text-primary)" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)", display: "flex", gap: 8 }}>
                    <span className="admin-badge admin-badge-gray">{info.label}</span>
                    <span>Dihapus {new Date(item.deletedAt).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => handleRestore(item.entity, item.id)}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    title="Pulihkan"
                  >
                    <i className="fas fa-undo"></i> Pulihkan
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(item.entity, item.id)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    title="Hapus Permanen"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
