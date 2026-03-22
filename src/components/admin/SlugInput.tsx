"use client";

import { useCallback } from "react";

interface SlugInputProps {
  sourceValue: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugInput({
  sourceValue,
  name = "slug",
  value,
  onChange,
  placeholder = "auto-generated-slug",
  error,
}: SlugInputProps) {
  const handleGenerate = useCallback(() => {
    if (sourceValue) {
      onChange(generateSlug(sourceValue));
    }
  }, [sourceValue, onChange]);

  return (
    <div className={`admin-form-group${error ? " has-error" : ""}`}>
      <label className="admin-form-label">
        Slug <span className="required">*</span>
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className="admin-form-input"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={handleGenerate}
          className="admin-btn admin-btn-secondary admin-btn-sm"
          title="Generate dari judul"
        >
          <i className="fas fa-magic"></i>
        </button>
      </div>
      {error ? (
        <p className="admin-form-error">{error}</p>
      ) : (
        <p className="admin-form-hint">
          URL-friendly identifier. Klik tombol magic untuk auto-generate dari judul.
        </p>
      )}
    </div>
  );
}

export { generateSlug };
