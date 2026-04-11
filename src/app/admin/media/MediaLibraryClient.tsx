"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { deleteMediaFile } from "../actions";

interface MediaFile {
  id: number;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string;
  createdAt: Date;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryClient({ files: initialFiles }: { files: MediaFile[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(fileList: FileList) {
    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          successCount++;
        } else {
          const data = await res.json();
          toast.error(`${file.name}: ${data.error}`);
        }
      } catch {
        toast.error(`${file.name}: Upload gagal`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file berhasil diupload`);
      // Reload page to get fresh data
      window.location.reload();
    }
    setUploading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus file ini?")) return;
    const formData = new FormData();
    formData.append("id", id.toString());
    await deleteMediaFile(formData);
    setFiles(files.filter((f) => f.id !== id));
    setSelected(null);
    toast.success("File berhasil dihapus");
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL disalin ke clipboard");
  }

  const selectedFile = files.find((f) => f.id === selected);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">{files.length} file</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="admin-btn admin-btn-primary"
          disabled={uploading}
        >
          <i className={uploading ? "fas fa-spinner fa-spin" : "fas fa-cloud-upload-alt"}></i>
          {uploading ? "Mengupload..." : "Upload File"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) handleUpload(e.target.files);
            e.target.value = "";
          }}
          style={{ display: "none" }}
        />
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Grid */}
        <div style={{ flex: 1 }}>
          {files.length === 0 ? (
            <div className="admin-card">
              <div className="admin-empty">
                <div className="admin-empty-icon">
                  <i className="fas fa-images"></i>
                </div>
                <p className="admin-empty-text">Belum ada media. Upload gambar pertama Anda.</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelected(file.id === selected ? null : file.id)}
                  style={{
                    borderRadius: "var(--admin-radius-sm)",
                    border: `2px solid ${file.id === selected ? "var(--admin-primary)" : "var(--admin-border)"}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "white",
                    transition: "all 200ms",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#F8FAFC",
                      overflow: "hidden",
                    }}
                  >
                    {file.mimeType?.startsWith("video/") ? (
                      <video src={file.url} muted style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    ) : (
                      <img
                        src={file.url}
                        alt={file.alt || file.filename}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    )}
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--admin-text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.filename}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedFile && (
          <div className="admin-card" style={{ width: 300, flexShrink: 0, alignSelf: "flex-start" }}>
            <div className="admin-card-header">
              <span className="admin-card-title">Detail File</span>
              <button
                onClick={() => setSelected(null)}
                className="admin-btn-ghost"
                style={{ padding: 4, fontSize: 14 }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-card-body">
              <div
                style={{
                  aspectRatio: "16/10",
                  background: "#F8FAFC",
                  borderRadius: "var(--admin-radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  overflow: "hidden",
                }}
              >
                {selectedFile.mimeType?.startsWith("video/") ? (
                  <video src={selectedFile.url} controls style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.alt || selectedFile.filename}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                )}
              </div>
              <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <span style={{ color: "var(--admin-text-muted)", display: "block", fontSize: 11, marginBottom: 2 }}>Nama File</span>
                  <span style={{ fontWeight: 500 }}>{selectedFile.filename}</span>
                </div>
                <div>
                  <span style={{ color: "var(--admin-text-muted)", display: "block", fontSize: 11, marginBottom: 2 }}>Tipe</span>
                  <span>{selectedFile.mimeType}</span>
                </div>
                <div>
                  <span style={{ color: "var(--admin-text-muted)", display: "block", fontSize: 11, marginBottom: 2 }}>Ukuran</span>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
                <div>
                  <span style={{ color: "var(--admin-text-muted)", display: "block", fontSize: 11, marginBottom: 2 }}>URL</span>
                  <code
                    style={{
                      fontSize: 12,
                      background: "var(--admin-body-bg)",
                      padding: "4px 8px",
                      borderRadius: 4,
                      display: "block",
                      wordBreak: "break-all",
                    }}
                  >
                    {selectedFile.url}
                  </code>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  onClick={() => handleCopyUrl(selectedFile.url)}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ flex: 1 }}
                >
                  <i className="fas fa-copy"></i> Salin URL
                </button>
                <button
                  onClick={() => handleDelete(selectedFile.id)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
