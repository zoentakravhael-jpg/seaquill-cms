"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/produk": "Produk",
  "/admin/produk/create": "Tambah Produk",
  "/admin/kategori-produk": "Kategori Produk",
  "/admin/kategori-produk/create": "Tambah Kategori",
  "/admin/artikel": "Artikel",
  "/admin/artikel/create": "Tambah Artikel",
  "/admin/kategori-artikel": "Kategori Artikel",
  "/admin/kategori-artikel/create": "Tambah Kategori",
  "/admin/pesan": "Pesan Masuk",
  "/admin/media": "Media Library",
};

function getBreadcrumbLabel(segment: string): string {
  if (segment === "edit") return "Edit";
  // Try to match numeric IDs
  if (/^\d+$/.test(segment)) return `#${segment}`;
  return breadcrumbMap[`/admin/${segment}`] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  messageCount?: number;
}

export default function AdminHeader({ onToggleSidebar, messageCount = 0 }: AdminHeaderProps) {
  const pathname = usePathname();

  // Build breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  if (segments.length > 1) {
    // Skip "admin" prefix, build paths from remaining segments
    let href = "/admin";
    for (let i = 1; i < segments.length; i++) {
      href += `/${segments[i]}`;
      breadcrumbs.push({
        label: getBreadcrumbLabel(segments[i]),
        href,
      });
    }
  }

  // Get page title
  const pageTitle = breadcrumbMap[pathname] || breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-header-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
        <nav className="admin-header-breadcrumb">
          <Link href="/admin">
            <i className="fas fa-home"></i>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.href} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="separator">/</span>
              {idx === breadcrumbs.length - 1 ? (
                <span className="current">{crumb.label}</span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="admin-header-right">
        <DarkModeToggle />
        <Link href="/admin/pesan" className="admin-header-btn" title="Pesan Masuk">
          <i className="fas fa-envelope"></i>
          {messageCount > 0 && <span className="badge-dot"></span>}
        </Link>
        <Link href="/" className="admin-header-btn" title="Lihat Website" target="_blank">
          <i className="fas fa-external-link-alt"></i>
        </Link>
      </div>
    </header>
  );
}
