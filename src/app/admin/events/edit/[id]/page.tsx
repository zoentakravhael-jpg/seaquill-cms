import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateEventItem } from "../../../actions";
import EventItemForm from "@/components/admin/EventItemForm";

export default async function EditEventItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.eventItem.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/events" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Edit Event</h1>
            <p className="admin-page-subtitle">{item.title}</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <EventItemForm initialData={item} action={updateEventItem} backHref="/admin/events" />
        </div>
      </div>
    </>
  );
}
