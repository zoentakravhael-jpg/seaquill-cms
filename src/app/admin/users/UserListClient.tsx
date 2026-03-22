"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const roleLabels: Record<string, { label: string; variant: string }> = {
  admin: { label: "Admin", variant: "admin-badge-red" },
  editor: { label: "Editor", variant: "admin-badge-blue" },
  viewer: { label: "Viewer", variant: "admin-badge-gray" },
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Props {
  users: User[];
  currentUserId: number;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function UserListClient({ users, currentUserId, deleteAction }: Props) {
  const router = useRouter();

  async function handleDelete(id: number) {
    if (id === currentUserId) {
      toast.error("Tidak bisa menghapus akun Anda sendiri");
      return;
    }
    if (!confirm("Hapus user ini?")) return;
    const fd = new FormData();
    fd.append("id", String(id));
    await deleteAction(fd);
    toast.success("User berhasil dihapus");
    router.refresh();
  }

  return (
    <div className="admin-card">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat</th>
              <th style={{ width: 100 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleInfo = roleLabels[user.role] || { label: user.role, variant: "admin-badge-gray" };
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                  </td>
                  <td>{user.email}</td>
                  <td><span className={`admin-badge ${roleInfo.variant}`}>{roleInfo.label}</span></td>
                  <td style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>
                    {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <Link href={`/admin/users/edit/${user.id}`} className="admin-btn-icon edit" title="Edit">
                        <i className="fas fa-pen"></i>
                      </Link>
                      {user.id !== currentUserId && (
                        <button onClick={() => handleDelete(user.id)} className="admin-btn-icon delete" title="Hapus">
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
