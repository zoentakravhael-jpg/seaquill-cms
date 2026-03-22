"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  image: string;
  slug: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.length >= 2
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : products;

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-6 col-lg-4 ms-auto">
          <div className="widget widget_search">
            <form
              className="search-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Filter produk..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit">
                <i className="far fa-search"></i>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="row gy-4">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              slug={product.slug}
              isBestSeller={product.isBestSeller}
              isNew={product.isNew}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="fas fa-search fa-2x text-muted mb-3 d-block"></i>
            <p className="text-muted">Tidak ada produk yang cocok dengan &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </>
  );
}
