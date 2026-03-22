import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { deleteAdminUser } from "../actions";
import UserListClient from "./UserListClient";

export default async function UsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin");
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen User</h1>
          <p className="admin-page-subtitle">{users.length} user terdaftar</p>
        </div>
        <Link href="/admin/users/create" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Tambah User
        </Link>
      </div>
      <UserListClient
        users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        currentUserId={session.userId}
        deleteAction={deleteAdminUser}
      />
    </>
  );
}
