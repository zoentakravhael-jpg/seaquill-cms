"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError(data.error);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      padding: 16,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "white",
        borderRadius: 16,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        padding: "40px 32px",
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/assets/img/logo.png" alt="Sea-Quill" style={{ height: 100, margin: "0 auto 16px", display: "block" }} />
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.025em",
            marginBottom: 4,
          }}>
            Selamat Datang
          </h1>
          <p style={{ fontSize: 14, color: "#64748B" }}>
            Masuk ke panel administrasi Sea-Quill
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#0F172A",
              marginBottom: 6,
            }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="admin-form-input"
              placeholder="admin@seaquill.com"
              style={{ padding: "12px 14px" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#0F172A",
              marginBottom: 6,
            }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="admin-form-input"
              placeholder="••••••••"
              style={{ padding: "12px 14px" }}
            />
          </div>

          {error && (
            <div style={{
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: 13,
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 20,
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#94A3B8" : "#0066FF",
              color: "white",
              padding: "12px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 200ms",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Memproses...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Masuk
              </>
            )}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          fontSize: 12,
          color: "#94A3B8",
          marginTop: 24,
        }}>
          &copy; {new Date().getFullYear()} Sea-Quill Indonesia. All rights reserved.
        </p>
      </div>
    </div>
  );
}
