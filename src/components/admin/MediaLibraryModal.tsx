"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

interface MediaFile {
  id: number;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryModal({ open, onClose, onSelect }: MediaLibraryModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch {
      toast.error("Gagal memuat media library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchFiles();
      setSelected(null);
      setSearch("");
    }
  }, [open, fetchFiles]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  async function handleUpload(fileList: FileList) {
    setUploading(true);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(`${file.name}: ${data.error}`);
        }
      } catch {
        toast.error(`${file.name}: Upload gagal`);
      }
    }
    setUploading(false);
    toast.success("Upload selesai");
    fetchFiles();
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  const filtered = search
    ? files.filter((f) => f.filename.toLowerCase().includes(search.toLowerCase()))
    : files;

  if (!open) return null;

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="media-modal-header">
          <h2 className="media-modal-title">
            <i className="fas fa-images"></i> Media Library
          </h2>
          <button onClick={onClose} className="media-modal-close" title="Tutup">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Toolbar */}
        <div className="media-modal-toolbar">
          <div className="media-modal-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Cari file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="admin-btn admin-btn-primary admin-btn-sm"
            disabled={uploading}
          >
            <i className={uploading ? "fas fa-spinner fa-spin" : "fas fa-cloud-upload-alt"}></i>
            {uploading ? "Mengupload..." : "Upload Baru"}
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

        {/* Content */}
        <div className="media-modal-content">
          {loading ? (
            <div className="media-modal-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Memuat media...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="media-modal-empty">
              <i className="fas fa-images"></i>
              <p>{search ? "Tidak ditemukan file yang cocok" : "Belum ada media. Upload gambar terlebih dahulu."}</p>
            </div>
          ) : (
            <div className="media-modal-grid">
              {filtered.map((file) => (
                <div
                  key={file.id}
                  className={`media-modal-item ${selected === file.url ? "selected" : ""}`}
                  onClick={() => setSelected(file.url === selected ? null : file.url)}
                >
                  <div className="media-modal-item-img">
                    {file.mimeType?.startsWith("video/") ? (
                      <video src={file.url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src={file.url} alt={file.filename} />
                    )}
                    {selected === file.url && (
                      <div className="media-modal-item-check">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                  </div>
                  <div className="media-modal-item-info">
                    <span className="media-modal-item-name">{file.filename}</span>
                    <span className="media-modal-item-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="media-modal-footer">
          <span className="media-modal-count">{filtered.length} file</span>
          <div className="media-modal-actions">
            <button onClick={onClose} className="admin-btn admin-btn-secondary admin-btn-sm">
              Batal
            </button>
            <button
              onClick={handleConfirm}
              className="admin-btn admin-btn-primary admin-btn-sm"
              disabled={!selected}
            >
              <i className="fas fa-check"></i> Pilih Gambar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
