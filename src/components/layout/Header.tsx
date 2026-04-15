"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { LayoutDataProps, NavProduct } from "@/types/layout";
import type { NavItem } from "@/types/layout";

export default function Header({
  siteSettings,
  productCategories,
  blogCategories,
  recentPosts,
  products = [],
}: LayoutDataProps & { products?: NavProduct[] }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({ name: "", email: "", phone: "", productName: "", message: "" });
  const [connectStatus, setConnectStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [connectError, setConnectError] = useState("");
  const router = useRouter();

  // Build navigation dynamically from DB nav_menu setting
  const navigationData: NavItem[] = useMemo(() => {
    const prodChildren = productCategories.map((c) => ({
      label: c.title,
      href: `/produk/${c.slug}`,
    }));
    const blogChildren = blogCategories.map((c) => ({
      label: c.title,
      href: `/artikel/${c.slug}`,
    }));

    // Try to parse nav_menu from site settings
    let menuItems: { label: string; href: string; submenuSource: string }[] = [];
    try {
      if (siteSettings.nav_menu) {
        menuItems = JSON.parse(siteSettings.nav_menu);
      }
    } catch {
      // ignore parse errors
    }

    // If we have valid items from DB, use them
    if (Array.isArray(menuItems) && menuItems.length > 0) {
      return menuItems.map((item) => {
        let children: NavItem[] | undefined;
        if (item.submenuSource === "produk" && prodChildren.length > 0) {
          children = prodChildren;
        } else if (item.submenuSource === "artikel" && blogChildren.length > 0) {
          children = blogChildren;
        }
        return { label: item.label, href: item.href, children };
      });
    }

    // Fallback to hardcoded defaults
    return [
      { label: "Beranda", href: "/" },
      { label: "Tentang Seaquill", href: "/tentang" },
      {
        label: "Produk Seaquill",
        href: "/produk",
        children: prodChildren.length > 0 ? prodChildren : undefined,
      },
      {
        label: "Artikel",
        href: "/artikel",
        children: blogChildren.length > 0 ? blogChildren : undefined,
      },
      { label: "Promo & Event", href: "/promo" },
      { label: "Galeri", href: "/galeri" },
      { label: "Hubungi Kami", href: "/hubungi-kami" },
    ];
  }, [productCategories, blogCategories, siteSettings.nav_menu]);

  // Format recent posts for sidebar
  const formattedPosts = useMemo(
    () =>
      recentPosts.map((p) => ({
        image: p.image,
        date: new Date(p.publishedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        title: p.title,
        href: `/artikel/${p.categorySlug}/${p.slug}`,
      })),
    [recentPosts]
  );

  const s = siteSettings;
  const contactEmail = s.contact_email || "info.seaquill@gmail.com";
  const description =
    s.site_description ||
    "Sea-Quill adalah suplemen kesehatan berkualitas dengan berbagai pilihan produk yang telah bersertifikat BPOM dan Halal. Kami berkomitmen membantu masyarakat Indonesia hidup lebih sehat dan aktif setiap hari.";
  const tokopediaUrl = s.social_tokopedia || "https://www.tokopedia.com/seaquill";
  const shopeeUrl = s.social_shopee || "https://shopee.co.id/seaquill";
  const headerLogo = s.header_logo || "/assets/img/logo.svg";
  const headerLogoSticky = s.header_logo_sticky || "/assets/img/logo.jpg";

  const headerBadges = useMemo(() => {
    try {
      const parsed = JSON.parse(s.header_badges || "[]");
      return Array.isArray(parsed) ? parsed as { icon: string; label: string; value: string }[] : [];
    } catch {
      return [];
    }
  }, [s.header_badges]);

  // Parse popup config from DB
  const popupConfig = useMemo(() => {
    const defaults = {
      enabled: true,
      headerTitle: "Connect To Us",
      headerSubtitle: "Isi form berikut & tim kami akan segera menghubungi Anda",
      headerIcon: "fa-solid fa-paper-plane",
      buttonText: "Connect To Us",
      buttonIcon: "fa-solid fa-envelope",
      gradientFrom: "#d97706",
      gradientTo: "#f59e0b",
      buttonGradientFrom: "#d97706",
      buttonGradientTo: "#ea8b12",
      fields: {
        name: { visible: true, required: true, label: "Nama", placeholder: "Nama lengkap Anda" },
        email: { visible: true, required: true, label: "Email", placeholder: "email@contoh.com" },
        phone: { visible: true, required: false, label: "Nomor HP", placeholder: "+62 8xx-xxxx-xxxx" },
        product: { visible: true, required: false, label: "Produk Terkait", placeholder: "Pilih produk (opsional)" },
        message: { visible: true, required: true, label: "Pesan", placeholder: "Tuliskan pertanyaan atau kebutuhan Anda..." },
      },
      productSource: "auto" as const,
      manualProducts: [] as string[],
      successTitle: "Pesan Terkirim!",
      successMessage: "Terima kasih! Kami akan menghubungi Anda segera.",
    };
    try {
      if (s.popup_connect_form) {
        return { ...defaults, ...JSON.parse(s.popup_connect_form) };
      }
    } catch { /* ignore */ }
    return defaults;
  }, [s.popup_connect_form]);

  const popupProducts = useMemo(() => {
    if (popupConfig.productSource === "manual" && popupConfig.manualProducts.length > 0) {
      return popupConfig.manualProducts.map((name: string, idx: number) => ({ id: idx, name }));
    }
    return products;
  }, [popupConfig.productSource, popupConfig.manualProducts, products]);

  async function handleConnectSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setConnectStatus("loading");
    setConnectError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...connectForm, subject: connectForm.productName ? `Connect To Us — Produk: ${connectForm.productName}` : "Connect To Us", source: "contact" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setConnectError(data.error || "Terjadi kesalahan.");
        setConnectStatus("error");
      } else {
        setConnectStatus("success");
        setConnectForm({ name: "", email: "", phone: "", productName: "", message: "" });
        setTimeout(() => { setConnectOpen(false); setConnectStatus("idle"); }, 3000);
      }
    } catch {
      setConnectError("Gagal mengirim pesan. Coba lagi.");
      setConnectStatus("error");
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    const q = input.value.trim();
    if (q.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      input.value = "";
    }
  }

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".sticky-wrapper");
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSubmenu = (index: number) => {
    setOpenSubmenus((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      {/* Sidemenu */}
      <div className={`sidemenu-wrapper${sideMenuOpen ? " active" : ""}`}>
        <div className="sidemenu-content">
          <button
            className="closeButton sideMenuCls"
            onClick={() => setSideMenuOpen(false)}
          >
            <i className="far fa-times"></i>
          </button>
          <div className="widget footer-widget mb-0">
            <div className="th-widget-about">
              <div className="about-logo">
                <Link href="/">
                  <img src={headerLogo} alt="Seaquill" />
                </Link>
              </div>
              <p className="about-text">
                {description}
              </p>
            </div>
          </div>
          <div className="widget footer-widget">
            <h3 className="widget_title">Recent Posts</h3>
            <div className="recent-post-wrap">
              {formattedPosts.map((post, i) => (
                <div className="recent-post" key={i}>
                  <div className="media-img">
                    <Link href={post.href}>
                      <Image src={post.image} alt={post.title} width={100} height={100} />
                    </Link>
                  </div>
                  <div className="media-body">
                    <div className="recent-post-meta">
                      <Link href="/artikel">
                        <i className="fa-sharp fa-solid fa-calendar-days"></i>
                        {post.date}
                      </Link>
                    </div>
                    <h4 className="post-title">
                      <Link className="text-inherit" href={post.href}>
                        {post.title}
                      </Link>
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="widget footer-widget">
            <h3 className="widget_title">Social Media:</h3>
            <div className="th-social">
              {s.social_facebook && <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>}
              {s.social_twitter && <a href={s.social_twitter} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>}
              {s.social_pinterest && <a href={s.social_pinterest} target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest-p"></i></a>}
              {s.social_linkedin && <a href={s.social_linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>}
              {s.social_instagram && <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>}
            </div>
          </div>
        </div>
      </div>

      {/* Connect To Us Modal */}
      {connectOpen && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 99999, display: "flex", alignItems: "center",
            justifyContent: "center", padding: "20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setConnectOpen(false); }}
        >
          <div style={{
            background: "#fff", borderRadius: "20px", width: "100%",
            maxWidth: "660px", overflow: "hidden", position: "relative",
            boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          }}>
            {/* Gradient header strip */}
            <div style={{
              background: `linear-gradient(135deg, ${popupConfig.gradientFrom} 0%, ${popupConfig.gradientTo} 100%)`,
              padding: "26px 32px 22px",
              position: "relative",
            }}>
              <button
                onClick={() => setConnectOpen(false)}
                style={{
                  position: "absolute", top: "14px", right: "18px",
                  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%", width: "32px", height: "32px",
                  cursor: "pointer", color: "#fff", fontSize: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                <i className="fal fa-times"></i>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  background: "rgba(255,255,255,0.22)", borderRadius: "12px",
                  width: "48px", height: "48px", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={popupConfig.headerIcon} style={{ color: "#fff", fontSize: "20px" }}></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>{popupConfig.headerTitle}</h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "13px", marginTop: "2px" }}>{popupConfig.headerSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div style={{ padding: "28px 32px 32px" }}>
              {connectStatus === "success" ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{
                    width: "70px", height: "70px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 24px rgba(34,197,94,0.35)",
                  }}>
                    <i className="fa-solid fa-check" style={{ fontSize: "28px", color: "#fff" }}></i>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 8px", color: "#1a1a1a" }}>{popupConfig.successTitle}</p>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{popupConfig.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleConnectSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Row 1: Name + Email */}
                  <div style={{ display: "grid", gridTemplateColumns: popupConfig.fields.name.visible && popupConfig.fields.email.visible ? "1fr 1fr" : "1fr", gap: "14px" }}>
                    {popupConfig.fields.name.visible && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{popupConfig.fields.name.label} {popupConfig.fields.name.required && <span style={{ color: "#ea8b12" }}>*</span>}</label>
                      <input
                        type="text"
                        placeholder={popupConfig.fields.name.placeholder}
                        value={connectForm.name}
                        onChange={(e) => setConnectForm(f => ({ ...f, name: e.target.value }))}
                        required={popupConfig.fields.name.required}
                        style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", color: "#1a1a1a" }}
                        onFocus={(e) => e.target.style.borderColor = "#ea8b12"}
                        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                    )}
                    {popupConfig.fields.email.visible && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{popupConfig.fields.email.label} {popupConfig.fields.email.required && <span style={{ color: "#ea8b12" }}>*</span>}</label>
                      <input
                        type="email"
                        placeholder={popupConfig.fields.email.placeholder}
                        value={connectForm.email}
                        onChange={(e) => setConnectForm(f => ({ ...f, email: e.target.value }))}
                        required={popupConfig.fields.email.required}
                        style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", color: "#1a1a1a" }}
                        onFocus={(e) => e.target.style.borderColor = "#ea8b12"}
                        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                    )}
                  </div>
                  {/* Row 2: Phone + Product */}
                  {(popupConfig.fields.phone.visible || popupConfig.fields.product.visible) && (
                  <div style={{ display: "grid", gridTemplateColumns: popupConfig.fields.phone.visible && popupConfig.fields.product.visible ? "1fr 1fr" : "1fr", gap: "14px" }}>
                    {popupConfig.fields.phone.visible && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{popupConfig.fields.phone.label} {popupConfig.fields.phone.required && <span style={{ color: "#ea8b12" }}>*</span>}</label>
                      <input
                        type="tel"
                        placeholder={popupConfig.fields.phone.placeholder}
                        value={connectForm.phone}
                        onChange={(e) => setConnectForm(f => ({ ...f, phone: e.target.value }))}
                        required={popupConfig.fields.phone.required}
                        style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", color: "#1a1a1a" }}
                        onFocus={(e) => e.target.style.borderColor = "#ea8b12"}
                        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                    )}
                    {popupConfig.fields.product.visible && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{popupConfig.fields.product.label} {popupConfig.fields.product.required && <span style={{ color: "#ea8b12" }}>*</span>}</label>
                      <select
                        value={connectForm.productName}
                        onChange={(e) => setConnectForm(f => ({ ...f, productName: e.target.value }))}
                        required={popupConfig.fields.product.required}
                        style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", color: connectForm.productName ? "#1a1a1a" : "#9ca3af", background: "#fff", cursor: "pointer" }}
                        onFocus={(e) => e.target.style.borderColor = "#ea8b12"}
                        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      >
                        <option value="">{popupConfig.fields.product.placeholder}</option>
                        {popupProducts.map((p: { id: number; name: string }) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    )}
                  </div>
                  )}
                  {/* Message full width */}
                  {popupConfig.fields.message.visible && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{popupConfig.fields.message.label} {popupConfig.fields.message.required && <span style={{ color: "#ea8b12" }}>*</span>}</label>
                    <textarea
                      placeholder={popupConfig.fields.message.placeholder}
                      value={connectForm.message}
                      onChange={(e) => setConnectForm(f => ({ ...f, message: e.target.value }))}
                      required={popupConfig.fields.message.required}
                      rows={4}
                      style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", resize: "vertical", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", color: "#1a1a1a", fontFamily: "inherit" }}
                      onFocus={(e) => e.target.style.borderColor = "#ea8b12"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>
                  )}
                  {connectError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="fa-solid fa-circle-exclamation" style={{ color: "#ef4444", fontSize: "14px", flexShrink: 0 }}></i>
                      <p style={{ color: "#dc2626", fontSize: "13px", margin: 0 }}>{connectError}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={connectStatus === "loading"}
                    style={{
                      padding: "13px 20px",
                      background: connectStatus === "loading" ? "#f5a623" : `linear-gradient(135deg, ${popupConfig.buttonGradientFrom}, ${popupConfig.buttonGradientTo})`,
                      color: "#fff", border: "none", borderRadius: "10px",
                      fontSize: "15px", fontWeight: 700,
                      cursor: connectStatus === "loading" ? "wait" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      boxShadow: "0 4px 14px rgba(234,139,18,0.4)",
                      transition: "opacity 0.2s",
                      opacity: connectStatus === "loading" ? 0.75 : 1,
                    }}
                  >
                    {connectStatus === "loading" ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        Kirim Pesan
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Popup */}
      <div className={`popup-search-box d-none d-lg-block${searchOpen ? " show" : ""}`}>
        <button className="searchClose" onClick={() => setSearchOpen(false)}>
          <i className="fal fa-times"></i>
        </button>
        <form action="#" onSubmit={handleSearch}>
          <input type="text" placeholder="What are you looking for?" />
          <button type="submit">
            <i className="fal fa-search"></i>
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      <div className={`th-menu-wrapper${mobileMenuOpen ? " th-body-visible" : ""}`}>
        <div className="th-menu-area text-center">
          <button
            className="th-menu-toggle"
            onClick={() => setMobileMenuOpen(false)}
          >
            <i className="fal fa-times"></i>
          </button>
          <div className="mobile-logo">
            <Link href="/">
              <Image src={headerLogo} alt="Seaquill" width={200} height={60} priority />
            </Link>
          </div>
          <div className="th-mobile-menu">
            <ul>
              {navigationData.map((item, index) => (
                <li
                  key={index}
                  className={
                    item.children
                      ? `menu-item-has-children th-item-has-children has-custom-toggle${
                          openSubmenus.includes(index) ? " th-active" : ""
                        }`
                      : ""
                  }
                >
                  <Link href={item.href}>{item.label}</Link>
                  {item.children && (
                    <>
                      <button
                        type="button"
                        className="submenu-toggle-btn"
                        aria-label="Toggle submenu"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubmenu(index);
                        }}
                      >
                        <span className="toggle-icon">
                          {openSubmenus.includes(index) ? "−" : "+"}
                        </span>
                      </button>
                      <ul
                        className={`sub-menu th-submenu${
                          openSubmenus.includes(index) ? " th-open" : ""
                        }`}
                        style={{
                          display: openSubmenus.includes(index) ? "block" : "none",
                        }}
                      >
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Link href={child.href}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="th-header header-layout1 header-absolute">
        <div className="container">
          <div className="menu-area">
            <div className="menu-top">
              <div className="container">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="header-logo">
                      <Link href="/">
                        <Image src={headerLogo} alt="Seaquill" width={200} height={80} style={{ maxHeight: "80px", width: "auto" }} priority />
                      </Link>
                    </div>
                  </div>
                  {/* Mobile hamburger — inline with logo */}
                  <div className="col-auto d-lg-none">
                    <button
                      type="button"
                      className="th-menu-toggle"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <i className="far fa-bars"></i>
                    </button>
                  </div>
                  <div className="col-auto d-none d-sm-block">
                    <div className="header-info-wrap">
                      {headerBadges.map((badge, i) => (
                        <React.Fragment key={i}>
                          <div className="header-info">
                            <div className="header-info_icon">
                              <img
                                src={badge.icon}
                                alt={badge.value}
                                style={{ width: "24px", height: "24px" }}
                              />
                            </div>
                            <div className="media-body">
                              <span className="header-info_label">{badge.label}</span>
                              <p className="header-info_link">{badge.value}</p>
                            </div>
                          </div>
                          <div className="divided"></div>
                        </React.Fragment>
                      ))}

                      {/* Email */}
                      <div className="header-info">
                        <div className="header-info_icon">
                          <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div className="media-body">
                          <span className="header-info_label">Mail</span>
                          <p className="header-info_link">
                            <a href={`mailto:${contactEmail}`}>
                              {contactEmail}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="sticky-wrapper">
              {/* Main Menu Area */}
              <div className="container">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="header-wrapp">
                      <div className="header-logo style1">
                        <Link href="/">
                          <img
                            src={headerLogoSticky}
                            alt="Seaquill"
                            style={{ height: "60px", width: "auto" }}
                          />
                        </Link>
                      </div>
                      <nav className="main-menu style2 d-none d-lg-inline-block">
                        <ul>
                          {navigationData.map((item, index) => (
                            <li
                              key={index}
                              className={
                                item.children ? "menu-item-has-children" : ""
                              }
                            >
                              <Link href={item.href}>{item.label}</Link>
                              {item.children && (
                                <ul className="sub-menu">
                                  {item.children.map((child, childIndex) => (
                                    <li key={childIndex}>
                                      <Link href={child.href}>
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="header-button d-none d-lg-block" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {popupConfig.enabled && (
                      <button
                        onClick={() => { setConnectOpen(true); setConnectStatus("idle"); setConnectError(""); }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          padding: "8px 14px", background: "var(--theme-color, #009f56)",
                          color: "#fff", border: "none", borderRadius: "6px",
                          cursor: "pointer", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
                        }}
                      >
                        <i className={popupConfig.buttonIcon}></i>
                        {popupConfig.buttonText}
                      </button>
                      )}
                      <Link
                        href="/belanja"
                        style={{ padding: "0 10px", display: "inline-flex", alignItems: "center", color: "inherit" }}
                        title="Belanja di Marketplace"
                      >
                        <i className="fa-solid fa-cart-shopping" style={{ fontSize: "22px" }}></i>
                      </Link>
                    </div>
                    {/* Old mobile hamburger removed — now in menu-top */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
