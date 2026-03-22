export const dynamic = 'force-dynamic';

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata = {
  title: "Admin Panel - Sea-Quill",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Login page doesn't need the admin layout chrome
  if (!session) {
    return <>{children}</>;
  }

  const messageCount = await prisma.contactMessage.count({ where: { deletedAt: null } });

  return (
    <AdminShell userName={session.name} userRole={session.role} messageCount={messageCount}>
      {children}
    </AdminShell>
  );
}
