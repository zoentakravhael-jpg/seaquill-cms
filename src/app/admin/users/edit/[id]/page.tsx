import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateAdminUser } from "../../../actions";
import UserForm from "@/components/admin/UserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin");

  const { id } = await params;
  const user = await prisma.adminUser.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/users" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit User</h1>
            <p className="admin-page-subtitle">{user.name}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <UserForm initialData={user} action={updateAdminUser} backHref="/admin/users" />
        </div>
      </div>
    </>
  );
}
