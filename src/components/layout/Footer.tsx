"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LayoutDataProps } from "@/types/layout";

interface FooterNavLink {
  label: string;
  href: string;
}
interface FooterNavCategory {
  title: string;
  source: "produk" | "artikel" | "custom";
  links: FooterNavLink[];
}

export default function Footer({
  siteSettings,
  productCategories,
  blogCategories,
}: LayoutDataProps) {
  const s = siteSettings;
  const description =
    s.site_description ||
    "Sea-Quill adalah suplemen kesehatan berkualitas dengan berbagai pilihan produk yang telah bersertifikat BPOM dan Halal. Kami berkomitmen membantu masyarakat Indonesia hidup lebih sehat dan aktif setiap hari.";
  const phone = s.contact_phone || "021-1234-5678";
  const email = s.contact_email || "info@seaquill.co.id";
  const address =
    s.contact_address || "Jl. Harmoni Plaza Blok A No. 8, Jakarta Pusat 10150";
  const copyright =
    s.site_copyright ||
    'Copyright © 2025 Seaquill. All Rights Reserved.';
  const tagline =
    s.site_tagline ||
    "Pilihan Suplemen Tepat untuk Kesehatan Optimal Anda";
  const tokopediaUrl = s.social_tokopedia || "https://www.tokopedia.com/seaquill";
  const shopeeUrl = s.social_shopee || "https://shopee.co.id/seaquill";

  // Parse footer navigation categories from DB
  const footerNavCategories = useMemo(() => {
    const defaultCategories: FooterNavCategory[] = [
      { title: "Produk Seaquill", source: "produk", links: [] },
      { title: "Artikel Kesehatan", source: "artikel", links: [] },
      {
        title: "Bantuan & Support",
        source: "custom",
        links: [
          { label: "FAQs", href: "/faq" },
          { label: "Kontak Kami", href: "/hubungi-kami" },
          { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
          { label: "Pusat Bantuan", href: "/pusat-bantuan" },
          { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
        ],
      },
    ];

    try {
      if (s.footer_nav) {
        const parsed = JSON.parse(s.footer_nav);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as FooterNavCategory[];
      }
    } catch {
      // ignore
    }
    return defaultCategories;
  }, [s.footer_nav]);

  // Resolve links for each category
  function resolveLinks(cat: FooterNavCategory): FooterNavLink[] {
    if (cat.source === "produk") {
      return productCategories.map((c) => ({ label: c.title, href: `/produk/${c.slug}` }));
    }
    if (cat.source === "artikel") {
      return blogCategories.map((c) => ({ label: c.title, href: `/artikel/${c.slug}` }));
    }
    return cat.links;
  }

  return (
    <footer
      className="footer-wrapper bg-title footer-layout1"
      data-bg-src="/assets/img/bg/footer_bg_5.png"
      style={{ backgroundImage: "url(/assets/img/bg/footer_bg_5.png)" }}
    >
      <div className="widget-area">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6 col-xxl-3 col-xl-4">
              <div className="widget footer-widget mb-0">
                <div className="th-widget-about">
                  <div className="about-logo">
                    <Link href="/">
                      <Image src="/assets/img/logo.svg" alt="Seaquill" width={200} height={60} />
                    </Link>
                  </div>
                  <p className="about-text">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            {footerNavCategories.map((cat, idx) => {
              const links = resolveLinks(cat);
              if (links.length === 0) return null;
              return (
                <div key={idx} className="col-md-6 col-xl-auto">
                  <div className="widget widget_nav_menu footer-widget">
                    <h3 className="widget_title">{cat.title}</h3>
                    <div className="menu-all-pages-container">
                      <ul className="menu">
                        {links.map((link, li) => (
                          <li key={li}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-end align-items-end">
            <div className="col-xl-4">
              <div className="footer-widget-about">
                <div className="th-widget-about">
                  <p className="footer-info">
                    <i className="fa-sharp fa-solid fa-phone"></i>
                    <span>
                      <a className="text-inherit" href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
                        {phone}
                      </a>
                    </span>
                  </p>
                  <p className="footer-info">
                    <i className="fa-sharp fa-solid fa-envelope"></i>
                    <span>
                      <a className="text-inherit" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="row gy-4">
                <div className="col-lg-6">
                  <div className="title-area mb-0 text-center text-lg-start">
                    <h4 className="sec-title m-0">
                      {tagline}
                    </h4>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="footer-top-btn">
                    <div className="btn-group justify-content-center justify-content-lg-end">
                      <a
                        href={tokopediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "0 6px" }}
                      >
                        <img
                          src="/assets/img/tokopedia-btn.png"
                          alt="Tokopedia"
                          style={{ height: "45px", width: "auto" }}
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
                          style={{ height: "30px", width: "auto" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-wrap">
          <div className="container">
            <div className="row gy-2 align-items-center">
              <div className="col-lg-5">
                <p className="copyright-text">
                  {copyright}
                </p>
              </div>
              <div className="col-lg-7 text-center text-lg-end">
                <div className="social-links">
                  <span className="title">Social Media:</span>
                  {s.social_facebook && (
                    <a href={s.social_facebook} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {s.social_twitter && (
                    <a href={s.social_twitter} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {s.social_linkedin && (
                    <a href={s.social_linkedin} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {s.social_instagram && (
                    <a href={s.social_instagram} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {(s.contact_whatsapp || s.social_whatsapp) && (
                    <a href={s.contact_whatsapp || s.social_whatsapp} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="heart-rate2"
        data-bg-src="/assets/img/shape/preloader3.svg"
        style={{ backgroundImage: "url(/assets/img/shape/preloader3.svg)" }}
      ></div>
      <div
        className="heart-rate"
        data-bg-src="/assets/img/shape/preloader2.svg"
        style={{ backgroundImage: "url(/assets/img/shape/preloader2.svg)" }}
      >
        <div className="fade-in"></div>
        <div className="fade-out"></div>
      </div>
    </footer>
  );
}
