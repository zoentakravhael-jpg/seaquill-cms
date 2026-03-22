"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;

      // Ctrl+S / Cmd+S — Submit nearest form
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const form = document.querySelector("form");
        if (form) {
          form.requestSubmit();
        }
      }

      // Escape — Close sidebar or modal
      if (e.key === "Escape") {
        // Close mobile sidebar
        const overlay = document.querySelector(".fixed.inset-0.z-40") as HTMLElement;
        if (overlay) {
          overlay.click();
          return;
        }
        // Close preview modal
        const previewOverlay = document.querySelector(".admin-preview-overlay") as HTMLElement;
        if (previewOverlay) {
          previewOverlay.click();
          return;
        }
      }

      // Skip navigation shortcuts when typing in inputs
      if (isInput) return;

      // Alt+D — Go to Dashboard
      if (e.altKey && e.key === "d") {
        e.preventDefault();
        router.push("/admin");
      }

      // Alt+P — Go to Products
      if (e.altKey && e.key === "p") {
        e.preventDefault();
        router.push("/admin/produk");
      }

      // Alt+A — Go to Articles
      if (e.altKey && e.key === "a") {
        e.preventDefault();
        router.push("/admin/artikel");
      }

      // Alt+N — Create new (context-aware)
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        const path = window.location.pathname;
        if (path.startsWith("/admin/artikel")) {
          router.push("/admin/artikel/create");
        } else if (path.startsWith("/admin/kategori-produk")) {
          router.push("/admin/kategori-produk/create");
        } else if (path.startsWith("/admin/kategori-artikel")) {
          router.push("/admin/kategori-artikel/create");
        } else {
          router.push("/admin/produk/create");
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
