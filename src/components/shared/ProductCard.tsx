import Link from "next/link";

interface ProductCardProps {
  name: string;
  image: string;
  slug: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export default function ProductCard({ name, image, slug, isBestSeller, isNew }: ProductCardProps) {
  return (
    <div className="col-xl-4 col-md-6">
      <div className="th-product product-grid">
        <div className="product-img" style={{ position: "relative", overflow: "hidden" }}>
          {(isBestSeller || isNew) && (
            <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 2, display: "flex", gap: 6 }}>
              {isBestSeller && (
                <span style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.03em", textTransform: "uppercase", boxShadow: "0 2px 8px rgba(249,115,22,0.4)", display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="fas fa-fire" style={{ fontSize: 11 }}></i> Best Seller
                </span>
              )}
              {isNew && (
                <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.03em", textTransform: "uppercase", boxShadow: "0 2px 8px rgba(16,185,129,0.4)", display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="fas fa-sparkles" style={{ fontSize: 11 }}></i> New
                </span>
              )}
            </div>
          )}
          {image && <img src={image} alt="Product Image" />}
          <div className="actions">
            <a href="#QuickView" className="icon-btn popup-content">
              <i className="far fa-eye"></i>
            </a>
            <a href="#" className="icon-btn">
              <i className="far fa-cart-plus"></i>
            </a>
            <a href="#" className="icon-btn">
              <i className="far fa-heart"></i>
            </a>
          </div>
        </div>
        <div className="product-content">
          <h3 className="product-title">
            <Link href={`/produk/detail/${slug}`}>{name}</Link>
          </h3>
          <span className="price"></span>
          <div className="btn-group justify-content-between">
            <div className="quantity"></div>
            <Link href={`/produk/detail/${slug}`} className="th-btn">
              LIHAT DETAIL{" "}
              <i className="fa-light fa-arrow-right-long ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
