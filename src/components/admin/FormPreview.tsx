"use client";

import { FormField, FormSettings } from "@/types/form-builder";

interface Props {
  fields: FormField[];
  settings: FormSettings;
}

export default function FormPreview({ fields, settings }: Props) {
  if (fields.length === 0) {
    return (
      <div className="admin-card" style={{ textAlign: "center", padding: "40px 24px" }}>
        <i className="fas fa-eye-slash" style={{ fontSize: 40, color: "#CBD5E1", marginBottom: 12, display: "block" }}></i>
        <p style={{ color: "#94A3B8" }}>Tambahkan field di tab Fields untuk melihat preview.</p>
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ marginBottom: 0 }}>
      <div className="admin-card-header">
        <span className="admin-card-title"><i className="fas fa-eye" style={{ color: "#8B5CF6" }}></i> Preview Form</span>
      </div>
      <div className="admin-card-body" style={{ padding: 24 }}>
        {/* Simulated form area with original site styling */}
        <div style={{ maxWidth: 700, margin: "0 auto", background: "#FAFAFA", borderRadius: 12, padding: 24, border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {fields.map((field) => {
              if (field.type === "hidden") return null;

              const wrapStyle: React.CSSProperties = {
                flex: field.width === "half" ? "0 0 calc(50% - 8px)" : "0 0 100%",
                minWidth: field.width === "half" ? 200 : undefined,
                marginBottom: 16,
              };

              return (
                <div key={field.id} style={wrapStyle}>
                  <label style={{ display: "block", fontWeight: 500, fontSize: 14, marginBottom: 6, color: "#334155" }}>
                    {field.label}
                    {field.required && <span style={{ color: "#EF4444", marginLeft: 4 }}>*</span>}
                  </label>

                  {(field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "number" || field.type === "url" || field.type === "date") && (
                    <div style={{ position: "relative" }}>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        disabled
                        style={{
                          width: "100%",
                          padding: field.icon ? "10px 10px 10px 36px" : "10px 12px",
                          border: "1px solid #D1D5DB",
                          borderRadius: 8,
                          fontSize: 14,
                          background: "#fff",
                          color: "#334155",
                        }}
                      />
                      {field.icon && (
                        <i className={field.icon} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 14 }}></i>
                      )}
                    </div>
                  )}

                  {field.type === "textarea" && (
                    <div style={{ position: "relative" }}>
                      <textarea
                        placeholder={field.placeholder}
                        disabled
                        style={{
                          width: "100%",
                          padding: field.icon ? "10px 10px 10px 36px" : "10px 12px",
                          border: "1px solid #D1D5DB",
                          borderRadius: 8,
                          fontSize: 14,
                          minHeight: 100,
                          resize: "vertical",
                          background: "#fff",
                        }}
                      />
                      {field.icon && (
                        <i className={field.icon} style={{ position: "absolute", left: 12, top: 14, color: "#94A3B8", fontSize: 14 }}></i>
                      )}
                    </div>
                  )}

                  {field.type === "select" && (
                    <select
                      disabled
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, background: "#fff" }}
                    >
                      <option>{field.placeholder || "Pilih..."}</option>
                      {field.options.filter(Boolean).map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {field.type === "radio" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {field.options.filter(Boolean).map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#475569" }}>
                          <input type="radio" disabled name={`preview_${field.id}`} /> {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {field.options.filter(Boolean).map((opt, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#475569" }}>
                          <input type="checkbox" disabled className="admin-form-checkbox" /> {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit button preview */}
          <button
            type="button"
            disabled
            style={{
              marginTop: 8,
              padding: "12px 32px",
              background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: "default",
              opacity: 0.9,
            }}
          >
            {settings.submitText || "Kirim"}
            <i className="fa-regular fa-arrow-right" style={{ marginLeft: 8 }}></i>
          </button>
        </div>

        {/* Notification badge preview */}
        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {settings.emailNotification.enabled && (
            <span className="admin-badge" style={{ background: "#DBEAFE", color: "#2563EB", padding: "6px 12px" }}>
              <i className="fas fa-envelope"></i> Email Notification: ON → {settings.emailNotification.to || "(belum diset)"}
            </span>
          )}
          {settings.whatsappNotification.enabled && (
            <span className="admin-badge" style={{ background: "#D1FAE5", color: "#059669", padding: "6px 12px" }}>
              <i className="fab fa-whatsapp"></i> WhatsApp Notification: ON → {settings.whatsappNotification.phone || "(belum diset)"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
