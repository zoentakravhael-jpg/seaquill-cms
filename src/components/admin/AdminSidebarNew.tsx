"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Menu Utama",
    items: [
      { href: "/admin", label: "Dashboard", icon: "fas fa-th-large" },
      { href: "/admin/activity-log", label: "Activity Log", icon: "fas fa-history" },
    ],
  },
  {
    title: "Layout",
    items: [
      { href: "/admin/layout-pages/homepage", label: "Homepage", icon: "fas fa-home" },
      { href: "/admin/layout-pages/tentang", label: "Tentang Seaquill", icon: "fas fa-building" },
      { href: "/admin/layout-pages/produk", label: "Produk Seaquill", icon: "fas fa-box-open" },
      { href: "/admin/layout-pages/artikel", label: "Artikel", icon: "fas fa-file-alt" },
      { href: "/admin/layout-pages/promo", label: "Promo & Event", icon: "fas fa-bullhorn" },
      { href: "/admin/layout-pages/galeri", label: "Galeri", icon: "fas fa-images" },
      { href: "/admin/layout-pages/hubungi-kami", label: "Hubungi Kami", icon: "fas fa-phone-alt" },
    ],
  },
  {
    title: "Konten",
    items: [
      { href: "/admin/produk", label: "Produk", icon: "fas fa-box-open" },
      { href: "/admin/kategori-produk", label: "Kategori Produk", icon: "fas fa-tags" },
      { href: "/admin/artikel", label: "Artikel", icon: "fas fa-file-alt" },
      { href: "/admin/kategori-artikel", label: "Kategori Artikel", icon: "fas fa-folder-open" },
    ],
  },
  {
    title: "Homepage",
    items: [
      { href: "/admin/hero-slides", label: "Hero Slides", icon: "fas fa-images" },
      { href: "/admin/brand-partners", label: "Brand Partners", icon: "fas fa-handshake" },
    ],
  },
  {
    title: "Halaman Statis",
    items: [
      { href: "/admin/gallery", label: "Gallery", icon: "fas fa-camera" },
      { href: "/admin/promo", label: "Promo", icon: "fas fa-bullhorn" },
      { href: "/admin/events", label: "Events", icon: "fas fa-calendar-alt" },
    ],
  },
  {
    title: "Media & Pesan",
    items: [
      { href: "/admin/media", label: "Media Library", icon: "fas fa-images" },
      { href: "/admin/pesan", label: "Pesan Masuk", icon: "fas fa-envelope" },
      { href: "/admin/form-builder", label: "Form Builder", icon: "fas fa-wpforms" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/users", label: "Manajemen User", icon: "fas fa-users-cog" },
      { href: "/admin/settings", label: "Pengaturan", icon: "fas fa-cog" },
      { href: "/admin/trash", label: "Tempat Sampah", icon: "fas fa-trash-alt" },
    ],
  },
];

interface AdminSidebarProps {
  userName: string;
  userRole?: string;
  isOpen: boolean;
  onClose: () => void;
  messageCount?: number;
}

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
};

export default function AdminSidebar({ userName, userRole = "admin", isOpen, onClose, messageCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  // Get user initials
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <img src="/assets/img/logo.svg" alt="Sea-Quill" className="admin-sidebar-logo" />
          <span>SeaQuill CMS</span>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title} className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={onClose}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                  {item.href === "/admin/pesan" && messageCount > 0 && (
                    <span className="admin-sidebar-badge">{messageCount}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer / User */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">{initials}</div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">{userName}</div>
              <div className="admin-sidebar-user-role">{roleLabels[userRole] || userRole}</div>
            </div>
            <button
              onClick={handleLogout}
              className="admin-btn-ghost"
              title="Keluar"
              style={{ color: "#94A3B8", padding: 6 }}
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
