"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("number"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          source: "contact",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message });
        form.reset();
      } else {
        setStatus({ type: "error", message: data.error });
      }
    } catch {
      setStatus({ type: "error", message: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="contact-form ajax-contact" onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group col-md-6">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Nama Lengkap"
            required
          />
          <i className="fal fa-user"></i>
        </div>
        <div className="form-group col-md-6">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email Anda"
            required
          />
          <i className="fal fa-envelope"></i>
        </div>
        <div className="form-group col-md-6">
          <input
            type="text"
            className="form-control"
            name="subject"
            placeholder="Subjek"
          />
          <i className="fal fa-edit"></i>
        </div>
        <div className="form-group col-md-6">
          <input
            type="tel"
            className="form-control"
            name="number"
            placeholder="Nomor Telepon"
          />
          <i className="fal fa-phone"></i>
        </div>
        <div className="form-group col-12">
          <textarea
            name="message"
            cols={30}
            rows={5}
            className="form-control"
            placeholder="Tulis Pesan Anda..."
            required
          ></textarea>
          <i className="fal fa-comment"></i>
        </div>
        <div className="form-btn col-12">
          <button type="submit" className="th-btn" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Pesan"}
            {!loading && <i className="fa-regular fa-arrow-right ms-2"></i>}
          </button>
        </div>
      </div>
      {status && (
        <p className={`form-messages mt-3 mb-0 ${status.type === "success" ? "text-success" : "text-danger"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
