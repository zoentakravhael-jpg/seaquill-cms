"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

interface ProjectItem {
  img: string;
  title: string;
  text: string;
}

interface ProjectSliderData {
  subTitle?: string;
  headingNormal?: string;
  heading?: string;
  paragraph?: string;
  sideParagraph?: string;
  items?: ProjectItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  speed?: number;
}

export default function TentangProjectSlider({ data }: { data: ProjectSliderData }) {
  const items = data.items || [];
  // Duplicate items for seamless loop if fewer than 4
  const slides = items.length > 0 && items.length < 4 ? [...items, ...items] : items;

  return (
    <section className="project-area position-relative space overflow-hidden" id="project-sec">
      <div className="container">
        <div className="row justify-content-lg-between justify-content-center align-items-center">
          <div className="col-lg-5">
            <div className="title-area">
              <span className="sub-title text-anime-style-2">{data.subTitle || "Tentang Sea-Quill"}</span>
              <h2 className="sec-title text-anime-style-3">
                <span className="fw-normal">{data.headingNormal || "Solusi Suplemen Modern,"}</span>{" "}
                {data.heading || "Kesehatan Berkualitas Setiap Hari"}
              </h2>
              <p className="fs-18 mb-30 pe-xl-5 wow fadeInUp">
                {data.paragraph || ""}
              </p>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="ps-xl-5 ms-xl-4 text-center text-lg-start">
              <p className="fs-18 wow fadeInUp">
                {data.sideParagraph || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="slider-area">
          <div style={{ position: "relative" }}>
            <Swiper
              modules={[Navigation, Autoplay]}
              loop={data.loop !== false}
              spaceBetween={56}
              speed={data.speed || 600}
              {...(data.autoplay !== false ? {
                autoplay: {
                  delay: data.autoplayDelay || 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                },
              } : {})}
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
              className="th-slider projectSlide has-shadow"
            >
              {slides.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="project-card">
                    <div className="box-img global-img">
                      <img src={item.img} alt="project image" />
                    </div>
                    <div className="box-content">
                      <h3 className="box-title">
                        <a href="#">{item.title}</a>
                      </h3>
                      <p className="box-text">{item.text}</p>
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
      </div>
    </section>
  );
}
