"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

interface RelatedProduct {
  name: string;
  image: string;
  slug: string;
}

interface RelatedProductsSliderProps {
  products: RelatedProduct[];
}

export default function RelatedProductsSlider({ products }: RelatedProductsSliderProps) {
  return (
    <>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".related-slider-prev",
          nextEl: ".related-slider-next",
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        className="th-slider has-shadow"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="th-product product-grid">
              <div className="product-img">
                {product.image && <Image src={product.image} alt={product.name} width={600} height={400} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
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
                  <Link href={`/produk/detail/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>
                <span className="price"></span>
                <div className="btn-group justify-content-between">
                  <div className="quantity"></div>
                  <Link
                    href={`/produk/detail/${product.slug}`}
                    className="th-btn"
                  >
                    LIHAT DETAIL{" "}
                    <i className="fa-light fa-arrow-right-long ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="d-block d-md-none mt-40 text-center">
        <div className="icon-box">
          <button className="slider-arrow default related-slider-prev">
            <i className="far fa-arrow-left"></i>
          </button>
          <button className="slider-arrow default related-slider-next">
            <i className="far fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}
