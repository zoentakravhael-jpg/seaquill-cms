import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seaquill - Suplemen Kesehatan Terpercaya",
  description:
    "Sea-Quill adalah suplemen kesehatan berkualitas dengan berbagai pilihan produk yang telah bersertifikat BPOM dan Halal.",
  keywords: "Seaquill, suplemen, kesehatan, BPOM, Halal",
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
    <html lang="id" className="no-js">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&family=Saira:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Original Template CSS — pixel-perfect match */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.min.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/size-reduction.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
