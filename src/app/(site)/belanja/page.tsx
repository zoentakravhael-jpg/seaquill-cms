import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Belanja Sea-Quill di Marketplace",
  description: "Temukan produk Sea-Quill di marketplace pilihan Anda — Tokopedia, Shopee, Lazada, dan TikTok Shop.",
};

interface MarketplaceItem {
  name: string;
  logo: string;
  url: string;
  description: string;
  badge: string;
  badgeColor: string;
  bgColor: string;
  active: boolean;
}

interface SocialItem {
  name: string;
  logo: string;
  url: string;
  description: string;
  badge: string;
  badgeColor: string;
  iconBg: string;
  iconSize: number;
  active: boolean;
}

const MARKETPLACE_FALLBACK: MarketplaceItem[] = [
  { name: "Tokopedia", logo: "/assets/img/icon/tokopedia.svg", url: "https://www.tokopedia.com/seaquill", description: "Belanja produk Sea-Quill original dengan promo dan gratis ongkir.", badge: "Tokopedia Official", badgeColor: "#42b549", bgColor: "#f8fafc", active: true },
  { name: "Shopee", logo: "/assets/img/icon/shopee.svg", url: "https://shopee.co.id/seaquill", description: "Voucher cashback dan diskon eksklusif produk Sea-Quill.", badge: "Shopee Official Store", badgeColor: "#ee4d2d", bgColor: "#f8fafc", active: true },
  { name: "Lazada", logo: "/assets/img/icon/lazada.svg", url: "https://www.lazada.co.id/shop/seaquill", description: "Harga terbaik dan promo menarik produk Sea-Quill.", badge: "Lazada Official Store", badgeColor: "#0f146d", bgColor: "#f8fafc", active: true },
  { name: "TikTok Shop", logo: "/assets/img/icon/tiktok.svg", url: "https://www.tiktok.com/@seaquill.id", description: "Tonton konten edukatif dan langsung beli produk Sea-Quill.", badge: "TikTok Official", badgeColor: "#010101", bgColor: "#f8fafc", active: true },
];

const SOCIAL_FALLBACK: SocialItem[] = [
  { name: "TikTok", logo: "/assets/img/icon/tiktok.svg", url: "https://www.tiktok.com/@seaquill.id", description: "Konten edukatif dan tips kesehatan dari Sea-Quill.", badge: "TikTok", badgeColor: "#010101", iconBg: "#f8fafc", iconSize: 34, active: true },
  { name: "Instagram", logo: "/assets/img/icon/instagram.svg", url: "https://www.instagram.com/seaquill.id", description: "Info produk, promo, dan konten inspiratif setiap hari.", badge: "Instagram", badgeColor: "#E1306C", iconBg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", iconSize: 24, active: true },
  { name: "WhatsApp", logo: "/assets/img/icon/wa.svg", url: "https://wa.me/6281234567890", description: "Hubungi kami langsung untuk konsultasi produk dan pemesanan.", badge: "WhatsApp", badgeColor: "#25D366", iconBg: "#f8fafc", iconSize: 34, active: true },
];

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

export default async function BelanjaPage() {
  const settings = await getSiteSettings();

  // Read from DB JSON settings with fallback to hardcoded defaults
  const mpSection = parseJSON<{ heading: string; subTitle: string; items: MarketplaceItem[] }>(
    settings.belanja_marketplace_section,
    { heading: "Marketplace", subTitle: "Belanja produk Sea-Quill original", items: MARKETPLACE_FALLBACK }
  );
  const socialSection = parseJSON<{ heading: string; subTitle: string; items: SocialItem[] }>(
    settings.belanja_social_section,
    { heading: "Social Media", subTitle: "Follow & hubungi kami", items: SOCIAL_FALLBACK }
  );
  const headerConfig = parseJSON<{ title: string; subtitle: string; logo: string }>(
    settings.belanja_header,
    { title: "Belanja & Hubungi Sea-Quill", subtitle: "Pilih marketplace favorit atau hubungi kami melalui social media", logo: "" }
  );
  const footerConfig = parseJSON<{ text: string; url: string; visible: boolean }>(
    settings.belanja_footer_link,
    { text: "Lihat semua produk di website", url: "/produk", visible: true }
  );

  const marketplaces = mpSection.items.filter((m) => m.active && m.url.trim() !== "");
  const socials = socialSection.items.filter((m) => m.active && m.url.trim() !== "");

  const headerLogo = headerConfig.logo || settings.header_logo || "/assets/img/logo.svg";

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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header: logo + title */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            {headerConfig.title}
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
            {headerConfig.subtitle}
          </p>
        </div>

        <style>{`
          .belanja-card {
            display: flex; align-items: center; gap: 16px;
            background: #fff; border-radius: 16px; padding: 18px 20px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.08); border: 1px solid #f1f5f9;
            text-decoration: none; color: inherit;
            transition: transform 0.18s, box-shadow 0.18s;
          }
          .belanja-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(0,0,0,0.13);
          }
          .belanja-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
          }
          @media (max-width: 768px) {
            .belanja-grid {
              grid-template-columns: 1fr;
              gap: 40px;
            }
          }
        `}</style>

        <div className="belanja-grid">
          {/* Marketplace Column */}
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-store" style={{ color: "#ea8b12", fontSize: "16px" }}></i>
                {mpSection.heading}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>{mpSection.subTitle}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {marketplaces.map((m, idx) => (
                <a key={idx} href={m.url} target="_blank" rel="noopener noreferrer" className="belanja-card">
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: m.bgColor || "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Image src={m.logo} alt={m.name} width={34} height={34} style={{ width: "34px", height: "34px", objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: m.badgeColor, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>
                      {m.badge}
                    </span>
                    <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", margin: "0 0 3px" }}>{m.name}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{m.description}</p>
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: m.badgeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className="fa-solid fa-arrow-right" style={{ color: "#fff", fontSize: "12px" }}></i>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Social Media Column */}
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-share-nodes" style={{ color: "#ea8b12", fontSize: "16px" }}></i>
                {socialSection.heading}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>{socialSection.subTitle}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {socials.map((m, idx) => {
                const size = m.iconSize || 34;
                const hasGradientBg = m.iconBg.startsWith("linear");
                return (
                <a key={idx} href={m.url} target="_blank" rel="noopener noreferrer" className="belanja-card">
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {hasGradientBg ? (
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Image src={m.logo} alt={m.name} width={size} height={size} style={{ width: `${size}px`, height: `${size}px`, objectFit: "contain" }} />
                      </div>
                    ) : (
                      <Image src={m.logo} alt={m.name} width={size} height={size} style={{ width: `${size}px`, height: `${size}px`, objectFit: "contain" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: m.badgeColor, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>
                      {m.badge}
                    </span>
                    <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", margin: "0 0 3px" }}>{m.name}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{m.description}</p>
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: m.badgeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className="fa-solid fa-arrow-right" style={{ color: "#fff", fontSize: "12px" }}></i>
                  </div>
                </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Back link */}
        {footerConfig.visible && (
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <Link
            href={footerConfig.url}
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
            {footerConfig.text}
          </Link>
        </div>
        )}
      </div>
    </div>
    </>
  );
}
