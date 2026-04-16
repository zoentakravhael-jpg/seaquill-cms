"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";

// ─── Types ──────────────────────────────────

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "strong" | "image" | "badge" | "status" | "boolean-badge" | "boolean-toggle" | "code" | "date" | "truncate" | "mapped-badge" | "flags";
  flagKeys?: { key: string; label: string; variant: string }[];
  nestedKey?: string;
  badgeVariant?: string;
  imageAltKey?: string;
  imageSize?: number;
  imageFit?: "contain" | "cover";
  trueLabel?: string;
  falseLabel?: string;
  trueVariant?: string;
  falseVariant?: string;
  dateLocale?: string;
  dateOptions?: Record<string, string>;
  maxWidth?: number;
  maxLines?: number;
  badgeMap?: Record<string, { label: string; variant: string }>;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface AdminListPageProps {
  columns: Column[];
  data: any[];
  totalCount: number;
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  toggleActiveAction?: (id: number) => Promise<void>;
  toggleActiveKey?: string;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string>;
  editBasePath?: string;
  deleteAction?: (formData: FormData) => Promise<void>;
  duplicateAction?: (id: number) => Promise<void>;
  bulkDeleteAction?: (ids: number[]) => Promise<void>;
  bulkStatusAction?: (ids: number[], status: string) => Promise<void>;
  idKey?: string;
  entityName?: string;
  searchPlaceholder?: string;
  hasStatus?: boolean;
}

// ─── Helpers ────────────────────────────────

function ImageCell({ src, alt, size, fit }: { src: string; alt: string; size: number; fit: "contain" | "cover" }) {
  const [errored, setErrored] = useState(false);
  console.log("[ImageCell] src=", src, "errored=", errored);
  if (errored) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: 6,
          background: "#f5f5f5", border: "1px solid #ddd",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#aaa", fontSize: size * 0.3,
        }}
        title={src}
      >
        <i className="fas fa-image" />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 6, overflow: "hidden",
        background: "#f5f5f5", border: "1px solid #eee",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setErrored(true)}
        style={{ display: "block", width: "100%", height: "100%", objectFit: fit }}
      />
    </div>
  );
}

function getNestedValue(obj: any, path: string): unknown {
  return path.split(".").reduce((o, k) => o?.[k], obj);
}

function renderCell(item: any, col: Column) {
  const value = col.nestedKey ? getNestedValue(item, col.nestedKey) : item[col.key];
  switch (col.type) {
    case "strong":
      return <strong>{String(value ?? "")}</strong>;
    case "image": {
      if (!value) return <span style={{ color: "var(--admin-text-muted)" }}>—</span>;
      const alt = col.imageAltKey ? String(item[col.imageAltKey] ?? "") : "";
      const size = col.imageSize || 40;
      return <ImageCell src={String(value)} alt={alt} size={size} fit={col.imageFit || "contain"} />;
    }
    case "badge":
      return <span className={`admin-badge admin-badge-${col.badgeVariant || "blue"}`}>{String(value ?? "")}</span>;
    case "status": {
      const s = String(value || "draft");
      const labels: Record<string, string> = { draft: "Draft", published: "Published", archived: "Archived" };
      return <span className={`admin-badge admin-badge-status-${s}`}>{labels[s] || s}</span>;
    }
    case "boolean-badge": {
      const b = Boolean(value);
      return (
        <span className={`admin-badge admin-badge-${b ? (col.trueVariant || "green") : (col.falseVariant || "red")}`}>
          {b ? (col.trueLabel || "Ya") : (col.falseLabel || "Tidak")}
        </span>
      );
    }
    case "boolean-toggle": {
      const active = Boolean(value);
      return (
        <span className={`admin-badge admin-badge-${active ? (col.trueVariant || "green") : (col.falseVariant || "red")}`} style={{ cursor: "pointer", userSelect: "none" }}>
          {active ? (col.trueLabel || "Ya") : (col.falseLabel || "Tidak")}
        </span>
      );
    }
    case "code":
      return (
        <code style={{ fontSize: 12, color: "var(--admin-text-secondary)", background: "var(--admin-body-bg)", padding: "2px 6px", borderRadius: 4 }}>
          {String(value ?? "")}
        </code>
      );
    case "date": {
      if (!value) return <span style={{ color: "var(--admin-text-muted)" }}>—</span>;
      return new Date(value as string).toLocaleDateString(col.dateLocale || "id-ID", col.dateOptions as Intl.DateTimeFormatOptions);
    }
    case "truncate":
      return (
        <span style={{ display: "-webkit-box", WebkitLineClamp: col.maxLines || 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: col.maxWidth || 250 }}>
          {String(value ?? "")}
        </span>
      );
    case "mapped-badge": {
      const entry = col.badgeMap?.[String(value)];
      if (entry) return <span className={`admin-badge admin-badge-${entry.variant}`}>{entry.label}</span>;
      return String(value ?? "");
    }
    case "flags": {
      const flags = (col.flagKeys || []).filter(f => Boolean(item[f.key]));
      if (flags.length === 0) return <span style={{ color: "var(--admin-text-muted)" }}>—</span>;
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {flags.map(f => (
            <span key={f.key} className={`admin-badge admin-badge-${f.variant}`}>{f.label}</span>
          ))}
        </div>
      );
    }
    default:
      return String(value ?? "");
  }
}

// ─── Component ──────────────────────────────

export default function AdminListPage({
  columns,
  data,
  totalCount,
  page,
  perPage,
  sortBy,
  sortOrder,
  search,
  filters = [],
  activeFilters = {},
  editBasePath,
  deleteAction,
  duplicateAction,
  bulkDeleteAction,
  bulkStatusAction,
  toggleActiveAction,
  toggleActiveKey = "active",
  idKey = "id",
  entityName = "Data",
  searchPlaceholder = "Cari...",
  hasStatus = false,
}: AdminListPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchValue, setSearchValue] = useState(search);

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  // ─── URL builder ─────────────────────────
  const buildUrl = useCallback(
    (overrides: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(overrides)) {
        if (v === undefined || v === "" || v === "all") {
          params.delete(k);
        } else {
          params.set(k, String(v));
        }
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  // ─── Handlers ────────────────────────────
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ search: searchValue.trim(), page: 1 }));
  }

  function handleSort(key: string) {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    router.push(buildUrl({ sortBy: key, sortOrder: newOrder, page: 1 }));
  }

  function handleFilterChange(key: string, value: string) {
    router.push(buildUrl({ [key]: value, page: 1 }));
  }

  function handlePerPageChange(value: string) {
    router.push(buildUrl({ perPage: value, page: 1 }));
  }

  // ─── Bulk selection ──────────────────────
  const allIds = useMemo(() => data.map((item: any) => item[idKey]), [data, idKey]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    if (!bulkDeleteAction || selectedIds.size === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedIds.size} ${entityName.toLowerCase()}?`)) return;
    try {
      await bulkDeleteAction(Array.from(selectedIds));
      toast.success(`${selectedIds.size} ${entityName.toLowerCase()} berhasil dihapus`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Gagal menghapus data");
    }
  }

  async function handleBulkStatus(status: string) {
    if (!bulkStatusAction || selectedIds.size === 0) return;
    const labelMap: Record<string, string> = { draft: "Draft", published: "Published", archived: "Archived" };
    try {
      await bulkStatusAction(Array.from(selectedIds), status);
      toast.success(`${selectedIds.size} ${entityName.toLowerCase()} diubah ke ${labelMap[status] || status}`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Gagal mengubah status");
    }
  }

  async function handleDelete(formData: FormData) {
    if (!deleteAction) return;
    if (!confirm(`Yakin ingin menghapus ${entityName.toLowerCase()} ini?`)) return;
    try {
      await deleteAction(formData);
      toast.success(`${entityName} berhasil dihapus`);
    } catch {
      toast.error(`Gagal menghapus ${entityName.toLowerCase()}`);
    }
  }

  // ─── Pagination range ────────────────────
  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  const startItem = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalCount);

  return (
    <>
      {/* ─── Toolbar ──────────────────────── */}
      <div className="admin-list-toolbar">
        <form onSubmit={handleSearchSubmit} className="admin-list-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </form>
        {filters.length > 0 && (
          <div className="admin-list-filters">
            {filters.map((f) => (
              <select
                key={f.key}
                className="admin-list-filter-select"
                value={activeFilters[f.key] || "all"}
                onChange={(e) => handleFilterChange(f.key, e.target.value)}
              >
                <option value="all">{f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* ─── Bulk Bar ─────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="admin-bulk-bar">
          <span>
            <span className="bulk-count">{selectedIds.size}</span> item dipilih
          </span>
          <div className="bulk-actions">
            {hasStatus && bulkStatusAction && (
              <>
                <button className="bulk-btn" onClick={() => handleBulkStatus("published")}>
                  <i className="fas fa-check"></i> Publish
                </button>
                <button className="bulk-btn" onClick={() => handleBulkStatus("draft")}>
                  <i className="fas fa-file"></i> Draft
                </button>
                <button className="bulk-btn" onClick={() => handleBulkStatus("archived")}>
                  <i className="fas fa-archive"></i> Archive
                </button>
              </>
            )}
            {bulkDeleteAction && (
              <button className="bulk-btn danger" onClick={handleBulkDelete}>
                <i className="fas fa-trash-alt"></i> Hapus
              </button>
            )}
            <button className="bulk-btn-cancel" onClick={() => setSelectedIds(new Set())}>
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ─── Table ────────────────────────── */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                {(bulkDeleteAction || bulkStatusAction) && (
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="bulk-checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`${col.sortable ? "sortable" : ""} ${sortBy === col.key ? "sort-active" : ""}`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    {col.label}
                    {col.sortable && (
                      <span className="sort-icon">
                        <i
                          className={`fas fa-sort${
                            sortBy === col.key
                              ? sortOrder === "asc"
                                ? "-up"
                                : "-down"
                              : ""
                          }`}
                        />
                      </span>
                    )}
                  </th>
                ))}
                {(editBasePath || deleteAction || duplicateAction) && (
                  <th style={{ textAlign: "right", width: 120 }}>Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (editBasePath || deleteAction || duplicateAction ? 1 : 0) +
                      (bulkDeleteAction || bulkStatusAction ? 1 : 0)
                    }
                  >
                    <div className="admin-empty">
                      <div className="admin-empty-icon">
                        <i className="fas fa-inbox"></i>
                      </div>
                      <p className="admin-empty-text">Tidak ada data ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item: any) => {
                  const id = item[idKey];
                  return (
                    <tr key={id}>
                      {(bulkDeleteAction || bulkStatusAction) && (
                        <td>
                          <input
                            type="checkbox"
                            className="bulk-checkbox"
                            checked={selectedIds.has(id)}
                            onChange={() => toggleSelect(id)}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          onClick={
                            col.type === "boolean-toggle" && toggleActiveAction
                              ? () => {
                                  toggleActiveAction(id).then(() => {
                                    toast.success(`Status berhasil diubah`);
                                    router.refresh();
                                  });
                                }
                              : undefined
                          }
                        >
                          {renderCell(item, col)}
                        </td>
                      ))}
                      {(editBasePath || deleteAction || duplicateAction) && (
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                            {editBasePath && (
                              <Link href={`${editBasePath}/${id}`} className="admin-btn-icon edit" title="Edit">
                                <i className="fas fa-pen"></i>
                              </Link>
                            )}
                            {duplicateAction && (
                              <button
                                type="button"
                                className="admin-btn-icon"
                                title="Duplikat"
                                style={{ color: "var(--admin-text-secondary)" }}
                                onClick={async () => {
                                  try {
                                    await duplicateAction(id);
                                    toast.success("Berhasil diduplikat sebagai draft");
                                    router.refresh();
                                  } catch {
                                    toast.error("Gagal menduplikat");
                                  }
                                }}
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            )}
                            {deleteAction && (
                              <form action={handleDelete}>
                                <input type="hidden" name="id" value={id} />
                                <button type="submit" className="admin-btn-icon delete" title="Hapus">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ───────────────────── */}
        {totalCount > 0 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Menampilkan {startItem}–{endItem} dari {totalCount}
            </span>
            <div className="admin-pagination-pages">
              <Link
                href={buildUrl({ page: Math.max(1, page - 1) })}
                className={`admin-pagination-btn${page <= 1 ? "" : ""}`}
                aria-disabled={page <= 1}
                onClick={(e) => { if (page <= 1) e.preventDefault(); }}
                style={page <= 1 ? { opacity: 0.4, pointerEvents: "none" } : undefined}
              >
                <i className="fas fa-chevron-left"></i>
              </Link>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="admin-pagination-ellipsis">...</span>
                ) : (
                  <Link
                    key={p}
                    href={buildUrl({ page: p })}
                    className={`admin-pagination-btn${p === page ? " active" : ""}`}
                  >
                    {p}
                  </Link>
                )
              )}
              <Link
                href={buildUrl({ page: Math.min(totalPages, page + 1) })}
                className="admin-pagination-btn"
                aria-disabled={page >= totalPages}
                onClick={(e) => { if (page >= totalPages) e.preventDefault(); }}
                style={page >= totalPages ? { opacity: 0.4, pointerEvents: "none" } : undefined}
              >
                <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
            <div className="admin-pagination-perpage">
              <span>Per halaman:</span>
              <select value={perPage} onChange={(e) => handlePerPageChange(e.target.value)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
