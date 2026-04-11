"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";

interface GalleryItemData {
  id: number;
  image: string;
  caption: string;
  url: string;
}

interface GallerySectionData {
  label: string;
  icon: string;
  items: GalleryItemData[];
}

export default function GallerySliders({ sections }: { sections: GallerySectionData[] }) {
  return (
    <>
      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          <div className="gallery-divider"></div>
          <div className="position-relative" data-pos-for=".footer-layout2" data-sec-pos="">
            <div className="container">
              <div className="gallery-area">
                <div className="title-area text-center mb-40">
                  <span className="sub-title text-anime-style-2">
                    {section.label} gallery
                  </span>
                  <h2 className="sec-title text-anime-style-3">
                    @seaquill <span className="fw-normal">{section.label} Gallery</span>
                  </h2>
                </div>
                <div style={{ position: "relative" }}>
                  <Swiper
                    modules={[Navigation]}
                    navigation={{
                      prevEl: `.gallery-prev-${sIdx}`,
                      nextEl: `.gallery-next-${sIdx}`,
                    }}
                    breakpoints={{
                      0: { slidesPerView: 1 },
                      576: { slidesPerView: 2 },
                      768: { slidesPerView: 3 },
                      992: { slidesPerView: 3 },
                      1200: { slidesPerView: 4 },
                    }}
                    className="th-slider"
                  >
                    {section.items.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="gallery-insta">
                          <a
                            target="_blank"
                            href={item.url || "#"}
                            className="box-btn"
                            rel="noopener noreferrer"
                          >
                            <Image src={section.icon} alt="" width={24} height={24} />
                          </a>
                          <Image src={item.image} alt={item.caption || "Gallery"} width={400} height={400} sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 25vw" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className={`slider-arrow slider-prev gallery-prev-${sIdx}`}>
                    <i className="far fa-arrow-left"></i>
                  </button>
                  <button className={`slider-arrow slider-next gallery-next-${sIdx}`}>
                    <i className="far fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
