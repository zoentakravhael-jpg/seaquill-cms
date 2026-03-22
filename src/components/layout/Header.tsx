"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LayoutDataProps } from "@/types/layout";
import type { NavItem } from "@/types/layout";

export default function Header({
  siteSettings,
  productCategories,
  blogCategories,
  recentPosts,
}: LayoutDataProps) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);
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
                      <img src={post.image} alt="Blog Image" />
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
              <img src={headerLogo} alt="Seaquill" />
            </Link>
          </div>
          <div className="th-mobile-menu">
            <ul>
              {navigationData.map((item, index) => (
                <li
                  key={index}
                  className={
                    item.children
                      ? `menu-item-has-children th-item-has-children${
                          openSubmenus.includes(index) ? " th-active" : ""
                        }`
                      : ""
                  }
                >
                  <Link href={item.href}>{item.label}</Link>
                  {item.children && (
                    <>
                      <span
                        className="th-mean-expand"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu(index);
                        }}
                      ></span>
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
                <div className="row align-items-center justify-content-center justify-content-sm-between">
                  <div className="col-auto">
                    <div className="header-logo">
                      <Link href="/">
                        <img src={headerLogo} alt="Seaquill" style={{ maxHeight: "80px", width: "auto" }} />
                      </Link>
                    </div>
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
                    <div className="header-button d-none d-lg-block">
                      <a
                        href={tokopediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "0 6px" }}
                      >
                        <img
                          src="/assets/img/tokopedia-btn.png"
                          alt="Tokopedia"
                          style={{ height: "30px", width: "auto" }}
                        />
                      </a>
                      <a
                        href={shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "0 6px" }}
                      >
                        <img
                          src="/assets/img/shopee-btn.png"
                          alt="Shopee"
                          style={{ height: "20px", width: "auto" }}
                        />
                      </a>
                    </div>
                    <button
                      type="button"
                      className="th-menu-toggle d-inline-block d-lg-none"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <i className="far fa-bars"></i>
                    </button>
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
