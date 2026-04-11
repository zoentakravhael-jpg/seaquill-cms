"use client";

import { useState, FormEvent } from "react";
import type { FormField, FormSettings } from "@/types/form-builder";

interface Props {
  slug: string;
  fields: FormField[];
  settings: FormSettings;
}

export default function DynamicForm({ slug, fields, settings }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) init[f.name] = "";
    return init;
  });

  function updateValue(name: string, val: string) {
    setValues((prev) => ({ ...prev, [name]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/forms/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message || settings.successMessage });
        // Reset form
        setValues(() => {
          const init: Record<string, string> = {};
          for (const f of fields) init[f.name] = "";
          return init;
        });

        // Open WhatsApp if configured
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        }
      } else {
        setStatus({ type: "error", message: data.error || "Terjadi kesalahan" });
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
        {fields.map((field) => {
          if (field.type === "hidden") {
            return <input key={field.id} type="hidden" name={field.name} value={field.placeholder} />;
          }

          const colClass = field.width === "half" ? "col-md-6" : "col-12";

          return (
            <div key={field.id} className={`form-group ${colClass}`}>
              {/* Text-based inputs */}
              {(field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "number" || field.type === "url" || field.type === "date") && (
                <>
                  <input
                    type={field.type}
                    className="form-control"
                    name={field.name}
                    placeholder={field.placeholder || field.label}
                    required={field.required}
                    value={values[field.name] || ""}
                    onChange={(e) => updateValue(field.name, e.target.value)}
                    minLength={field.validation?.minLength}
                    maxLength={field.validation?.maxLength}
                  />
                  {field.icon && <i className={field.icon}></i>}
                </>
              )}

              {/* Textarea */}
              {field.type === "textarea" && (
                <>
                  <textarea
                    name={field.name}
                    cols={30}
                    rows={5}
                    className="form-control"
                    placeholder={field.placeholder || field.label}
                    required={field.required}
                    value={values[field.name] || ""}
                    onChange={(e) => updateValue(field.name, e.target.value)}
                  ></textarea>
                  {field.icon && <i className={field.icon}></i>}
                </>
              )}

              {/* Select */}
              {field.type === "select" && (
                <select
                  className="form-control"
                  name={field.name}
                  required={field.required}
                  value={values[field.name] || ""}
                  onChange={(e) => updateValue(field.name, e.target.value)}
                >
                  <option value="">{field.placeholder || `Pilih ${field.label}...`}</option>
                  {field.options.filter(Boolean).map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {/* Radio */}
              {field.type === "radio" && (
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>{field.label}{field.required && " *"}</label>
                  {field.options.filter(Boolean).map((opt, i) => (
                    <label key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 16, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name={field.name}
                        value={opt}
                        required={field.required}
                        checked={values[field.name] === opt}
                        onChange={(e) => updateValue(field.name, e.target.value)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Checkbox */}
              {field.type === "checkbox" && (
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>{field.label}{field.required && " *"}</label>
                  {field.options.filter(Boolean).map((opt, i) => {
                    const currentVals = (values[field.name] || "").split(",").filter(Boolean);
                    const isChecked = currentVals.includes(opt);
                    return (
                      <label key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 16, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={isChecked}
                          onChange={(e) => {
                            let next: string[];
                            if (e.target.checked) next = [...currentVals, opt];
                            else next = currentVals.filter((v) => v !== opt);
                            updateValue(field.name, next.join(","));
                          }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="form-btn col-12">
          <button type="submit" className="th-btn" disabled={loading}>
            {loading ? "Mengirim..." : (settings.submitText || "Kirim Pesan")}
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
