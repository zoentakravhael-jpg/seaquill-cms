import Link from "next/link";
import { createEventItem } from "../../actions";
import EventItemForm from "@/components/admin/EventItemForm";

export default function CreateEventItemPage() {
  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/events" className="admin-btn admin-btn-ghost" title="Kembali">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="admin-page-title">Tambah Event</h1>
            <p className="admin-page-subtitle">Buat event baru</p>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-body">
          <EventItemForm action={createEventItem} backHref="/admin/events" />
        </div>
      </div>
    </>
  );
}
