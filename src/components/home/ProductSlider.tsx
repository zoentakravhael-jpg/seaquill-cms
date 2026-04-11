"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { SwiperClass } from "swiper/react";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";

interface ProductData {
  id: number;
  name: string;
  slug: string;
  image: string;
  shortDescription: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface SectionData {
  subTitle: string;
  heading: string;
  paragraph: string;
}

interface ActiveFlags {
  bestSeller: boolean;
  newProduct: boolean;
}

export interface ProductSliderConfig {
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  pauseOnHover: boolean;
}

const defaultSliderConfig: ProductSliderConfig = {
  autoplay: true,
  autoplayDelay: 4000,
  loop: true,
  pauseOnHover: true,
};

export default function ProductSlider({
  products,
  section,
  activeFlags,
  sliderConfig,
}: {
  products: ProductData[];
  section: SectionData;
  activeFlags?: ActiveFlags;
  sliderConfig?: ProductSliderConfig;
}) {
  const showBestSeller = activeFlags?.bestSeller !== false;
  const showNewProduct = activeFlags?.newProduct !== false;
  const config = { ...defaultSliderConfig, ...sliderConfig };
  const swiperRef = useRef<SwiperClass | null>(null);

  // Duplicate slides so Swiper always has enough for loop mode (needs > slidesPerView * 2)
  const minSlidesForLoop = 7; // 3 visible + 3 duplicates + 1 buffer
  let slides = [...products];
  if (slides.length > 0 && slides.length < minSlidesForLoop) {
    while (slides.length < minSlidesForLoop) {
      slides = [...slides, ...products];
    }
  }

  const enableAutoplay = config.autoplay && products.length > 0;
  const enableLoop = config.loop && products.length > 0;

  return (
    <section
      className="project-area position-relative space-top overflow-hidden"
      id="project-sec"
    >
      <div className="container">
        <div className="row justify-content-lg-between justify-content-center align-items-center">
          <div className="col-lg-5">
            <div className="title-area text-center text-lg-start">
              <span className="sub-title text-anime-style-2">{section.subTitle}</span>
              <h2 className="sec-title text-anime-style-3">
                {section.heading} <span className="fw-normal"></span>
              </h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="ps-xl-5 ms-xl-4 text-center text-lg-start">
              <p className="fs-18 wow fadeInUp">
                {section.paragraph}
              </p>
            </div>
          </div>
        </div>
        <div className="slider-area">
          <Swiper
            className="th-slider projectSlide has-shadow"
            modules={[Navigation, Autoplay]}
            loop={enableLoop}
            spaceBetween={56}
            autoplay={
              enableAutoplay
                ? {
                    delay: config.autoplayDelay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: config.pauseOnHover,
                  }
                : false
            }
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              if (enableAutoplay && swiper.autoplay) {
                swiper.autoplay.start();
              }
            }}
            navigation={{
              prevEl: ".project-slider-prev",
              nextEl: ".project-slider-next",
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {slides.map((product, idx) => (
              <SwiperSlide key={`${product.id}-${idx}`}>
                <div className="project-card">
                  <div className="box-img global-img" style={{ position: "relative", overflow: "hidden" }}>
                    {((showBestSeller && product.isBestSeller) || (showNewProduct && product.isNew)) && (
                      <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 2, display: "flex", gap: 6 }}>
                        {showBestSeller && product.isBestSeller && (
                          <span style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.03em", textTransform: "uppercase", boxShadow: "0 2px 8px rgba(249,115,22,0.4)", display: "flex", alignItems: "center", gap: 5 }}>
                            <i className="fas fa-fire" style={{ fontSize: 11 }}></i> Best Seller
                          </span>
                        )}
                        {showNewProduct && product.isNew && (
                          <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.03em", textTransform: "uppercase", boxShadow: "0 2px 8px rgba(16,185,129,0.4)", display: "flex", alignItems: "center", gap: 5 }}>
                            <i className="fas fa-sparkles" style={{ fontSize: 11 }}></i> New
                          </span>
                        )}
                      </div>
                    )}
                    <Image src={product.image} alt={product.name} width={600} height={400} sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw" />
                  </div>
                  <div className="box-content">
                    <h3 className="box-title">
                      <Link href={`/produk/detail/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="box-text">{product.shortDescription}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="slider-arrow slider-prev project-slider-prev">
            <i className="far fa-arrow-left"></i>
          </button>
          <button className="slider-arrow slider-next project-slider-next">
            <i className="far fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
