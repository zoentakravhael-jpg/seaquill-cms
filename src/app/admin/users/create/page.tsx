import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createAdminUser } from "../../actions";
import UserForm from "@/components/admin/UserForm";

export default async function CreateUserPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin");

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/users" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah User</h1>
            <p className="admin-page-subtitle">Buat akun admin baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <UserForm action={createAdminUser} backHref="/admin/users" />
        </div>
      </div>
    </>
  );
}
