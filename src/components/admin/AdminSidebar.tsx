"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { href: "/admin/produk", label: "Produk", icon: "fas fa-box" },
  { href: "/admin/kategori-produk", label: "Kategori Produk", icon: "fas fa-tags" },
  { href: "/admin/artikel", label: "Artikel", icon: "fas fa-newspaper" },
  { href: "/admin/kategori-artikel", label: "Kategori Artikel", icon: "fas fa-folder" },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: "fas fa-envelope" },
];

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3">
          <img src="/assets/img/logo.svg" alt="Sea-Quill" className="h-8" />
          <span className="font-bold text-gray-800 text-sm">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i className={`${item.icon} w-5 text-center`}></i>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-blue-600 text-xs"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i>
          Keluar
        </button>
        <Link
          href="/"
          className="block mt-1 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
        >
          <i className="fas fa-globe"></i>
          Lihat Website
        </Link>
      </div>
    </aside>
  );
}
