"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { SwiperClass } from "swiper/react";

import "swiper/css";

interface BrandData {
  id: number;
  name: string;
  logoImage: string;
  url: string;
}

export interface BrandSliderConfig {
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  pauseOnHover: boolean;
}

const defaultConfig: BrandSliderConfig = {
  autoplay: true,
  autoplayDelay: 3000,
  loop: true,
  pauseOnHover: false,
};

export default function BrandPartners({
  brands,
  sliderConfig,
}: {
  brands: BrandData[];
  sliderConfig?: BrandSliderConfig;
}) {
  const config = { ...defaultConfig, ...sliderConfig };
  const swiperRef = useRef<SwiperClass | null>(null);

  // Duplicate slides for Swiper loop mode (needs > slidesPerView * 2)
  const minSlidesForLoop = 11; // 5 visible + 5 duplicates + 1 buffer
  let slides = [...brands];
  if (slides.length > 0 && slides.length < minSlidesForLoop && config.loop) {
    while (slides.length < minSlidesForLoop) {
      slides = [...slides, ...brands];
    }
  }

  const enableAutoplay = config.autoplay && brands.length > 0;
  const enableLoop = config.loop && brands.length > 0;

  return (
    <div className="overflow-hidden space overflow-hidden">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="title-area text-center">
              <span className="sub-title text-anime-style-2">
                Partner Resmi Seaquill
              </span>
            </div>
          </div>
        </div>
        <div className="slider-area">
          <Swiper
            className="th-slider"
            modules={[Autoplay]}
            loop={enableLoop}
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
            breakpoints={{
              0: { slidesPerView: 1 },
              476: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
              1400: { slidesPerView: 5 },
            }}
          >
            {slides.map((brand, idx) => (
              <SwiperSlide key={`${brand.id}-${idx}`}>
                <div className="brand-item">
                  <a href={brand.url || "#"} target={brand.url ? "_blank" : undefined} rel={brand.url ? "noopener noreferrer" : undefined}>
                    <img className="original" src={brand.logoImage} alt={brand.name} />
                    <img className="gray" src={brand.logoImage} alt={brand.name} />
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
