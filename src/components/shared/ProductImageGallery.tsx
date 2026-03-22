"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const validImages = images.filter(Boolean);

  return (
    <div className="productSlide">
      <Swiper
        modules={[Navigation, Thumbs]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        spaceBetween={0}
        navigation={{
          prevEl: ".product-slider-prev",
          nextEl: ".product-slider-next",
        }}
        className="th-slider"
      >
        {validImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="slider-arrow style3 slider-prev product-slider-prev">
        <i className="far fa-arrow-left"></i>
      </button>
      <button className="slider-arrow style3 slider-next product-slider-next">
        <i className="far fa-arrow-right"></i>
      </button>
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={3}
        spaceBetween={32}
        className="th-slider product-grid2-thumb"
      >
        {validImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
