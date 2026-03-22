"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { ActionResult } from "@/app/admin/actions";

interface UserData {
  id?: number;
  name: string;
  email: string;
  role: string;
}

interface UserFormProps {
  initialData?: UserData;
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
}

export default function UserForm({ initialData, action, backHref }: UserFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      const result = await action(formData);
      if (result.success) {
        toast.success(initialData ? "User berhasil diperbarui" : "User berhasil ditambahkan");
        router.push(result.redirect);
      } else {
        toast.error(result.error);
        setSubmitting(false);
      }
    } catch {
      toast.error("Gagal menyimpan user");
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      <div className="admin-form-grid admin-form-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Nama <span className="required">*</span></label>
          <input name="name" required defaultValue={initialData?.name ?? ""} className="admin-form-input" placeholder="Nama lengkap" />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Email <span className="required">*</span></label>
          <input name="email" type="email" required defaultValue={initialData?.email ?? ""} className="admin-form-input" placeholder="email@example.com" />
        </div>
      </div>

      <div className="admin-form-grid admin-form-grid-2">
        <div className="admin-form-group">
          <label className="admin-form-label">Password {initialData ? "(kosongkan jika tidak diubah)" : ""} <span className="required">{!initialData && "*"}</span></label>
          <input name="password" type="password" required={!initialData} className="admin-form-input" placeholder="••••••••" minLength={6} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Role</label>
          <select name="role" defaultValue={initialData?.role ?? "viewer"} className="admin-form-select">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <p className="admin-form-hint">Admin: akses penuh. Editor: bisa edit konten. Viewer: hanya lihat.</p>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary">
          {submitting ? <><i className="fas fa-spinner fa-spin"></i> Menyimpan...</> : <><i className="fas fa-save"></i> Simpan</>}
        </button>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => router.push(backHref)}>
          Batal
        </button>
      </div>
    </form>
  );
}
