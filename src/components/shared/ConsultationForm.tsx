"use client";

import { useState, FormEvent } from "react";

export default function ConsultationForm() {
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
          phone: formData.get("phone"),
          message: formData.get("message"),
          source: "consultation",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Pesan konsultasi berhasil dikirim!" });
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
    <form className="widget-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Full Name"
          required
        />
        <i className="fal fa-user"></i>
      </div>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          name="email"
          placeholder="Your Email"
          required
        />
        <i className="fal fa-envelope"></i>
      </div>
      <div className="form-group">
        <input
          type="tel"
          className="form-control"
          name="phone"
          placeholder="Your Phone"
        />
        <i className="fal fa-phone"></i>
      </div>
      <div className="form-group">
        <textarea
          name="message"
          cols={30}
          rows={3}
          className="form-control"
          placeholder="Your Message"
          required
        ></textarea>
        <i className="fal fa-comment"></i>
      </div>
      <div className="form-btn">
        <button className="th-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Us"}
        </button>
      </div>
      {status && (
        <p className={`form-messages mb-0 mt-3 ${status.type === "success" ? "text-success" : "text-danger"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
