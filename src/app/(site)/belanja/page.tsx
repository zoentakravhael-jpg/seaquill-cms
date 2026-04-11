import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Belanja Sea-Quill di Marketplace",
  description: "Temukan produk Sea-Quill di marketplace pilihan Anda — Tokopedia, Shopee, dan TikTok Shop.",
};

const MARKETPLACE_DEFAULTS = [
  {
    key: "social_tokopedia",
    name: "Tokopedia",
    logo: "/assets/img/icon/tokopedia.svg",
    color: "#42b549",
    bgHover: "#3aa040",
    desc: "Belanja produk Sea-Quill original lengkap dengan promo dan gratis ongkir di Tokopedia.",
    defaultUrl: "https://www.tokopedia.com/seaquill",
    badge: "Tokopedia Official",
  },
  {
    key: "social_shopee",
    name: "Shopee",
    logo: "/assets/img/icon/shopee.svg",
    color: "#ee4d2d",
    bgHover: "#d94428",
    desc: "Nikmati kemudahan belanja produk Sea-Quill, voucher cashback, dan diskon eksklusif di Shopee.",
    defaultUrl: "https://shopee.co.id/seaquill",
    badge: "Shopee Official Store",
  },
  {
    key: "social_tiktok_shop",
    name: "TikTok Shop",
    logo: "/assets/img/icon/tiktok.svg",
    color: "#010101",
    bgHover: "#2a2a2a",
    desc: "Tonton konten edukatif dan langsung beli produk Sea-Quill di TikTok Shop.",
    defaultUrl: "https://www.tiktok.com/@seaquill.id",
    badge: "TikTok Official",
  },
];

export default async function BelanjaPage() {
  const settings = await getSiteSettings();

  const marketplaces = MARKETPLACE_DEFAULTS.map((m) => ({
    ...m,
    url: settings[m.key] || m.defaultUrl,
  })).filter((m) => m.url.trim() !== "");

  const headerLogo = settings.header_logo || "/assets/img/logo.svg";

  return (
    <>
      <Breadcrumb title="Belanja Sea-Quill" items={[{ label: "Home", href: "/" }, { label: "Belanja" }]} />
      <div
        style={{
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #fff7ed 100%)",
          paddingTop: "60px",
          paddingBottom: "80px",
        }}
      >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Header: logo + title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/">
            <Image
              src={headerLogo}
              alt="Sea-Quill"
              width={120}
              height={48}
              style={{ height: "48px", width: "auto", marginBottom: "20px" }}
            />
          </Link>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#1a1a1a",
              margin: "0 0 10px",
              lineHeight: 1.2,
            }}
          >
            Belanja Sea-Quill
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
            Pilih marketplace favorit Anda untuk mendapatkan produk Sea-Quill original
          </p>
        </div>

        {/* Marketplace cards */}
        <style>{`
          .belanja-card {
            display: flex; align-items: center; gap: 20px;
            background: #fff; border-radius: 16px; padding: 20px 24px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.08); border: 1px solid #f1f5f9;
            text-decoration: none; color: inherit;
            transition: transform 0.18s, box-shadow 0.18s;
          }
          .belanja-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(0,0,0,0.13);
          }
        `}</style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          {marketplaces.map((m) => (
            <a
              key={m.key}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="belanja-card"
            >
              {/* Logo circle */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "14px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={m.logo}
                  alt={m.name}
                  width={40}
                  height={40}
                  style={{ width: "40px", height: "40px", objectFit: "contain" }}
                />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: m.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {m.badge}
                </span>
                <p style={{ fontWeight: 700, fontSize: "16px", color: "#1a1a1a", margin: "0 0 4px" }}>{m.name}</p>
                <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
              </div>

              {/* Arrow */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: m.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-arrow-right" style={{ color: "#fff", fontSize: "13px" }}></i>
              </div>
            </a>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            href="/produk"
            style={{
              color: "#64748b",
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: "12px" }}></i>
            Lihat semua produk di website
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
