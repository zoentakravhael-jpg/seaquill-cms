"use client";

import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import MediaLibraryModal from "./MediaLibraryModal";

interface ImageUploadProps {
  name: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export default function ImageUpload({
  name,
  value,
  onChange,
  label = "Gambar",
  hint,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("File harus berupa gambar atau video");
        return;
      }
      const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`Ukuran file maksimal ${file.type.startsWith("video/") ? "50MB" : "5MB"}`);
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload gagal");
        }

        const data = await res.json();
        onChange(data.url);
        toast.success("File berhasil diupload");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload gagal");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  return (
    <div className="admin-form-group">
      {label && <label className="admin-form-label">{label}</label>}
      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="admin-upload-preview">
          {/\.(mp4|webm|ogg)$/i.test(value) ? (
            <video src={value} controls style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }} />
          ) : (
            <img src={value} alt="Preview" />
          )}
          <button
            type="button"
            className="admin-upload-preview-remove"
            onClick={() => onChange("")}
            title="Hapus gambar"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="admin-upload-actions-overlay">
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => fileRef.current?.click()}
            >
              <i className="fas fa-upload"></i> Ganti
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => setShowLibrary(true)}
            >
              <i className="fas fa-images"></i> Library
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-upload-dual">
          <div
            className={`admin-upload-zone ${dragOver ? "dragover" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {uploading ? (
              <>
                <div className="admin-upload-icon">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <div className="admin-upload-text">Mengupload...</div>
              </>
            ) : (
              <>
                <div className="admin-upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div className="admin-upload-text">
                  Drag & drop atau <strong>klik upload</strong>
                </div>
                <div className="admin-upload-hint">PNG, JPG, WebP, MP4, WebM — Maks 5MB (gambar) / 50MB (video)</div>
              </>
            )}
          </div>
          <button
            type="button"
            className="admin-upload-library-btn"
            onClick={() => setShowLibrary(true)}
          >
            <i className="fas fa-images"></i>
            <span>Pilih dari Media Library</span>
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />

      {/* Fallback: manual URL input */}
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau masukkan URL gambar"
          className="admin-form-input"
          style={{ flex: 1, fontSize: 13, padding: "6px 10px" }}
        />
      </div>
      {hint && <p className="admin-form-hint">{hint}</p>}

      <MediaLibraryModal
        open={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={(url) => onChange(url)}
      />
    </div>
  );
}
