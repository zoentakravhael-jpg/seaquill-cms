import type { Metadata } from "next";
import { Inter, Outfit, Saira } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const saira = Saira({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-saira",
});

export const metadata: Metadata = {
  title: {
    default: "Seaquill - Suplemen Kesehatan Terpercaya",
    template: "%s | Seaquill",
  },
  description:
    "Sea-Quill adalah suplemen kesehatan berkualitas dengan berbagai pilihan produk yang telah bersertifikat BPOM dan Halal.",
  keywords: "Seaquill, Sea-Quill, suplemen, kesehatan, BPOM, Halal, vitamin, mineral, omega 3",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://seaquill-cms-production.up.railway.app"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Seaquill",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/img/favicons/favicon-32x32.png", sizes: "32x32" },
      { url: "/assets/img/favicons/favicon-96x96.png", sizes: "96x96" },
      { url: "/assets/img/favicons/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: [
      { url: "/assets/img/favicons/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`no-js ${inter.variable} ${outfit.variable} ${saira.variable}`}>
      <head>
        {/* Original Template CSS — pixel-perfect match */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.min.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/size-reduction.css" />
        {/* Override: kurangi space kosong di bawah nav */}
        <style dangerouslySetInnerHTML={{ __html: `
          .hero-style1 { padding-top: 250px !important; }
          @media (max-width: 991px) { .hero-style1 { padding-top: 200px !important; } }
          @media (max-width: 575px) { .hero-style1 { padding-top: 160px !important; } }
          .breadcumb-wrapper { padding-top: 80px !important; padding-bottom: 80px !important; }
        ` }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
