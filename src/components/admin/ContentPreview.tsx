"use client";

import { useState } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

interface ContentPreviewProps {
  title: string;
  image?: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: string;
  status?: string;
}

export default function ContentPreview({
  title,
  image,
  content,
  excerpt,
  author,
  category,
  status,
}: ContentPreviewProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        className="admin-btn admin-btn-ghost"
        onClick={() => setOpen(true)}
      >
        <i className="fas fa-eye"></i> Preview
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="admin-btn admin-btn-ghost"
        onClick={() => setOpen(true)}
      >
        <i className="fas fa-eye"></i> Preview
      </button>
      <div className="admin-preview-overlay" onClick={() => setOpen(false)}>
        <div className="admin-preview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="admin-preview-header">
            <h3>Preview Konten</h3>
            <button
              type="button"
              className="admin-preview-close"
              onClick={() => setOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="admin-preview-body">
            {status && (
              <span
                className={`admin-badge admin-badge-status-${status}`}
                style={{ marginBottom: 12, display: "inline-block" }}
              >
                {status === "published" ? "Published" : status === "draft" ? "Draft" : "Archived"}
              </span>
            )}
            {category && (
              <span className="admin-badge admin-badge-blue" style={{ marginBottom: 12, marginLeft: 8, display: "inline-block" }}>
                {category}
              </span>
            )}
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "var(--admin-text-primary)" }}>
              {title || "Judul belum diisi"}
            </h1>
            {author && (
              <p style={{ fontSize: 13, color: "var(--admin-text-muted)", marginBottom: 16 }}>
                <i className="fas fa-user" style={{ marginRight: 6 }}></i>
                {author}
              </p>
            )}
            {image && (
              <img
                src={image}
                alt={title}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              />
            )}
            {excerpt && (
              <p style={{ fontSize: 14, color: "var(--admin-text-secondary)", fontStyle: "italic", marginBottom: 16, padding: "12px 16px", background: "var(--admin-body-bg)", borderRadius: 8, borderLeft: "3px solid var(--admin-primary)" }}>
                {excerpt}
              </p>
            )}
            <div
              className="admin-preview-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content || "<p style='color:var(--admin-text-muted)'>Konten belum diisi</p>") }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
