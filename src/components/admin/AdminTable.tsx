"use client";

import Link from "next/link";
import toast from "react-hot-toast";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  editHref?: (item: T) => string;
  deleteAction?: (formData: FormData) => Promise<void>;
  getId: (item: T) => number;
  entityName?: string;
}

export default function AdminTable<T>({
  columns,
  data,
  editHref,
  deleteAction,
  getId,
  entityName = "Data",
}: AdminTableProps<T>) {
  async function handleDelete(formData: FormData) {
    if (!deleteAction) return;
    if (!confirm(`Yakin ingin menghapus ${entityName.toLowerCase()} ini?`)) return;
    try {
      await deleteAction(formData);
      toast.success(`${entityName} berhasil dihapus`);
    } catch {
      toast.error(`Gagal menghapus ${entityName.toLowerCase()}`);
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {(editHref || deleteAction) && (
                <th style={{ textAlign: "right", width: 100 }}>Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (editHref || deleteAction ? 1 : 0)}>
                  <div className="admin-empty">
                    <div className="admin-empty-icon">
                      <i className="fas fa-inbox"></i>
                    </div>
                    <p className="admin-empty-text">Belum ada data.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={getId(item)}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                  {(editHref || deleteAction) && (
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        {editHref && (
                          <Link href={editHref(item)} className="admin-btn-icon edit" title="Edit">
                            <i className="fas fa-pen"></i>
                          </Link>
                        )}
                        {deleteAction && (
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={getId(item)} />
                            <button type="submit" className="admin-btn-icon delete" title="Hapus">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
